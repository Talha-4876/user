import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    user: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },

    table: {
      tableNumber: { type: Number, required: true },
      seats: { type: Number, required: true },
      date: { type: String, required: true },
      time: { type: String, required: true },
      label: { type: String, default: "" },
      guests: { type: Number, default: 1 },
      occasion: { type: String, default: "" },
      specialRequests: { type: String, default: "" },
    },

    cartItems: [
      {
        _id: String,
        name: String,
        price: Number,
        quantity: Number,
      },
    ],

    // ── Payment ──────────────────────────────────────────
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "jazzcash", "easypaisa"],
      default: "cash",
    },

    // For JazzCash / EasyPaisa — store the mobile wallet number
    walletNumber: {
      type: String,
      default: "",
    },

    // For Card — store last 4 digits only (never full PAN)
    cardLast4: {
      type: String,
      default: "",
    },

    // Transaction / reference ID returned by payment gateway
    transactionId: {
      type: String,
      default: "",
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    paymentNote: {
      type: String,
      default: "",
    },
    // ─────────────────────────────────────────────────────

    totalAmount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Reservation", reservationSchema);