import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL?.trim(),
    pass: process.env.PASS?.trim(),
  },
  tls: {
    rejectUnauthorized: false, // helps in some network/SSL issues
  },
  connectionTimeout: 10000, // prevent hanging
});

// SAFE VERIFY (no crash, no nodemon loop)
const checkMailer = async () => {
  try {
    if (!process.env.EMAIL || !process.env.PASS) {
      console.log("Mailer skipped ❌ (missing env vars)");
      return;
    }

    await transporter.verify();
    console.log("Mailer ready ✅");
  } catch (err) {
    console.log("Mailer blocked ❌ (ignored):", err?.message || err);
  }
};

// run only once
checkMailer();