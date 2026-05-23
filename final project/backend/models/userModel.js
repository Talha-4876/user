import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
}, { timestamps: true });

// Prevent Overwrite Error ✅
const userModel = mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;

