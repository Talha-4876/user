import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    country: { type: String, default: "Pakistan" },
    city: { type: String, required: true },
    street: { type: String, required: true },
    apartment: { type: String },
    postalCode: { type: String },
    deliveryInstructions: { type: String },
    paymentMethod: { type: String, default: "cash" },

    cartItems: [
      {
        _id: String,
        name: String,
        quantity: Number,
        price: Number,
        image: String
      }
    ],

    deliveryCharge: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },

    // ✅ FIXED
    status: {
      type: String,
      default: "Pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Delivery", deliverySchema);