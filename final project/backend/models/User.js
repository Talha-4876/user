import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// HASH PASSWORD BEFORE SAVE
userSchema.pre("save", async function () {
  // password change nahi hua
  if (!this.isModified("password")) return;

  // generate salt
  const salt = await bcrypt.genSalt(10);

  // hash password
  this.password = await bcrypt.hash(
    this.password,
    salt
  );
});

// MATCH PASSWORD
userSchema.methods.matchPassword =
  async function (password) {
    return await bcrypt.compare(
      password,
      this.password
    );
  };

const User = mongoose.model(
  "User",
  userSchema
);

export default User;