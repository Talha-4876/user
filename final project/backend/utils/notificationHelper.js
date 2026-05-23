// utils/notificationHelper.js
import Notification from "../models/Notification.js";

export const createNotification = async ({
  userId, type, icon, title, message, orderId = null, amount = null,
}) => {
  try {
    await Notification.create({ userId, type, icon, title, message, orderId, amount });
  } catch (err) {
    console.error("Notification error:", err.message);
  }
};

export const notifyOrderPlaced = (userId, orderId, amount) =>
  createNotification({
    userId, orderId, amount,
    type: "order", icon: "bag",
    title: "Order Successfully Placed!",
    message: `Your order #${orderId} has been confirmed. We're preparing your food with love.`,
  });

export const notifyOrderDelivery = (userId, orderId) =>
  createNotification({
    userId, orderId,
    type: "delivery", icon: "bike",
    title: "Order Out for Delivery",
    message: `Your order #${orderId} is on its way! Estimated arrival in 20 minutes.`,
  });

export const notifyOrderCompleted = (userId, orderId) =>
  createNotification({
    userId, orderId,
    type: "order", icon: "check",
    title: "Order Completed 🎉",
    message: `Order #${orderId} delivered successfully. Enjoy your meal!`,
  });

export const notifyPaymentSuccess = (userId, orderId, amount) =>
  createNotification({
    userId, orderId, amount,
    type: "payment", icon: "card",
    title: "Transaction Successful",
    message: `Payment of Rs. ${amount} received for order #${orderId}. Thank you!`,
  });

export const notifyRefund = (userId, orderId, amount) =>
  createNotification({
    userId, orderId, amount,
    type: "payment", icon: "card",
    title: "Refund Processed",
    message: `Rs. ${amount} refunded for order #${orderId}. Takes 2-3 business days.`,
  });

export const notifyPromo = (userId, promoText) =>
  createNotification({
    userId,
    type: "promo", icon: "gift",
    title: "Special Offer Just for You 🎁",
    message: promoText,
  });

// ✅ Table reservation notification
export const notifyTableBooked = (userId, tableNumber, date, time, amount) =>
  createNotification({
    userId,
    type: "order", icon: "check",
    title: "Table Successfully Reserved! 🍽️",
    message: `Table #${tableNumber} booked for ${date} at ${time}. Total: Rs. ${amount}. We look forward to seeing you!`,
  });