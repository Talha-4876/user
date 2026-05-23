import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { backendUrl } from "../../config";

import {
  Home,
  PlusCircle,
  List,
  Calendar,
  Truck,
  Star,
  Mail,
  ChefHat,
  Settings,
  Layout,
  Bell,
} from "lucide-react";

/* NAV */
const NAV_GROUPS = [
  {
    label: "Operations",
    items: [
      { path: "/admin/dashboard", label: "Dashboard", icon: Home },
      { path: "/admin/add", label: "Add Menu", icon: PlusCircle },
      { path: "/admin/list", label: "List Menu", icon: List },

      // ✅ FIXED ROUTE
      { path: "/admin/admintable", label: "Reservations", icon: Calendar, badge: "reservations" },

      { path: "/admin/deliveries", label: "Deliveries", icon: Truck, badge: "deliveries" },
      { path: "/admin/addtable", label: "Add Tables", icon: Layout },
    ],
  },
  {
    label: "People",
    items: [
      { path: "/admin/reviews", label: "Customer Reviews", icon: Star },
      { path: "/admin/inbox", label: "Messages Inbox", icon: Mail, badge: "messages" },
      { path: "/admin/chefs", label: "Chefs", icon: ChefHat },
      { path: "/admin/newsletter", label: "Newsletter", icon: Bell, badge: "subscribers" },
    ],
  },
];

/* SETTINGS */
const SETTINGS_ITEM = {
  path: "/admin/settings",
  label: "Settings",
  icon: Settings,
};

/* PAGE TITLES */
const PAGE_TITLES = {
  "/admin/dashboard": { title: "Dashboard", sub: "Overview & quick stats" },
  "/admin/add": { title: "Add Menu", sub: "Create new dishes" },
  "/admin/list": { title: "List Menu", sub: "Manage all menu items" },

  // ✅ FIXED TITLE PATH
  "/admin/admintable": { title: "Reservations", sub: "Track bookings" },

  "/admin/deliveries": { title: "Deliveries", sub: "Manage orders" },
  "/admin/reviews": { title: "Customer Reviews", sub: "User feedback" },
  "/admin/inbox": { title: "Inbox", sub: "Messages & queries" },
  "/admin/chefs": { title: "Chefs", sub: "Manage staff" },
  "/admin/settings": { title: "Settings", sub: "System preferences" },
  "/admin/newsletter": { title: "Newsletter", sub: "Subscribers list" },
};

/* MENU ITEM */
const MenuItem = ({ label, icon: Icon, badge, isActive, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 cursor-pointer transition-all
        ${
          isActive
            ? "bg-orange-500/20 border border-orange-400/40"
            : hovered
            ? "bg-white/[0.05]"
            : ""
        }`}
    >
      <Icon
        size={18}
        className={`transition-all ${
          isActive ? "text-orange-400" : "text-white"
        }`}
      />

      <span
        className={`flex-1 text-[13.5px] ${
          isActive ? "text-orange-300 font-semibold" : "text-neutral-300"
        }`}
      >
        {label}
      </span>

      {badge > 0 && (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300">
          {badge}
        </span>
      )}

      {isActive && <span className="text-orange-400 text-xs">›</span>}
    </div>
  );
};

/* SIDEBAR */
const Sidebar = ({ handleLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [notify, setNotify] = useState({
    messages: 0,
    reservations: 0,
    deliveries: 0,
    subscribers: 0,
  });

  const [openGroups, setOpenGroups] = useState({});

  useEffect(() => {
   const fetchNotify = async () => {
  try {
    const token =
      localStorage.getItem("adminToken");

    const res = await axios.get(
      `${backendUrl}/api/admin/notifications`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setNotify(res.data);
  } catch (err) {
    console.log(err);
  }
};

    fetchNotify();
    const interval = setInterval(fetchNotify, 8000);
    return () => clearInterval(interval);
  }, []);

  const toggleGroup = (label) => {
    setOpenGroups((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const currentPage = PAGE_TITLES[location.pathname] || {
    title: "Dashboard",
    sub: "Welcome back",
  };

  return (
    <div className="fixed left-0 top-0 w-60 h-screen bg-[#0f0f12] border-r border-white/[0.08] flex flex-col">

      {/* HEADER */}
      <div className="px-5 pt-7 pb-4 border-b border-white/[0.08]">
        <p className="text-orange-400 text-[19px] font-bold">🍽 Bite Boss</p>
        <p className="text-[10px] text-neutral-400">Admin Panel</p>
      </div>

      {/* TITLE */}
      <div className="px-5 py-3 border-b border-white/[0.08]">
        <p className="text-[15px] font-semibold text-white">
          {currentPage.title}
        </p>
        <p className="text-[11px] text-neutral-400">
          {currentPage.sub}
        </p>
      </div>

      {/* MENU */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <div
              onClick={() => toggleGroup(group.label)}
              className="flex items-center justify-between cursor-pointer px-2 pt-4"
            >
              <p className="text-[10px] text-neutral-400 uppercase">
                {group.label}
              </p>
            </div>

            <AnimatePresence>
              {group.items.map((item) => (
                <MenuItem
                  key={item.path}
                  {...item}
                  isActive={location.pathname === item.path}
                  badge={item.badge ? notify[item.badge] : 0}
                  onClick={() => navigate(item.path)}
                />
              ))}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* SETTINGS */}
      <div className="px-3 py-2">
        <MenuItem
          {...SETTINGS_ITEM}
          isActive={location.pathname === SETTINGS_ITEM.path}
          badge={0}
          onClick={() => navigate(SETTINGS_ITEM.path)}
        />
      </div>

      {/* LOGOUT */}
      <div className="p-3 border-t border-white/[0.08]">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500/10 text-red-300 py-2 rounded-xl hover:bg-red-500/20"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;