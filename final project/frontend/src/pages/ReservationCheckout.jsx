// FILE: src/pages/ReservationCheckout.jsx  (USER SIDE)
// Bite Boss — Reservation + Payment Page
// Supports: Cash on Delivery | Card | JazzCash | EasyPaisa

import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { backendUrl } from "../config";
import PaymentMethodCard from "../components/PaymentMethodCard";

// ── Initial form state ───────────────────────────────────────────
const INIT_FORM = {
  name: "",
  phone: "",
  email: "",
  tableNumber: "",
  seats: "",
  date: "",
  time: "",
  guests: 1,
  occasion: "",
  specialRequests: "",
  paymentMethod: "cash",
  walletNumber: "",
  cardNumber: "",
  cardExpiry: "",
  cardCVV: "",
  cardName: "",
};

export default function ReservationCheckout() {
  const { cartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [form, setForm] = useState(INIT_FORM);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = details, 2 = payment
  const [errors, setErrors] = useState({});

  const subtotal = cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const totalAmount = subtotal;

  // ── Handlers ────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // For PaymentMethodCard component
  const handlePaymentMethodChange = (methodId) => {
    setForm((prev) => ({ ...prev, paymentMethod: methodId }));
    setErrors((prev) => ({ ...prev, paymentMethod: "" }));
  };

  const handleWalletChange = (value) => {
    setForm((prev) => ({ ...prev, walletNumber: value }));
    setErrors((prev) => ({ ...prev, walletNumber: "" }));
  };

  const handleCardChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // ── Validation ──────────────────────────────────────────────────
  const validateStep1 = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!form.email.trim()) e.email = "Email is required";
    if (!form.tableNumber) e.tableNumber = "Table number is required";
    if (!form.seats) e.seats = "Seats is required";
    if (!form.date) e.date = "Date is required";
    if (!form.time) e.time = "Time is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (
      (form.paymentMethod === "jazzcash" || form.paymentMethod === "easypaisa") &&
      !form.walletNumber.trim()
    ) {
      e.walletNumber = "Mobile wallet number is required";
    }
    if (form.paymentMethod === "card") {
      if (form.cardNumber.replace(/\s/g, "").length < 16)
        e.cardNumber = "Enter valid 16-digit card number";
      if (!form.cardExpiry || form.cardExpiry.length < 5)
        e.cardExpiry = "Enter valid expiry (MM/YY)";
      if (form.cardCVV.length < 3) e.cardCVV = "Enter valid CVV";
      if (!form.cardName.trim()) e.cardName = "Name on card required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ──────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setLoading(true);
    try {
      // ✅ userId localStorage se nikalo for notifications
      const userInfo = localStorage.getItem("userInfo");
      const parsedUser = userInfo ? JSON.parse(userInfo) : null;
      const userId = parsedUser?.id || parsedUser?._id || null;

      const payload = {
        user: { name: form.name, phone: form.phone, email: form.email },
        table: {
          tableNumber: Number(form.tableNumber),
          seats: Number(form.seats),
          date: form.date,
          time: form.time,
          guests: Number(form.guests),
          occasion: form.occasion,
          specialRequests: form.specialRequests,
        },
        cartItems,
        paymentMethod: form.paymentMethod,
        totalAmount,
        walletNumber: form.walletNumber || undefined,
        cardDetails:
          form.paymentMethod === "card"
            ? {
                last4: form.cardNumber.replace(/\s/g, "").slice(-4),
                expiry: form.cardExpiry,
                name: form.cardName,
              }
            : undefined,
        userId, // ✅ notification ke liye
      };

      const res = await axios.post(`${backendUrl}/api/reservations/create`, payload);
      if (res.data.success) {
        clearCart();
        navigate("/reservation-success", {
          state: { reservation: res.data.reservation },
        });
      } else {
        alert(res.data.message || "Reservation failed");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  // ── Input style helpers ──────────────────────────────────────────
  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl border text-sm font-medium outline-none transition-all ${
      errors[field]
        ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300"
        : "border-gray-200 bg-white focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 pt-24 pb-20 px-4 md:px-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Reserve Your Table</h1>
          <p className="text-gray-500 mt-2 text-sm">Bite Boss — Fine Dining Experience</p>

          {/* Steps */}
          <div className="flex items-center justify-center gap-3 mt-6">
            {[1, 2].map((s) => (
              <React.Fragment key={s}>
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    step === s
                      ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                      : step > s
                      ? "bg-green-500 text-white"
                      : "bg-white border border-gray-200 text-gray-400"
                  }`}
                >
                  <span>{step > s ? "✓" : s}</span>
                  <span>{s === 1 ? "Details" : "Payment"}</span>
                </div>
                {s < 2 && (
                  <div className={`w-8 h-0.5 ${step > 1 ? "bg-green-400" : "bg-gray-200"}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* ─── LEFT ─────────────────────────────────────────── */}
            <div className="lg:col-span-7 space-y-6">

              {/* ── STEP 1: Reservation Details ── */}
              {step === 1 && (
                <>
                  {/* Contact Info */}
                  <Section title="Contact Information" icon="👤">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field label="Full Name *" error={errors.name}>
                        <input
                          className={inputClass("name")}
                          name="name"
                          placeholder="Ali Khan"
                          value={form.name}
                          onChange={handleChange}
                        />
                      </Field>
                      <Field label="Phone *" error={errors.phone}>
                        <input
                          className={inputClass("phone")}
                          name="phone"
                          placeholder="03XX-XXXXXXX"
                          value={form.phone}
                          onChange={handleChange}
                        />
                      </Field>
                      <Field label="Email *" error={errors.email} className="md:col-span-2">
                        <input
                          className={inputClass("email")}
                          name="email"
                          placeholder="you@email.com"
                          value={form.email}
                          onChange={handleChange}
                        />
                      </Field>
                    </div>
                  </Section>

                  {/* Table Details */}
                  <Section title="Table Details" icon="🍽️">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field label="Table Number *" error={errors.tableNumber}>
                        <input
                          className={inputClass("tableNumber")}
                          name="tableNumber"
                          type="number"
                          min="1"
                          placeholder="e.g. 5"
                          value={form.tableNumber}
                          onChange={handleChange}
                        />
                      </Field>
                      <Field label="Seats *" error={errors.seats}>
                        <input
                          className={inputClass("seats")}
                          name="seats"
                          type="number"
                          min="1"
                          placeholder="e.g. 4"
                          value={form.seats}
                          onChange={handleChange}
                        />
                      </Field>
                      <Field label="Date *" error={errors.date}>
                        <input
                          className={inputClass("date")}
                          name="date"
                          type="date"
                          min={new Date().toISOString().split("T")[0]}
                          value={form.date}
                          onChange={handleChange}
                        />
                      </Field>
                      <Field label="Time *" error={errors.time}>
                        <input
                          className={inputClass("time")}
                          name="time"
                          type="time"
                          value={form.time}
                          onChange={handleChange}
                        />
                      </Field>
                      <Field label="Number of Guests">
                        <input
                          className={inputClass()}
                          name="guests"
                          type="number"
                          min="1"
                          value={form.guests}
                          onChange={handleChange}
                        />
                      </Field>
                      <Field label="Occasion (optional)">
                        <select
                          className={inputClass()}
                          name="occasion"
                          value={form.occasion}
                          onChange={handleChange}
                        >
                          <option value="">Select occasion</option>
                          <option value="Birthday">🎂 Birthday</option>
                          <option value="Anniversary">💍 Anniversary</option>
                          <option value="Business">💼 Business</option>
                          <option value="Date">❤️ Date Night</option>
                          <option value="Other">✨ Other</option>
                        </select>
                      </Field>
                      <Field label="Special Requests" className="md:col-span-2">
                        <textarea
                          className={`${inputClass()} resize-none`}
                          name="specialRequests"
                          rows={2}
                          placeholder="Any dietary requirements, accessibility needs..."
                          value={form.specialRequests}
                          onChange={handleChange}
                        />
                      </Field>
                    </div>
                  </Section>

                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep1()) setStep(2);
                    }}
                    className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-orange-200 transition-all active:scale-95"
                  >
                    Continue to Payment →
                  </button>
                </>
              )}

              {/* ── STEP 2: Payment ── */}
              {step === 2 && (
                <>
                  <Section title="Payment Method" icon="💳">
                    {/* ✅ Reusable PaymentMethodCard component use ho raha hai */}
                    <PaymentMethodCard
                      selected={form.paymentMethod}
                      onChange={handlePaymentMethodChange}
                      walletNumber={form.walletNumber}
                      onWalletChange={handleWalletChange}
                      cardNumber={form.cardNumber}
                      cardExpiry={form.cardExpiry}
                      cardCVV={form.cardCVV}
                      cardName={form.cardName}
                      onCardChange={handleCardChange}
                      errors={errors}
                    />
                  </Section>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-4 border-2 border-gray-200 text-gray-600 font-semibold rounded-2xl hover:bg-gray-50 transition-all"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-lg rounded-2xl shadow-lg shadow-orange-200 transition-all active:scale-95"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8z"
                            />
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        "Confirm Reservation 🎉"
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* ─── RIGHT: Order Summary ────────────────────────── */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-5">Order Summary</h2>

                {/* Cart Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {cartItems.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-6">No items in cart</p>
                  ) : (
                    cartItems.map((item) => (
                      <div key={item._id} className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt=""
                          className="w-14 h-14 rounded-xl object-cover bg-gray-100"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-bold text-gray-900 whitespace-nowrap">
                          Rs {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Totals */}
                <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span>Rs {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Service Charge</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-100">
                    <span>Total</span>
                    <span className="text-orange-500">Rs {totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Security note */}
                <p className="text-xs text-gray-400 text-center mt-4">
                  🔐 Secured with 256-bit SSL encryption
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Helper Components ───────────────────────────────────────────
function Section({ title, icon, children }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2">
        <span className="text-xl">{icon}</span> {title}
      </h2>
      {children}
    </div>
  );
}

function Field({ label, error, children, className = "" }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      {children}
      {error && <p className="text-xs text-red-500 mt-1">⚠ {error}</p>}
    </div>
  );
}
