import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import axios from "axios";
import { backendUrl } from "../config";
import { useNavigate } from "react-router-dom";
import { cards } from "../assets/assets";
import PaymentMethodCard from "../components/PaymentMethodCard";

const Checkout = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [deliveryCharge] = useState(200);
  const [totalAmount, setTotalAmount] = useState(0);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    country: "Pakistan",
    city: "",
    address: "",
    apartment: "",
    postalCode: "",
    paymentMethod: "cash",
  });

  // Payment states
  const [walletNumber, setWalletNumber] = useState("");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardExpiry: "",
    cardCVV: "",
    cardName: "",
  });
  const [paymentErrors, setPaymentErrors] = useState({});

  useEffect(() => {
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity, 0
    );
    setCartTotal(subtotal);
    setTotalAmount(subtotal + deliveryCharge - discount);
  }, [cartItems, discount]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCardChange = (field, value) => {
    setCardDetails((prev) => ({ ...prev, [field]: value }));
    setPaymentErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const applyCoupon = () => {
    if (coupon === "SAVE10") {
      setDiscount(100);
    } else {
      alert("Invalid coupon");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.firstName || !form.phone || !form.address || !form.city) {
      alert("Please fill required fields");
      return;
    }

    if (cartItems.length === 0) {
      alert("Cart empty");
      return;
    }

    // Payment validation
    const pErr = {};
    if (form.paymentMethod === "jazzcash" || form.paymentMethod === "easypaisa") {
      if (!walletNumber.trim()) pErr.walletNumber = "Mobile number required";
    }
    if (form.paymentMethod === "card") {
      if (cardDetails.cardNumber.replace(/\s/g, "").length < 16)
        pErr.cardNumber = "Enter valid 16-digit card number";
      if (!cardDetails.cardExpiry || cardDetails.cardExpiry.length < 5)
        pErr.cardExpiry = "Enter valid expiry (MM/YY)";
      if (cardDetails.cardCVV.length < 3)
        pErr.cardCVV = "Enter valid CVV";
      if (!cardDetails.cardName.trim())
        pErr.cardName = "Name on card required";
    }
    if (Object.keys(pErr).length > 0) {
      setPaymentErrors(pErr);
      return;
    }

    setLoading(true);
    try {
      const userInfo = localStorage.getItem("userInfo");
      const parsedUser = userInfo ? JSON.parse(userInfo) : null;
      const userId = parsedUser?.id || parsedUser?._id || null;

      const res = await axios.post(`${backendUrl}/api/delivery/create`, {
        ...form,
        name: `${form.firstName} ${form.lastName}`,
        cartItems,
        deliveryCharge,
        discount,
        totalAmount,
        userId,
        walletNumber: walletNumber || undefined,
        cardDetails:
          form.paymentMethod === "card"
            ? {
                last4: cardDetails.cardNumber.replace(/\s/g, "").slice(-4),
                expiry: cardDetails.cardExpiry,
                name: cardDetails.cardName,
              }
            : undefined,
      });

      if (res.data.success) {
        alert("Order placed successfully");
        clearCart();
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      alert("Order failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 md:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* LEFT SIDE */}
        <div className="lg:col-span-7 bg-white p-8 rounded-2xl shadow-sm border">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* CONTACT */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <input
                type="text"
                name="email"
                placeholder="Email or phone number"
                value={form.email}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>

            {/* DELIVERY INFO */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text" name="firstName" placeholder="First Name"
                  value={form.firstName} onChange={handleChange}
                  className="border p-3 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
                />
                <input
                  type="text" name="lastName" placeholder="Last Name"
                  value={form.lastName} onChange={handleChange}
                  className="border p-3 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
                />
                <input
                  type="text" name="address" placeholder="Address"
                  value={form.address} onChange={handleChange}
                  className="border p-3 rounded-lg md:col-span-2 focus:ring-2 focus:ring-orange-400 outline-none"
                />
                <input
                  type="text" name="apartment" placeholder="Apartment / Suite"
                  value={form.apartment} onChange={handleChange}
                  className="border p-3 rounded-lg md:col-span-2 focus:ring-2 focus:ring-orange-400 outline-none"
                />
                <input
                  type="text" name="city" placeholder="City"
                  value={form.city} onChange={handleChange}
                  className="border p-3 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
                />
                <input
                  type="text" name="postalCode" placeholder="Postal Code"
                  value={form.postalCode} onChange={handleChange}
                  className="border p-3 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
                />
                <input
                  type="text" name="phone" placeholder="Phone Number"
                  value={form.phone} onChange={handleChange}
                  className="border p-3 rounded-lg md:col-span-2 focus:ring-2 focus:ring-orange-400 outline-none"
                />
              </div>
            </div>

            {/* SHIPPING */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Shipping Method</h2>
              <div className="flex justify-between bg-orange-50 border p-4 rounded-lg">
                <span>Standard Delivery</span>
                <span className="font-semibold">Rs {deliveryCharge}</span>
              </div>
            </div>

            {/* PAYMENT — PaymentMethodCard */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <PaymentMethodCard
                selected={form.paymentMethod}
                onChange={(methodId) =>
                  setForm((prev) => ({ ...prev, paymentMethod: methodId }))
                }
                walletNumber={walletNumber}
                onWalletChange={(val) => {
                  setWalletNumber(val);
                  setPaymentErrors((prev) => ({ ...prev, walletNumber: "" }));
                }}
                cardNumber={cardDetails.cardNumber}
                cardExpiry={cardDetails.cardExpiry}
                cardCVV={cardDetails.cardCVV}
                cardName={cardDetails.cardName}
                onCardChange={handleCardChange}
                errors={paymentErrors}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-4 rounded-xl text-lg font-semibold hover:bg-orange-600 transition"
            >
              {loading ? "Processing..." : "Complete Order"}
            </button>
          </form>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border h-fit sticky top-24">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>

          <div className="space-y-4 max-h-80 overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center gap-4">
                <img src={item.image} alt="" className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty {item.quantity}</p>
                </div>
                <p className="font-semibold">Rs: {(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>

          {/* COUPON */}
          <div className="mt-6 flex gap-2">
            <input
              type="text" placeholder="Coupon code"
              value={coupon} onChange={(e) => setCoupon(e.target.value)}
              className="flex-1 border p-2 rounded outline-none"
            />
            <button
              type="button" onClick={applyCoupon}
              className="bg-gray-900 text-white px-4 rounded"
            >
              Apply
            </button>
          </div>

          {/* TOTAL */}
          <div className="border-t mt-6 pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rs: {cartTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Rs: {deliveryCharge}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>- Rs: {discount}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-2">
              <span>Total</span>
              <span className="text-orange-600">Rs: {totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;