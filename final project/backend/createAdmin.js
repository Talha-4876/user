import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "./models/Admin.js";
import dotenv from "dotenv";

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const createAdmin = async () => {
  const hashedPassword = await bcrypt.hash("123456", 10);
  const admin = await Admin.create({
    name: "Super Admin",
    email: "admin@example.com",
    password: hashedPassword,
  });
  console.log("Admin created:", admin);
  mongoose.disconnect();
};

createAdmin();