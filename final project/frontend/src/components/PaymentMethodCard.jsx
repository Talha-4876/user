// FILE: src/components/PaymentMethodCard.jsx  (USER SIDE)
// Reusable payment method selector
// Use in ReservationCheckout.jsx AND Checkout.jsx

import React from "react";

const DEFAULT_METHODS = [
  {
    id: "cash",
    label: "Cash on Delivery",
    subtitle: "Pay when you arrive at the restaurant",
    icon: "💵",
    color: "#16a34a",
    bg: "#f0fdf4",
  },
  {
    id: "jazzcash",
    label: "JazzCash",
    subtitle: "Pay via JazzCash mobile wallet",
    icon: "🔴",
    color: "#dc2626",
    bg: "#fff1f2",
    needsWallet: true,
  },
  {
    id: "easypaisa",
    label: "EasyPaisa",
    subtitle: "Pay via EasyPaisa mobile wallet",
    icon: "🟢",
    color: "#15803d",
    bg: "#f0fdf4",
    needsWallet: true,
  },
  {
    id: "card",
    label: "Debit / Credit Card",
    subtitle: "Visa, Mastercard accepted",
    icon: "💳",
    color: "#1d4ed8",
    bg: "#eff6ff",
    needsCard: true,
  },
];

export default function PaymentMethodCard({
  selected,
  onChange,
  methods = DEFAULT_METHODS,
  walletNumber = "",
  onWalletChange,
  cardNumber = "",
  cardExpiry = "",
  cardCVV = "",
  cardName = "",
  onCardChange,
  errors = {},
}) {
  const selectedMethod = methods.find((m) => m.id === selected);

  const handleCardNumber = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.replace(/(.{4})/g, "$1 ").trim();
    onCardChange?.("cardNumber", formatted);
  };

  const handleExpiry = (e) => {
    let raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) raw = raw.slice(0, 2) + "/" + raw.slice(2);
    onCardChange?.("cardExpiry", raw);
  };

  const inputBase = (field) =>
    `w-full px-4 py-3 rounded-xl border text-sm font-medium outline-none transition-all ${
      errors[field]
        ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300"
        : "border-gray-200 bg-white focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
    }`;

  return (
    <div className="space-y-3">
      {/* Method list */}
      {methods.map((method) => (
        <label
          key={method.id}
          style={{
            background: selected === method.id ? method.bg : "#fff",
            borderColor: selected === method.id ? method.color : "#e5e7eb",
          }}
          className="flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all hover:border-gray-300"
        >
          <input
            type="radio"
            name="paymentMethod"
            value={method.id}
            checked={selected === method.id}
            onChange={() => onChange(method.id)}
            className="w-4 h-4 accent-orange-500"
          />
          <span className="text-2xl">{method.icon}</span>
          <div className="flex-1">
            <p className="font-semibold text-gray-800 text-sm">{method.label}</p>
            <p className="text-xs text-gray-400">{method.subtitle}</p>
          </div>
          {selected === method.id && (
            <span style={{ color: method.color }} className="text-xs font-bold whitespace-nowrap">
              Selected ✓
            </span>
          )}
        </label>
      ))}

      {/* Wallet input for JazzCash / EasyPaisa */}
      {selectedMethod?.needsWallet && (
        <div
          className="p-5 rounded-2xl border-2 border-dashed space-y-3"
          style={{ borderColor: selectedMethod.color, background: selectedMethod.bg }}
        >
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {selectedMethod.label} Mobile Number *
          </label>
          <div className="flex">
            <span className="px-3 py-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-sm font-medium text-gray-500">
              +92
            </span>
            <input
              className="flex-1 px-4 py-3 border border-gray-200 rounded-r-xl text-sm font-medium outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="3XX XXXXXXX"
              value={walletNumber}
              onChange={(e) => onWalletChange?.(e.target.value)}
              maxLength={11}
            />
          </div>
          {errors.walletNumber && (
            <p className="text-xs text-red-500">⚠ {errors.walletNumber}</p>
          )}
          <p className="text-xs text-gray-400">
            💡 You will receive a payment confirmation SMS on this number.
          </p>
        </div>
      )}

      {/* Card inputs */}
      {selectedMethod?.needsCard && (
        <div className="p-5 rounded-2xl bg-blue-50 border-2 border-blue-200 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Card Number *
            </label>
            <input
              className={inputBase("cardNumber")}
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={handleCardNumber}
              maxLength={19}
            />
            {errors.cardNumber && (
              <p className="text-xs text-red-500 mt-1">⚠ {errors.cardNumber}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Expiry (MM/YY) *
              </label>
              <input
                className={inputBase("cardExpiry")}
                placeholder="08/28"
                value={cardExpiry}
                onChange={handleExpiry}
                maxLength={5}
              />
              {errors.cardExpiry && (
                <p className="text-xs text-red-500 mt-1">⚠ {errors.cardExpiry}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                CVV *
              </label>
              <input
                className={inputBase("cardCVV")}
                placeholder="123"
                value={cardCVV}
                onChange={(e) => onCardChange?.("cardCVV", e.target.value)}
                maxLength={4}
              />
              {errors.cardCVV && (
                <p className="text-xs text-red-500 mt-1">⚠ {errors.cardCVV}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Name on Card *
            </label>
            <input
              className={inputBase("cardName")}
              placeholder="ALI KHAN"
              value={cardName}
              onChange={(e) => onCardChange?.("cardName", e.target.value)}
            />
            {errors.cardName && (
              <p className="text-xs text-red-500 mt-1">⚠ {errors.cardName}</p>
            )}
          </div>

          <p className="text-xs text-blue-500">
            🔒 Your card details are encrypted and never stored on our servers.
          </p>
        </div>
      )}

      {/* Security note */}
      <p className="text-xs text-gray-400 text-center pt-1">
        🔐 Secured with 256-bit SSL encryption
      </p>
    </div>
  );
}
