// routes/newsletterRoute.js
import express from "express";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

const router = express.Router();

// ─── Subscriber Schema ───────────────────────────────────────────────
const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

// ─── Nodemailer Transporter ──────────────────────────────────────────
// .env mein yeh variables set karein:
// EMAIL=your_gmail@gmail.com
// PASS=your_app_password   ← Gmail App Password (2FA ke baad milti hai)

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

// ─── Email HTML Template ─────────────────────────────────────────────
const buildEmailHTML = (message) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    body { margin: 0; padding: 0; background: #F8F4EE; font-family: 'DM Sans', Arial, sans-serif; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; border: 1px solid #EDE0C8; }
    .header { background: #1C1410; padding: 32px 40px; text-align: center; }
    .logo { color: #F2A83E; font-size: 28px; font-weight: 700; letter-spacing: 1px; }
    .tagline { color: #C4A97A; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-top: 6px; }
    .body { padding: 36px 40px; }
    .message { font-size: 15px; color: #3C2F1C; line-height: 1.8; white-space: pre-wrap; }
    .divider { border: none; border-top: 1px solid #EDE0C8; margin: 28px 0; }
    .cta { display: block; width: fit-content; margin: 0 auto; background: #F2A83E; color: #1C1410; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 600; font-size: 14px; }
    .footer { background: #1C1410; padding: 20px 40px; text-align: center; color: #8A7860; font-size: 12px; }
    .footer a { color: #C4A97A; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo">🍔 Bite Boss</div>
      <div class="tagline">Premium Dining Experience</div>
    </div>
    <div class="body">
      <p class="message">${message}</p>
      <hr class="divider" />
      <a href="#" class="cta">View Our Menu →</a>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Bite Boss. All rights reserved.</p>
      <p>123 Main Street, Your City &nbsp;|&nbsp; <a href="mailto:info@biteboss.com">info@biteboss.com</a></p>
    </div>
  </div>
</body>
</html>
`;

// ─── POST /api/newsletter/subscribe ──────────────────────────────────
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Already subscribed!' });
    }

    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    return res.status(201).json({
      success: true,
      message: 'Subscribed successfully! Welcome to Bite Boss family.',
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    return res.status(500).json({ success: false, message: 'Server error. Try again later.' });
  }
});

// ─── GET /api/newsletter/subscribers ─────────────────────────────────
router.get('/subscribers', async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });
    const total = subscribers.length;
    const thisMonth = subscribers.filter(s => {
      const now = new Date();
      const subDate = new Date(s.subscribedAt);
      return subDate.getMonth() === now.getMonth() &&
             subDate.getFullYear() === now.getFullYear();
    }).length;

    return res.status(200).json({
      success: true,
      total,
      thisMonth,
      subscribers,
    });
  } catch (error) {
    console.error('Fetch subscribers error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── DELETE /api/newsletter/subscribers/:id ───────────────────────────
router.delete('/subscribers/:id', async (req, res) => {
  try {
    await Subscriber.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: 'Subscriber removed.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── POST /api/newsletter/send ────────────────────────────────────────
// Admin is route se saare active subscribers ko email bhejega
router.post('/send', async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ success: false, message: 'Subject aur message dono zaroori hain.' });
    }

    // Saare active subscribers fetch karo
    const subscribers = await Subscriber.find({ isActive: true });

    if (subscribers.length === 0) {
      return res.status(400).json({ success: false, message: 'Koi active subscriber nahi hai.' });
    }

    // Har subscriber ko email bhejo
    let sent = 0;
    let failed = 0;

    for (const sub of subscribers) {
      try {
        await transporter.sendMail({
          from: `"Bite Boss 🍔" <${process.env.EMAIL}>`,
          to: sub.email,
          subject: subject,
          html: buildEmailHTML(message),
        });
        sent++;
      } catch (mailErr) {
        console.error(`Email fail: ${sub.email}`, mailErr.message);
        failed++;
      }
    }

    return res.status(200).json({
      success: true,
      message: `Emails bhej di gayi!`,
      sent,
      failed,
    });

  } catch (error) {
    console.error('Send newsletter error:', error);
    return res.status(500).json({ success: false, message: 'Server error. Dobara try karein.' });
  }
});

export { router, Subscriber };