import Reservation from "../models/reservationModels.js";
import { notifyTableBooked } from "../utils/notificationHelper.js";

/* =========================
   SIMULATED PAYMENTS
========================= */

const simulateJazzCash = async ({ walletNumber, amount }) => {
  console.log(`[JazzCash] Charging ${walletNumber} Rs ${amount}`);
  return { success: true, transactionId: `JC-${Date.now()}` };
};

const simulateEasyPaisa = async ({ walletNumber, amount }) => {
  console.log(`[EasyPaisa] Charging ${walletNumber} Rs ${amount}`);
  return { success: true, transactionId: `EP-${Date.now()}` };
};

const simulateCardPayment = async ({ cardDetails, amount }) => {
  console.log(`[Card] Charging card *${cardDetails?.last4} Rs ${amount}`);
  return { success: true, transactionId: `CD-${Date.now()}` };
};

/* =========================
   CREATE RESERVATION
========================= */

export const createReservation = async (req, res) => {
  try {
    const {
      user,
      table,
      cartItems,
      paymentMethod,
      totalAmount,
      walletNumber,
      cardDetails,
      userId,
    } = req.body;

    // FIX guests
    if (table?.guests) {
      table.guests = parseInt(table.guests, 10) || 0;
    }

    // VALIDATION
    if (
      !user?.name ||
      !user?.phone ||
      !table?.tableNumber ||
      !table?.seats ||
      !table?.date ||
      !table?.time
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    if (
      (paymentMethod === "jazzcash" || paymentMethod === "easypaisa") &&
      !walletNumber
    ) {
      return res.status(400).json({
        success: false,
        message: `Please provide your ${
          paymentMethod === "jazzcash" ? "JazzCash" : "EasyPaisa"
        } number`,
      });
    }

    // CHECK EXISTING TABLE
    const existing = await Reservation.findOne({
      "table.tableNumber": table.tableNumber,
      status: "active",
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Table already booked",
      });
    }

    // PAYMENT LOGIC
    let isPaid = false;
    let transactionId = "";
    let paymentNote = "";
    let paidAt = null;

    if (paymentMethod === "jazzcash") {
      const result = await simulateJazzCash({ walletNumber, amount: totalAmount });

      if (!result.success) {
        return res.status(402).json({
          success: false,
          message: "JazzCash payment failed",
        });
      }

      isPaid = true;
      transactionId = result.transactionId;
      paymentNote = `Paid via JazzCash (${walletNumber})`;
      paidAt = new Date();
    }

    if (paymentMethod === "easypaisa") {
      const result = await simulateEasyPaisa({ walletNumber, amount: totalAmount });

      if (!result.success) {
        return res.status(402).json({
          success: false,
          message: "EasyPaisa payment failed",
        });
      }

      isPaid = true;
      transactionId = result.transactionId;
      paymentNote = `Paid via EasyPaisa (${walletNumber})`;
      paidAt = new Date();
    }

    if (paymentMethod === "card") {
      const result = await simulateCardPayment({ cardDetails, amount: totalAmount });

      if (!result.success) {
        return res.status(402).json({
          success: false,
          message: "Card payment failed",
        });
      }

      isPaid = true;
      transactionId = result.transactionId;
      paymentNote = `Paid via Card (*${cardDetails?.last4})`;
      paidAt = new Date();
    }

    if (paymentMethod === "cash") {
      paymentNote = "Cash on Arrival";
    }

    // SAVE RESERVATION
    const reservation = await Reservation.create({
      user,
      table,
      cartItems,
      paymentMethod,
      walletNumber: walletNumber || "",
      cardLast4: cardDetails?.last4 || "",
      transactionId,
      isPaid,
      paidAt,
      paymentNote,
      totalAmount,
      status: "active",
    });

    // NOTIFICATION
    if (userId) {
      await notifyTableBooked(
        userId,
        table.tableNumber,
        table.date,
        table.time,
        totalAmount
      );
    }

    res.status(201).json({
      success: true,
      reservation,
    });

  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Reservation failed",
    });
  }
};

/* =========================
   GET USER RESERVATIONS
========================= */

export const getUserReservations = async (req, res) => {
  try {
    const { email } = req.query;

    const query = email ? { "user.email": email } : {};

    const reservations = await Reservation.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      reservations,
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
};

/* =========================
   GET ALL RESERVATIONS
========================= */

export const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      reservations,
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
};

/* =========================
   DELETE RESERVATION
========================= */

export const deleteReservation = async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Deleted",
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
};

/* =========================
   MARK AS PAID (FIXED)
========================= */

export const markAsPaid = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.json({
        success: false,
        message: "Not found",
      });
    }

    reservation.isPaid = true;
    reservation.paidAt = new Date();

    // SAFE FIX HERE 👇
    reservation.paymentNote =
      req.body?.note || "Manually marked as paid by admin";

    await reservation.save();

    res.json({
      success: true,
      reservation,
    });

  } catch (err) {
    console.log("MARK PAID ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =========================
   MARK AS COMPLETED
========================= */

export const markAsCompleted = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status: "completed" },
      { new: true }
    );

    if (!reservation) {
      return res.json({
        success: false,
        message: "Not found",
      });
    }

    res.json({
      success: true,
      reservation,
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
};