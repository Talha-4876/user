// src/components/NotificationBell.jsx
import { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:3200";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  "Content-Type": "application/json",
});

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const fetchUnread = async () => {
    try {
      const res = await fetch(`${API}/api/notifications`, { headers: authHeader() });
      const data = await res.json();
      if (res.ok) {
        const count = data.data.filter(n => !n.read).length;
        setUnreadCount(count);
      }
    } catch {}
  };

  useEffect(() => {
    fetchUnread();
    const handler = () => setUnreadCount(0);
    window.addEventListener("notifsRead", handler);
    return () => window.removeEventListener("notifsRead", handler);
  }, []);

  return (
    <button
      onClick={() => navigate("/notifications")}
      style={{
        position: "relative",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 8,
      }}
    >
      <FaBell size={22} color="#78716c" />
      {unreadCount > 0 && (
        <span
          style={{
            position: "absolute",
            top: 4,
            right: 4,
            width: 9,
            height: 9,
            borderRadius: "50%",
            background: "#ef4444",
            border: "2px solid white",
            display: "block",
          }}
        />
      )}
    </button>
  );
}