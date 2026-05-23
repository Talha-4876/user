import express from "express";
import {
  addProduct,
  listProducts,
  getProduct,
  addProductReview,
  getProductReviews,
  deleteProduct,
  updateProduct,
} from "../controllers/productController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminAuth from "../middleware/adminAuth.js";
import upload from "../config/multer.js";

const router = express.Router();

// Add Product (Admin + Image Upload)
router.post("/add", authMiddleware, adminAuth, upload.single("image"), addProduct);

// ✅ Update Product — multer optional, handles both JSON and multipart
router.put(
  "/update/:id",
  authMiddleware,
  adminAuth,
  (req, res, next) => {
    // Agar multipart/form-data ho toh multer use karo, warna skip
    const contentType = req.headers["content-type"] || "";
    if (contentType.includes("multipart/form-data")) {
      upload.single("image")(req, res, next);
    } else {
      next();
    }
  },
  updateProduct
);

// Get All Products / Menu
router.get("/list", listProducts);

// Get Single Product
router.get("/:id", getProduct);

// Delete Product
router.delete("/delete/:id", authMiddleware, adminAuth, deleteProduct);

// Add Review
router.post("/:id/review", authMiddleware, addProductReview);

// Get Reviews
router.get("/:id/reviews", getProductReviews);

export default router;