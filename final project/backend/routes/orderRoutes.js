import express from "express";
import {
  placeOrder,
  getMyOrders,
  getAllOrders,
} from "../controllers/orderController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// ================= USER =================

// Place order
router.post("/place", authMiddleware, placeOrder);

// Get my orders
router.get("/my-orders", authMiddleware, getMyOrders);

// ================= ADMIN =================

// Get all orders
router.get("/all", adminAuth, getAllOrders);

export default router;