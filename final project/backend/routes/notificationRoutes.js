// routes/notificationRoutes.js
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Notification from "../models/Notification.js";

const router = express.Router();

/* ── Auth Middleware (User) ──────────────────────────────────────────────── */
const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer "))
      return res.status(401).json({ success: false, message: "No token provided" });

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // id jis bhi field mein ho — sab handle ho jayega
    const userId = decoded.id || decoded._id || decoded.userId;
    if (!userId)
      return res.status(401).json({ success: false, message: "Invalid token payload" });

    req.userId = new mongoose.Types.ObjectId(userId);
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError")
      return res.status(401).json({ success: false, message: "Session expired, please login again" });
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

/* ── GET /api/notifications ──────────────────────────────────────────────── */
router.get("/", protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const unreadCount = notifications.filter((n) => !n.read).length;
    res.json({ success: true, data: notifications, unreadCount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── PATCH /api/notifications/read-all ──────────────────────────────────── */
router.patch("/read-all", protect, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.userId, read: false },
      { $set: { read: true } }
    );
    res.json({ success: true, message: "All marked as read" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── DELETE /api/notifications (clear all) ───────────────────────────────── */
router.delete("/", protect, async (req, res) => {
  try {
    await Notification.deleteMany({ userId: req.userId });
    res.json({ success: true, message: "All notifications cleared" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── DELETE /api/notifications/:id ──────────────────────────────────────── */
router.delete("/:id", protect, async (req, res) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;