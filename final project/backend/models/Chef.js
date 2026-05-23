import mongoose from "mongoose";

const chefSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true },
    specialty:   { type: String, required: true },
    img:         { type: String, required: true }, // Cloudinary URL
    imgPublicId: { type: String },                 // delete ke liye
    facebook:    { type: String, default: "#" },
    instagram:   { type: String, default: "#" },
    twitter:     { type: String, default: "#" },
  },
  { timestamps: true }
);

export default mongoose.model("Chef", chefSchema);