// src/admin/pages/Dashboard.jsx

import React, { useState } from "react";
import Sidebar from "../Components/Sidebar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const PAGE_TITLES = {
  "/admin/dashboard": {
    title: "Dashboard",
    sub: "Overview of your system analytics",
  },

  "/admin/add": {
    title: "Add Menu",
    sub: "Create new dishes for your menu",
  },

  "/admin/list": {
    title: "List Menu",
    sub: "Manage all your menu items",
  },

  "/admin/update": {
    title: "Update Menu",
    sub: "Edit your menu item details",
  },

  "/admin/table": {
    title: "Reservations",
    sub: "View and manage table bookings",
  },

  "/admin/deliveries": {
    title: "Deliveries",
    sub: "Track all ongoing deliveries",
  },

  "/admin/reviews": {
    title: "Customer Reviews",
    sub: "Read what your guests are saying",
  },

  "/admin/inbox": {
    title: "Messages Inbox",
    sub: "Respond to customer messages",
  },

  "/admin/chefs": {
    title: "Chefs",
    sub: "Manage your kitchen staff",
  },

  "/admin/settings": {
    title: "Settings",
    sub: "Manage your admin preferences",
  },
};

const SEARCH_ITEMS = Object.entries(
  PAGE_TITLES
).map(([path, data]) => ({
  path,
  title: data.title,
}));

const DashboardLayout = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const [notifOpen, setNotifOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  // ================= LOGOUT =================

  const handleLogout = () => {
    localStorage.removeItem(
      "userToken"
    );

    localStorage.removeItem(
      "userInfo"
    );

    window.dispatchEvent(
      new Event("authChange")
    );

    navigate("/signup");
  };

  // ================= USER =================

  const rawUser = JSON.parse(
    localStorage.getItem("userInfo") ||
      "{}"
  );

  const adminUser = {
    name:
      rawUser.name ||
      rawUser.email
        ?.split("@")[0]
        ?.replace(/[._]/g, " ")
        ?.replace(/\b\w/g, (c) =>
          c.toUpperCase()
        ) ||
      "Admin",

    email: rawUser.email || "",

    role:
      rawUser.role || "Admin",
  };

  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  // ================= PAGE =================

  const currentPath = Object.keys(
    PAGE_TITLES
  ).find((path) =>
    location.pathname.startsWith(path)
  );

  const page =
    PAGE_TITLES[currentPath] || {
      title: "Dashboard",
      sub: "Welcome back",
    };

  const now =
    new Date().toLocaleDateString(
      "en-PK",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

  // ================= SEARCH =================

  const filteredItems =
    SEARCH_ITEMS.filter((item) =>
      item.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <div className="bg-[#0b0b0e] font-sans">

      {/* SIDEBAR */}

      <Sidebar
        handleLogout={handleLogout}
      />

      <div className="ml-60 min-h-screen flex flex-col">

        {/* TOPBAR */}

        <header
          className="sticky top-0 z-40 flex items-center gap-4 px-8 h-16
          bg-[#0f0f12]/95 backdrop-blur-md border-b border-white/[0.08]"
        >
          <div className="flex-1 min-w-0">
            <h1 className="text-[17px] font-bold text-white truncate">
              {page.title}
            </h1>

            <p className="text-[11px] text-neutral-400 truncate">
              {page.sub}
            </p>
          </div>

          <p className="hidden lg:block text-[11px] text-neutral-400">
            {now} &nbsp;·&nbsp;

            <span className="text-orange-400 font-medium">
              Welcome,{" "}
              {
                adminUser.name.split(
                  " "
                )[0]
              }{" "}
              👋
            </span>
          </p>

          {/* SEARCH */}

          <div className="relative hidden md:block w-56">

            <div
              className="flex items-center gap-2 bg-white/[0.06]
              border border-white/[0.08] rounded-xl px-3 py-2"
            >
              🔍

              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="bg-transparent outline-none text-[13px] text-white w-full"
              />
            </div>

            {search && (
              <div
                className="absolute top-12 w-full bg-[#16161b]
                border border-white/[0.08] rounded-xl overflow-hidden z-50"
              >
                {filteredItems.length >
                0 ? (
                  filteredItems.map(
                    (item) => (
                      <div
                        key={item.path}
                        onClick={() => {
                          navigate(
                            item.path
                          );

                          setSearch(
                            ""
                          );
                        }}
                        className="px-3 py-2 text-[13px] text-neutral-300 hover:bg-white/[0.06] cursor-pointer"
                      >
                        {item.title}
                      </div>
                    )
                  )
                ) : (
                  <div className="px-3 py-2 text-[12px] text-neutral-500">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* NOTIFICATION */}

          <div className="relative">
            <button
              onClick={() =>
                setNotifOpen(
                  !notifOpen
                )
              }
              className="relative w-9 h-9 flex items-center justify-center rounded-xl
                bg-white/[0.06] border border-white/[0.08] text-neutral-300"
            >
              🔔

              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>

          {/* AVATAR */}

          <div className="flex items-center gap-2.5 pl-2 border-l border-white/[0.08]">

            <div
              className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500
              flex items-center justify-center text-white text-xs font-bold"
            >
              {getInitials(
                adminUser.name
              )}
            </div>

            <div className="hidden sm:block">
              <p className="text-[12px] text-white">
                {adminUser.name}
              </p>

              <p className="text-[10px] text-neutral-400">
                {adminUser.role}
              </p>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}

        <main className="flex-1 overflow-y-auto p-8">

          <div className="flex items-center gap-2 text-[11px] text-neutral-400 mb-6">

            <span>🏠</span>

            <span>/</span>

            <span className="text-orange-400">
              {page.title}
            </span>
          </div>

          <div
            className="bg-[#0f0f12] border border-white/[0.08]
            rounded-2xl min-h-[60vh] p-6"
          >
            <Outlet />
          </div>
        </main>

        {/* FOOTER */}

        <footer
          className="px-8 py-3 border-t border-white/[0.06]
          flex justify-between text-[11px] text-neutral-500"
        >
          <span>
            © 2026 Bite Boss
          </span>

          <span>v1.0.0</span>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;