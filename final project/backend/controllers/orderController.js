// controllers/orderController.js
import orderModel from "../models/orderModel.js";
import {
  notifyOrderPlaced,
  notifyPaymentSuccess,
} from "../utils/notificationHelper.js";

// Place order
export const placeOrder = async (req, res) => {
  try {
    const { items, totalAmount, address, paymentMethod } = req.body;
    if (!items || !totalAmount)
      return res.json({ success: false, message: "Items required" });

    const order = await orderModel.create({
      user: req.user.id,
      items,
      totalAmount,
      address,
      paymentMethod,
      status: "Pending",
      createdAt: Date.now(),
    });

    // ✅ Notifications — DB mein save hongi automatically
    await notifyOrderPlaced(req.user.id, order._id, totalAmount);
    await notifyPaymentSuccess(req.user.id, order._id, totalAmount);

    res.json({ success: true, order });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Get logged-in user's orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Get all orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};