import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";

const allowedFields = [
  "name",
  "description",
  "price",
  "category",
  "image",
  "stock",
  "isAvailable",
];

// Only copy fields we allow, so clients can't set ratings or other internals
const pickFields = (body = {}) =>
  Object.fromEntries(
    allowedFields.filter((f) => body[f] !== undefined).map((f) => [f, body[f]])
  );

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const sortMap = {
  price_asc: { price: 1 },
  price_desc: { price: -1 },
  rating: { ratingsAverage: -1 },
  newest: { createdAt: -1 },
};

export const getProducts = asyncHandler(async (req, res) => {
  const { search, category, sort, page, limit } = req.query;

  const filter = {};
  if (search) filter.name = { $regex: escapeRegex(search), $options: "i" };
  if (category) filter.category = category;

  const pageNum = Math.max(parseInt(page) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit) || 12, 1), 50);

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort(sortMap[sort] || sortMap.newest)
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  res.json({
    products,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    total,
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(pickFields(req.body));
  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  Object.assign(product, pickFields(req.body));
  const updated = await product.save();
  res.json(updated);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  await product.deleteOne();
  res.json({ message: "Product removed" });
});