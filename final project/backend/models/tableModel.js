import mongoose from "mongoose";

const tableSchema = new mongoose.Schema(
{
  tableNumber: {
    type: Number,
    required: true,
    unique: true,
  },

  seats: {
    type: Number,
    required: true,
  },

  label: {
    type: String,
    default: "",
  },

  location: {
    type: String,
    default: "",
  },

  type: {
    type: String,
    default: "",
  },

  furniture: {
    type: String,
    default: "",
  },

  description: {
    type: String,
    default: "",
  },

  image: {
    type: String,
    default: "",
  },

  price: {
    type: Number,
    default: 0,
  },

  features: {
    type: [String],
    default: [],
  },

  isActive: {
    type: Boolean,
    default: true,
  },
},
{ timestamps: true }
);

export default mongoose.model("Table", tableSchema);