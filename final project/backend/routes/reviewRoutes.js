import express from "express";
import mongoose from "mongoose";
import Review from "../models/Review.js";

const router = express.Router();

/* ================= CREATE ================= */
router.post("/:productId", async (req, res) => {
  try {
    const review = await Review.create({
      productId: req.params.productId,
      name: req.body.name,
      rating: req.body.rating,
      comment: req.body.comment,
      likes: 0,
    });

    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* ================= PRODUCT REVIEWS ================= */
router.get("/product/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({
      productId: req.params.productId,
    }).sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* ================= ADMIN GET ALL REVIEWS ================= */
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* ================= LIKE ================= */
router.patch("/:id/like", async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    review.likes += 1;
    await review.save();

    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* ================= UPDATE ================= */
router.put("/:id", async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* ================= DELETE ================= */
router.delete("/:id", async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

export default router;