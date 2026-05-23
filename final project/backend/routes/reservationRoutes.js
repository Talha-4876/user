import express from "express";
import {
  createReservation,
  getUserReservations,
  getAllReservations,
  deleteReservation,
  markAsPaid,
  markAsCompleted,
} from "../controllers/reservationController.js";
import Reservation from "../models/reservationModels.js";

const router = express.Router();

router.post("/create", createReservation);
router.get("/user", getUserReservations);
router.get("/all", getAllReservations);
router.delete("/delete/:id", deleteReservation);
router.put("/paid/:id", markAsPaid);
router.put("/complete/:id", markAsCompleted);

// =====================================================
//  AI ANALYTICS  (unchanged — extended with payment data)
// =====================================================
router.get("/analytics/ai", async (req, res) => {
  try {
    const reservations = await Reservation.find();

    let pending = 0;
    let paid = 0;
    let cashTotal = 0;
    let cardTotal = 0;
    let jazzTotal = 0;
    let easyTotal = 0;
    const hourMap = {};
    const dayMap = {};

    reservations.forEach((r) => {
      if (r.isPaid) paid++;
      else pending++;

      // Payment method breakdown
      if (r.paymentMethod === "cash") cashTotal++;
      if (r.paymentMethod === "card") cardTotal++;
      if (r.paymentMethod === "jazzcash") jazzTotal++;
      if (r.paymentMethod === "easypaisa") easyTotal++;

      if (typeof r.table?.time === "string" && r.table.time.includes(":")) {
        const hour = r.table.time.split(":")[0];
        hourMap[hour] = (hourMap[hour] || 0) + 1;
      }

      if (r.table?.date) {
        const day = new Date(r.table.date).toLocaleDateString("en-US", {
          weekday: "long",
        });
        dayMap[day] = (dayMap[day] || 0) + 1;
      }
    });

    const busiestHour =
      Object.keys(hourMap).sort((a, b) => hourMap[b] - hourMap[a])[0] || "N/A";
    const busiestDay =
      Object.keys(dayMap).sort((a, b) => dayMap[b] - dayMap[a])[0] || "N/A";

    const insight =
      pending > paid
        ? "More unpaid reservations detected — consider sending reminders"
        : paid > pending
        ? "Revenue flow is healthy"
        : "System Normal";

    return res.json({
      success: true,
      total: reservations.length,
      pending,
      paid,
      busiestHour,
      busiestDay,
      insight,
      paymentBreakdown: { cash: cashTotal, card: cardTotal, jazzcash: jazzTotal, easypaisa: easyTotal },
    });
  } catch (err) {
    console.error("AI Analytics Error:", err);
    return res.status(500).json({ success: false, message: "AI analytics failed" });
  }
});

export default router;