// FILE: src/pages/MyReservations.jsx  (USER SIDE)
// Bite Boss — User's reservation history with payment status

import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../config";
import { useNavigate } from "react-router-dom";


export default function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

 const userEmail = JSON.parse(localStorage.getItem("userInfo") || "{}").email || "";

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/reservation/user?email=${userEmail}`);
        if (res.data.success) setReservations(res.data.reservations);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };
    if (userEmail) fetch();
    else setLoading(false);
  }, [userEmail]);

  const METHOD_META = {
    cash:      { label: "Cash on Delivery", icon: "💵" },
    jazzcash:  { label: "JazzCash",         icon: "🔴" },
    easypaisa: { label: "EasyPaisa",        icon: "🟢" },
    card:      { label: "Card",             icon: "💳" },
  };

  const STATUS_STYLE = {
    active:    { bg: "#fff7ed", color: "#c2410c", label: "Active"    },
    completed: { bg: "#dcfce7", color: "#15803d", label: "Completed" },
    cancelled: { bg: "#f1f5f9", color: "#64748b", label: "Cancelled" },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading your reservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 pt-24 pb-20 px-4 md:px-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Reservations</h1>
            <p className="text-gray-400 text-sm mt-1">{reservations.length} reservation{reservations.length !== 1 ? "s" : ""} found</p>
          </div>
          <button
            onClick={() => navigate("/reservation")}
            className="px-5 py-2.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition text-sm"
          >
            + New Reservation
          </button>
        </div>

        {/* Empty state */}
        {reservations.length === 0 && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-16 text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <p className="text-gray-600 font-semibold text-lg mb-1">No reservations yet</p>
            <p className="text-gray-400 text-sm mb-6">Book a table and enjoy the Bite Boss experience.</p>
            <button
              onClick={() => navigate("/reservation")}
              className="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition"
            >
              Reserve a Table
            </button>
          </div>
        )}

        {/* Cards */}
        <div className="space-y-4">
          {reservations.map((r) => {
            const method = METHOD_META[r.paymentMethod] || { label: r.paymentMethod, icon: "💳" };
            const status = STATUS_STYLE[r.status] || STATUS_STYLE.active;

            return (
              <div key={r._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">

                  {/* Left info */}
                  <div className="flex gap-4 items-start">
                    {/* Date block */}
                    <div className="bg-orange-50 border border-orange-100 rounded-2xl px-4 py-3 text-center min-w-[64px]">
                      <p className="text-orange-500 font-bold text-xl leading-none">
                        {r.table?.date?.split("-")[2] || "--"}
                      </p>
                      <p className="text-orange-400 text-xs font-medium mt-0.5 uppercase">
                        {r.table?.date
                          ? new Date(r.table.date).toLocaleDateString("en-US", { month: "short" })
                          : "---"}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-gray-900">Table #{r.table?.tableNumber}</span>
                        <span
                          style={{ background: status.bg, color: status.color }}
                          className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                        >
                          {status.label}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm mt-0.5">
                        {r.table?.time} · {r.table?.seats} seats · {r.table?.guests} guests
                      </p>
                      {r.table?.occasion && (
                        <p className="text-gray-400 text-xs mt-0.5">🎉 {r.table.occasion}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-xs text-gray-400">{method.icon} {method.label}</span>
                        {r.walletNumber && (
                          <span className="text-xs text-gray-400">· {r.walletNumber}</span>
                        )}
                        {r.cardLast4 && (
                          <span className="text-xs text-gray-400">· ••••{r.cardLast4}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: amount + payment status */}
                  <div className="text-right flex flex-col items-end gap-2">
                    <p className="text-xl font-bold text-gray-900">
                      Rs {(r.totalAmount || 0).toLocaleString()}
                    </p>
                    <PaymentStatus isPaid={r.isPaid} />
                    {r.transactionId && (
                      <p className="text-xs text-gray-400">Ref: {r.transactionId}</p>
                    )}
                  </div>
                </div>

                {/* Cart items */}
                {r.cartItems?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-50 flex flex-wrap gap-2">
                    {r.cartItems.map((item, i) => (
                      <span
                        key={i}
                        className="bg-gray-50 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-lg"
                      >
                        {item.name} × {item.quantity}
                      </span>
                    ))}
                  </div>
                )}

                {/* Special requests */}
                {r.table?.specialRequests && (
                  <p className="mt-3 text-xs text-gray-400 bg-gray-50 rounded-xl px-3 py-2">
                    💬 {r.table.specialRequests}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
