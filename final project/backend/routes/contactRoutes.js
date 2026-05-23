import express from "express";
import Contact from "../models/Contact.js";
import { transporter } from "../utils/mailer.js";

const router = express.Router();

/* =========================
   CREATE MESSAGE
========================= */
router.post("/", async (req, res) => {
  try {
    const contact = await Contact.create(req.body);

    // EMAIL (SAFE)
    try {
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: process.env.ADMIN_EMAIL,
        subject: `📩 New Message from ${contact.name}`,
        html: `<p>${contact.message}</p>`,
      });
    } catch (mailErr) {
      console.log("Mail send failed (ignored) ❌:", mailErr.message);
    }

    res.json({ success: true, contact });

  } catch (err) {
    console.error("Create Contact Error ❌:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* =========================
   GET ALL
========================= */
router.get("/", async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* =========================
   MARK AS READ
========================= */
router.put("/:id/read", async (req, res) => {
  try {
    const updated = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* =========================
   DELETE
========================= */
router.delete("/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* =========================
   REPLY (CRASH SAFE + FIXED)
========================= */
router.post("/:id/reply", async (req, res) => {
  try {
    const { replyMessage } = req.body || {};

    if (!replyMessage) {
      return res.status(400).json({
        success: false,
        message: "Reply message required"
      });
    }

    const msg = await Contact.findById(req.params.id);

    if (!msg) {
      return res.status(404).json({
        success: false,
        message: "Message not found"
      });
    }

    // initialize replies array if missing
    if (!msg.replies) {
      msg.replies = [];
    }

    // save reply in DB
    msg.replies.push({
      message: replyMessage,
      from: "admin",
      date: new Date()
    });

    await msg.save();

    // send email (SAFE)
    try {
      await transporter.sendMail({
        from: `"Support Team" <${process.env.EMAIL}>`,
        to: msg.email,
        subject: "💬 Reply from Admin",
        html: `
          <div style="font-family:Arial">
            <h2>Reply from Admin</h2>
            <p>Hi ${msg.name},</p>
            <div style="padding:10px;background:#f3f3f3">
              ${replyMessage}
            </div>
          </div>
        `
      });
    } catch (mailErr) {
      console.log("Reply mail failed (ignored) ❌:", mailErr.message);
    }

    res.json({ success: true, message: "Reply sent" });

  } catch (err) {
    console.error("Reply Error ❌:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error in reply"
    });
  }
});

export default router;