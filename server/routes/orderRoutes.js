import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, createOrder)
  .get(protect, adminOnly, getAllOrders);

router.get("/myorders", protect, getMyOrders);

router.route("/:id").get(protect, getOrderById);
router.put("/:id/cancel", protect, cancelOrder);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;