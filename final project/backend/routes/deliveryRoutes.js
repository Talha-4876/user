import express from "express";
import Delivery from "../models/Delivery.js";
import {
  notifyOrderPlaced,
  notifyPaymentSuccess,
} from "../utils/notificationHelper.js";

const router = express.Router();

const PKR_TO_USD = 0.0057;

// =========================
// CREATE ORDER
// =========================
router.post("/create", async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      country,
      city,
      address,
      apartment,
      postalCode,
      deliveryInstructions,
      paymentMethod,
      cartItems,
      deliveryCharge,
      userId, // ✅ frontend se aayega
    } = req.body;

    if (!name || !phone || !city || !address || !cartItems || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    const cartUSD = cartItems.map((item) => ({
      ...item,
      price: parseFloat((item.price * PKR_TO_USD).toFixed(2)),
    }));

    const deliveryUSD = parseFloat((deliveryCharge * PKR_TO_USD).toFixed(2));

    const totalUSD = parseFloat(
      (
        cartUSD.reduce((acc, i) => acc + i.price * i.quantity, 0) + deliveryUSD
      ).toFixed(2)
    );

    const newDelivery = new Delivery({
      name,
      phone,
      email,
      country,
      city,
      street: address,
      apartment,
      postalCode,
      deliveryInstructions,
      paymentMethod,
      cartItems: cartUSD,
      deliveryCharge: deliveryUSD,
      totalAmount: totalUSD,
      status: "Pending",
    });

    await newDelivery.save();

    // ✅ User ko notifications bhejo agar userId mile
    if (userId) {
      await notifyOrderPlaced(userId, newDelivery._id, totalUSD);

      // Card payment pe payment success notification bhi bhejo
      if (paymentMethod === "card") {
        await notifyPaymentSuccess(userId, newDelivery._id, totalUSD);
      }
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: newDelivery,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

// =========================
// GET ALL ORDERS
// =========================
router.get("/all", async (req, res) => {
  try {
    const deliveries = await Delivery.find().sort({ createdAt: -1 });
    res.json({ success: true, deliveries });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// =========================
// UPDATE STATUS
// =========================
router.put("/status/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Delivery.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({ success: true, order: updated });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// =========================
// DELETE ORDER
// =========================
router.delete("/delete/:id", async (req, res) => {
  try {
    await Delivery.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

export default router;