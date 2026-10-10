import Order from "../models/Order.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";

const statusFlow = ["Placed", "Preparing", "Out for delivery", "Delivered"];

export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body || {};

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  const addr = shippingAddress || {};
  const requiredAddress = ["fullName", "phone", "address", "city", "pincode"];
  if (requiredAddress.some((f) => !addr[f])) {
    res.status(400);
    throw new Error("Complete shipping address is required");
  }

  if (paymentMethod && !["COD", "Razorpay"].includes(paymentMethod)) {
    res.status(400);
    throw new Error("Invalid payment method");
  }

  // Merge duplicate products and validate quantities
  const merged = new Map();
  for (const item of items) {
    const qty = Number(item.quantity);
    if (!item.product || !Number.isInteger(qty) || qty < 1 || qty > 20) {
      res.status(400);
      throw new Error("Invalid item or quantity (1 to 20 per product)");
    }
    const key = String(item.product);
    merged.set(key, (merged.get(key) || 0) + qty);
  }

  const reserved = [];
  const orderItems = [];
  let totalPrice = 0;

  try {
    for (const [productId, qty] of merged) {
      // Atomic: check stock and reduce it in one database operation
      const product = await Product.findOneAndUpdate(
        { _id: productId, isAvailable: true, stock: { $gte: qty } },
        { $inc: { stock: -qty } },
        { new: true }
      );

      if (!product) {
        const existing = await Product.findById(productId);
        res.status(400);
        throw new Error(
          existing
            ? `${existing.name} is out of stock or unavailable`
            : "Product not found"
        );
      }

      reserved.push({ productId, qty });
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: qty,
      });
      totalPrice += product.price * qty;
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress: {
        fullName: addr.fullName,
        phone: addr.phone,
        address: addr.address,
        city: addr.city,
        pincode: addr.pincode,
      },
      totalPrice,
      paymentMethod: paymentMethod || "COD",
    });

    res.status(201).json(order);
  } catch (err) {
    // Put back any stock we already took
    await Promise.all(
      reserved.map((r) =>
        Product.updateOne({ _id: r.productId }, { $inc: { stock: r.qty } })
      )
    );
    throw err;
  }
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const isOwner = order.user._id.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not allowed to view this order");
  }

  res.json(order);
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const isOwner = order.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not allowed to cancel this order");
  }

  // Only cancel if it is still "Placed" (atomic check)
  const cancelled = await Order.findOneAndUpdate(
    { _id: order._id, status: "Placed" },
    { status: "Cancelled" },
    { new: true }
  );
  if (!cancelled) {
    res.status(400);
    throw new Error("Only orders that are still 'Placed' can be cancelled");
  }

  // Return the items to stock
  await Promise.all(
    cancelled.items.map((i) =>
      Product.updateOne({ _id: i.product }, { $inc: { stock: i.quantity } })
    )
  );

  res.json(cancelled);
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const orders = await Order.find(filter)
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  res.json(orders);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body || {};
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.status === "Cancelled" || order.status === "Delivered") {
    res.status(400);
    throw new Error(`Order is already ${order.status}`);
  }

  const newIndex = statusFlow.indexOf(status);
  if (newIndex === -1) {
    res.status(400);
    throw new Error(`Status must be one of: ${statusFlow.join(", ")}`);
  }
  if (newIndex <= statusFlow.indexOf(order.status)) {
    res.status(400);
    throw new Error("Status can only move forward");
  }

  order.status = status;
  if (status === "Delivered" && order.paymentMethod === "COD") {
    order.isPaid = true;
    order.paidAt = new Date();
  }

  const updated = await order.save();
  res.json(updated);
});

export const getOrderStats = asyncHandler(async (req, res) => {
  const [totals] = await Order.aggregate([
    { $match: { status: { $ne: "Cancelled" } } },
    { $group: { _id: null, revenue: { $sum: "$totalPrice" }, orders: { $sum: 1 } } },
  ]);

  const byStatus = await Order.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const topProducts = await Order.aggregate([
    { $match: { status: { $ne: "Cancelled" } } },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.name",
        quantity: { $sum: "$items.quantity" },
        revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
      },
    },
    { $sort: { quantity: -1 } },
    { $limit: 5 },
  ]);

  res.json({
    revenue: totals?.revenue || 0,
    orders: totals?.orders || 0,
    byStatus: Object.fromEntries(byStatus.map((s) => [s._id, s.count])),
    topProducts,
  });
});