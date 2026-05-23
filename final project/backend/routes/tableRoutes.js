import express from "express";

import upload from "../middleware/multer.js";

import {
  addTable,
  getAllTables,
  deleteTable,
  getTablesWithStatus,
  getTableBookings,
  getSingleTableDetails,
  updateTable,
} from "../controllers/tableController.js";

const router = express.Router();

router.post(
  "/add",
  upload.single("image"),
  addTable
);

router.get("/all", getAllTables);

router.put("/update/:id", updateTable);

router.delete("/delete/:id", deleteTable);

router.get("/status", getTablesWithStatus);

router.get("/bookings", getTableBookings);

router.get("/:tableNumber", getSingleTableDetails);

export default router;