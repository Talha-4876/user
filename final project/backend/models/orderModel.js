import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{ _id: String, name: String, quantity: Number, price: Number }],
  totalAmount: { type: Number, required: true },
  address: { type: String },
  paymentMethod: { type: String, default: "COD" },
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});

const orderModel = mongoose.model("Order", orderSchema);
export default orderModel; // ✅ default export
