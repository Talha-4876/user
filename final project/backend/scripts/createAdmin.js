if (existing) {
  console.log("Admin already exists!");
} else {
  await User.create({
    name: "Admin",
    email: "admin@biteboss.com",
    password: "Admin@123",   // ← apna password yahan set karo
    role: "admin",
  });
  console.log("✅ Admin created: admin@biteboss.com / Admin@123");
}

await mongoose.disconnect();