import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ReservationSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const r = state?.reservation;

  const METHOD_LABELS = {
    cash:      "💵 Cash on Delivery",
    jazzcash:  "🔴 JazzCash",
    easypaisa: "🟢 EasyPaisa",
    card:      "💳 Card",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center px-4 py-20">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center">

        {/* Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🎉</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Reservation Confirmed!</h1>
        <p className="text-gray-400 text-sm mb-6">
          Thank you, {r?.user?.name || "Guest"}. Your table is booked.
        </p>

        {r && (
          <div className="text-left space-y-3 bg-gray-50 rounded-2xl p-5 mb-6">
            <Row label="Table"   value={`#${r.table?.tableNumber}`} />
            <Row label="Date"    value={r.table?.date} />
            <Row label="Time"    value={r.table?.time} />
            <Row label="Guests"  value={r.table?.guests} />
            <Row label="Payment" value={METHOD_LABELS[r.paymentMethod] || r.paymentMethod} />
            <Row label="Amount"  value={`Rs ${r.totalAmount?.toLocaleString()}`} bold highlight />

            {r.isPaid && (
              <div className="flex items-center gap-2 text-green-600 text-sm font-semibold pt-1">
                <span>✅</span> Payment received
              </div>
            )}
            {!r.isPaid && r.paymentMethod === "cash" && (
              <div className="flex items-center gap-2 text-amber-600 text-sm font-semibold pt-1">
                <span>🕐</span> Pay at restaurant
              </div>
            )}
            {r.transactionId && (
              <p className="text-xs text-gray-400 pt-1">Ref: {r.transactionId}</p>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-3">

          {/* Primary — My Reservations */}
          <button
            onClick={() => navigate("/my-reservations")}
            className="w-full py-3.5 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600 transition shadow-[0_4px_16px_rgba(234,88,12,0.3)]"
          >
            📋 View My Reservations
          </button>

          {/* Secondary row */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition text-sm"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/cart")}
              className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition text-sm"
            >
              Order More 🍔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold, highlight }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={`${bold ? "font-bold text-base" : "font-medium"} ${highlight ? "text-orange-500" : "text-gray-800"}`}>
        {value}
      </span>
    </div>
  );
}