import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await User.findOne({
      email: "admin@biteboss.com",
    });

    if (existing) {
      console.log("Admin already exists!");
    } else {
      await User.create({
        name: "Admin",
        email: "admin@biteboss.com",
        password: "Admin@123",
        role: "admin",
      });

      console.log("✅ Admin created: admin@biteboss.com / Admin@123");
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("Seed admin error:", error);
    await mongoose.disconnect();
  }
};

seedAdmin();