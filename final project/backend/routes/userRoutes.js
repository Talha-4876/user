import express from "express";
import {
  getMe,
  getUsers,
  createUser,
  deleteUser,
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// logged-in user
router.get("/me", authMiddleware, getMe);

// admin only
router.get("/", authMiddleware, adminAuth, getUsers);
router.post("/", authMiddleware, adminAuth, createUser);
router.delete("/:id", authMiddleware, adminAuth, deleteUser);

export default router;