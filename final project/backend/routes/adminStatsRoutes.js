import express from "express";
import Order from "../models/orderModel.js";
import Reservation from "../models/reservationModels.js";
import Delivery from "../models/Delivery.js";
import Contact from "../models/Contact.js";

const router = express.Router();

/* =========================
   ADMIN LIVE STATS API
========================= */
router.get("/stats", async (req, res) => {
  try {
    const orders = await Order.countDocuments({ status: "Pending" });
    const reservations = await Reservation.countDocuments({});
    const deliveries = await Delivery.countDocuments({ status: "Pending" });

    // 🔥 IMPORTANT: only unread messages
    const inbox = await Contact.countDocuments({ isRead: false });

    res.json({
      orders,
      reservations,
      deliveries,
      inbox,
    });

  } catch (err) {
    console.error("Stats error:", err.message);
    res.status(500).json({ success: false });
  }
});

export default router;