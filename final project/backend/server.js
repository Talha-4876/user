// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import connectDB from "./config/mongodb.js";
import cloudinaryConfig from "./config/cloudinary.js";

dotenv.config();

/* ROUTES */
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";

import chatRoutes from "./routes/chatRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import chefRoutes from "./routes/chefRoutes.js";
import adminStatsRoutes from "./routes/adminStatsRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import tableRoutes from "./routes/tableRoutes.js";
import { router as newsletterRoutes } from "./routes/newsletterRoute.js";
import notificationRoutes from "./routes/notificationRoutes.js"; // ✅ NEW

/* MODELS */
import Contact from "./models/Contact.js";
import Reservation from "./models/reservationModels.js";
import Delivery from "./models/Delivery.js";

const app = express();
const port = process.env.PORT || 3200;

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  "/uploads",
  express.static(
    path.join(process.cwd(), "uploads")
  )
);

/* =========================
   ROUTES
========================= */
app.use("/api/auth",          authRoutes);
app.use("/api/product",       productRoutes);
app.use("/api/chat",          chatRoutes);
app.use("/api/contact",       contactRoutes);
app.use("/api/user",          userRoutes);
app.use("/api/order",         orderRoutes);
app.use("/api/reservations",  reservationRoutes);
app.use("/api/reviews",       reviewRoutes);
app.use("/api/delivery",      deliveryRoutes);

app.use("/api/admin",         adminStatsRoutes);
app.use("/api/chefs",         chefRoutes);
app.use("/api/analytics",     analyticsRoutes);
app.use("/api/tables",        tableRoutes);
app.use("/api/newsletter",    newsletterRoutes);
app.use("/api/notifications", notificationRoutes); // ✅ NEW

/* =========================
   NOTIFICATIONS API (Admin)
========================= */
app.get("/api/admin/notifications", async (req, res) => {
  try {
    const { Subscriber } = await import("./routes/newsletterRoute.js");

    const messages     = await Contact.countDocuments({ isRead: false });
    const reservations = await Reservation.countDocuments({ isPaid: false });
    const deliveries   = await Delivery.countDocuments({ status: "Pending" });
    const subscribers  = await Subscriber.countDocuments({});

    res.json({ messages, reservations, deliveries, subscribers });
  } catch (err) {
    console.error("Notifications error:", err);
    res.status(500).json({ success: false });
  }
});

/* =========================
   ADMIN REVIEWS
========================= */
app.get("/api/admin/reviews", async (req, res) => {
  try {
    const { default: Product } = await import("./models/Product.js");
    const products = await Product.find({}, { name: 1, reviews: 1 });

    const allReviews = products.flatMap((p) =>
      p.reviews.map((r) => ({
        ...r._doc,
        productId:   p._id,
        productName: p.name,
      }))
    );

    res.json({ success: true, reviews: allReviews });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

/* =========================
   SERVER START
========================= */
const startServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB Connected ✅");

    cloudinaryConfig();
    console.log("Cloudinary Connected ✅");

    app.listen(port, () => {
      console.log(`Server running on port ${port} 🚀`);
    });
  } catch (err) {
    console.log("Server failed ❌:", err.message);
    process.exit(1);
  }
};

startServer();