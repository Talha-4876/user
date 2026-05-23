// models/Notification.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["order", "payment", "promo", "delivery", "review", "system"],
      default: "system",
    },
    icon: {
      type: String,
      enum: ["bag", "bike", "card", "check", "gift", "star"],
      default: "bag",
    },
    title:   { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    read:    { type: Boolean, default: false },
    orderId: { type: String,  default: null  },
    amount:  { type: Number,  default: null  },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;