import express from "express";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import Chef from "../models/Chef.js";
import { uploadChef, uploadToCloudinary } from "../config/upload.js";

const router = express.Router();

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// GET — public
router.get("/", async (req, res) => {
  try {
    const chefs = await Chef.find().sort({ createdAt: -1 });
    res.json(chefs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST — add chef
router.post("/", protect, uploadChef.single("img"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image zaroori hai" });

    const result = await uploadToCloudinary(req.file.buffer);

    // ✅ description bhi destructure karo
    const { name, specialty, facebook, instagram, twitter } = req.body;

    const chef = new Chef({
      name,
      specialty,
      img:         result.secure_url,
      imgPublicId: result.public_id,
      facebook:    facebook  || "#",
      instagram:   instagram || "#",
      twitter:     twitter   || "#",
    });

    await chef.save();
    res.status(201).json(chef);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT — update chef
router.put("/:id", protect, uploadChef.single("img"), async (req, res) => {
  try {
    const chef = await Chef.findById(req.params.id);
    if (!chef) return res.status(404).json({ message: "Chef not found" });

    let imgData = {};
    if (req.file) {
      if (chef.imgPublicId) await cloudinary.uploader.destroy(chef.imgPublicId);
      const result = await uploadToCloudinary(req.file.buffer);
      imgData = { img: result.secure_url, imgPublicId: result.public_id };
    }

    // ✅ description bhi destructure karo
    const { name, specialty, facebook, instagram, twitter } = req.body;

    const updated = await Chef.findByIdAndUpdate(
      req.params.id,
      {
        name,
        specialty,
        facebook:    facebook  || "#",
        instagram:   instagram || "#",
        twitter:     twitter   || "#",
        ...imgData,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE
router.delete("/:id", protect, async (req, res) => {
  try {
    const chef = await Chef.findById(req.params.id);
    if (!chef) return res.status(404).json({ message: "Chef not found" });

    if (chef.imgPublicId) await cloudinary.uploader.destroy(chef.imgPublicId);

    await Chef.findByIdAndDelete(req.params.id);
    res.json({ message: "Chef deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;