import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    message: String,

    // 📩 read/unread system
    isRead: {
      type: Boolean,
      default: false,
    },

    // 💬 Gmail-style conversation thread
    replies: [
      {
        message: String,
        from: {
          type: String,
          enum: ["admin", "user"],
          default: "admin",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Contact", contactSchema);