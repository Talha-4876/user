import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String },
  discountPercent: { type: Number, default: 0 },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;


