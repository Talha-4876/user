import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const backendUrl = "http://localhost:3200";

const DelayedAuthModal = ({ isOpen, onClose, initialIsForgot = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(initialIsForgot); // ✅ NEW
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [newPassword, setNewPassword] = useState(""); // ✅ FORGOT PASSWORD
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);

  // Sync showModal with isOpen
  useEffect(() => {
    if (isOpen) setShowModal(true);
    else setShowModal(false);
  }, [isOpen]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ================= LOGIN / SIGNUP =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (isLogin) {
        res = await axios.post(`${backendUrl}/api/auth/login`, formData);
      } else {
        res = await axios.post(`${backendUrl}/api/auth/signup`, formData);
      }

      if (res.data.token) localStorage.setItem("token", res.data.token);
      alert(res.data.message || "Success!");
      onClose();
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ================= RESET PASSWORD =================
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/auth/reset-password`, {
        email: formData.email,
        newPassword,
      });
      alert(res.data.message);
      setIsForgot(false);
      setIsLogin(true);
    } catch (err) {
      alert(err.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  if (!showModal) return null;

  return (
    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      ></div>

      {/* MODAL */}
      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div className="bg-white rounded-2xl p-8 w-96 relative shadow-lg">
          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold"
          >
            ✕
          </button>

          {isForgot ? (
            // ================= FORGOT PASSWORD FORM =================
            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-center mb-2">
                Reset Password
              </h2>

              <input
                type="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="border px-3 py-2 rounded"
              />

              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="border px-3 py-2 rounded"
              />

              <button
                type="submit"
                className={`bg-orange-500 text-white py-2 rounded hover:bg-orange-600 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Processing..." : "Reset Password"}
              </button>

              <p
                onClick={() => setIsForgot(false)}
                className="text-sm text-center cursor-pointer text-gray-500 mt-2"
              >
                Back to Login
              </p>
            </form>
          ) : (
            // ================= LOGIN / SIGNUP FORM =================
            <>
              <h2 className="text-2xl font-bold text-center mb-4">
                {isLogin ? "Login" : "Sign Up"}
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {!isLogin && (
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded"
                    required
                  />
                )}
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border px-3 py-2 rounded"
                  required
                />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded w-full"
                    required
                  />
                  <span
                    className="absolute right-3 top-2/4 -translate-y-2/4 cursor-pointer text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                  </span>
                </div>

                {/* FORGOT PASSWORD LINK */}
                {isLogin && (
                  <p
                    onClick={() => setIsForgot(true)}
                    className="text-sm text-right cursor-pointer text-orange-500"
                  >
                    Forgot Password?
                  </p>
                )}

                <button
                  type="submit"
                  className={`bg-orange-500 text-white py-2 rounded hover:bg-orange-600 ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
                </button>
              </form>

              <p className="mt-4 text-center text-gray-600 text-sm">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <span
                  className="text-orange-500 cursor-pointer font-semibold"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Sign Up" : "Login"}
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DelayedAuthModal;



