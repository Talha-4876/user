import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

/* CONTEXT */
import CartProvider from "./context/CartContext";
import BookingProvider from "./context/BookingContext";
import { SearchProvider } from "./context/SearchContext";

/* USER COMPONENTS */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Chatbot from "./components/Chatbot";
import Menu from "./components/Menu";
import Reviews from "./components/Reviews";
import ChefSection from "./components/ChefSection";
import GetInTouch from "./components/GetInTouch";
import Services from "./components/Services";
import Work from "./components/Work";
import OpeningHours from "./components/OpeningHours";

/* USER PAGES */
import About from "./pages/About";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import TableDetail from "./pages/TableDetail";
import Tables from "./pages/Tables";
import TableBooking from "./pages/TableBooking";
import Profile from "./pages/Profile";
import Signup from "./components/Signup";
import ProductDetail from "./pages/ProductDetail";
import NotificationsPage from "./pages/NotificationsPage";
import ReservationCheckout from "./pages/ReservationCheckout";
import ReservationSuccess from "./pages/ReservationSuccess";
import MyReservations from "./pages/MyReservations";

/* ADMIN */
import DashboardLayout from "./admin/pages/Dashboard";
import AddMenu from "./admin/pages/AddMenu";
import AdminDashboard from "./admin/pages/AdminDashboard";
import UpdateMenu from "./admin/pages/UpdateMenu";
import ListMenu from "./admin/pages/ListMenu";
import AdminTable from "./admin/pages/AdminTable";
import AdminReviews from "./admin/pages/AdminReviews";
import Deliveries from "./admin/pages/Deliveries";
import AdminInbox from "./admin/pages/AdminInbox";
import ChefManager from "./admin/components/ChefManager";
import AdminSettings from "./admin/pages/AdminSettings";
import AddTable from "./admin/pages/AddTable";
import AdminNewsletterDashboard from "./admin/pages/AdminNewsletterDashboard";

import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";

/* ================= AUTH ================= */

const getUserAuth = () => {
  const token = localStorage.getItem("userToken");
  try {
    const info = JSON.parse(localStorage.getItem("userInfo") || "{}");
    return { token, user: info, role: info?.role || null };
  } catch {
    return { token: null, user: null, role: null };
  }
};

const getAdminAuth = () => {
  const token = localStorage.getItem("adminToken");
  try {
    const info = JSON.parse(localStorage.getItem("adminInfo") || "{}");
    return { token, user: info, role: info?.role || null };
  } catch {
    return { token: null, user: null, role: null };
  }
};

/* ================= USER ROUTE ================= */

const UserRoute = ({ children }) => {
  const { token, role } = getUserAuth();
  if (!token) return <Navigate to="/signup" replace />;
  if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
  return children;
};

/* ================= ADMIN ROUTE ================= */

const AdminRoute = ({ children }) => {
  const { token, role } = getAdminAuth();
  if (!token) return <Navigate to="/signup" replace />;
  if (role !== "admin") return <Navigate to="/signup" replace />;
  return children;
};

/* ================= HOME ================= */

const HomeWrapper = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const section = document.getElementById(location.state.scrollTo);
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    }
  }, [location]);

  return (
    <>
      <Hero />
      <section id="about"><About /></section>
      <section id="menu"><Menu /></section>
      <Reviews />
      <ChefSection />
      <Services />
      <Work />
      <OpeningHours />
      <section id="booking"><TableBooking /></section>
      <section id="contact"><GetInTouch /></section>
    </>
  );
};

/* ================= APP ================= */

function App() {
  const [authKey, setAuthKey] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const refresh = () => setAuthKey((k) => k + 1);
    window.addEventListener("authChange", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("authChange", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const isAdminPath = location.pathname.startsWith("/admin");

  return (
    <CartProvider>
      <BookingProvider>
        <SearchProvider>
          {!isAdminPath && <Navbar key={authKey} />}

          <ToastContainer />
          <Toaster />

          <Routes>
            {/* AUTH */}
            <Route path="/signup" element={<Signup />} />

            {/* ✅ PUBLIC ROUTES — login ki zaroorat nahi */}
            <Route path="/tables" element={<Tables />} />

            {/* ✅ FIX: /tables/:tableNumber — UserRoute se bahar, public */}
            <Route path="/tables/:tableNumber" element={<TableDetail />} />

            {/* HOME */}
            <Route
              path="/"
              element={
                <UserRoute>
                  <HomeWrapper />
                </UserRoute>
              }
            />

            {/* USER ROUTES */}
            <Route
              path="/product/:id"
              element={
                <UserRoute>
                  <ProductDetail />
                </UserRoute>
              }
            />

            <Route
              path="/cart"
              element={
                <UserRoute>
                  <Cart />
                </UserRoute>
              }
            />

            <Route
              path="/checkout"
              element={
                <UserRoute>
                  <Checkout />
                </UserRoute>
              }
            />

            <Route
              path="/book-table"
              element={
                <UserRoute>
                  <TableBooking />
                </UserRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <UserRoute>
                  <Profile />
                </UserRoute>
              }
            />

            <Route
              path="/notifications"
              element={
                <UserRoute>
                  <NotificationsPage />
                </UserRoute>
              }
            />

            <Route
              path="/reservation"
              element={
                <UserRoute>
                  <ReservationCheckout />
                </UserRoute>
              }
            />

            <Route
              path="/reservation-success"
              element={
                <UserRoute>
                  <ReservationSuccess />
                </UserRoute>
              }
            />

            <Route
              path="/my-reservations"
              element={
                <UserRoute>
                  <MyReservations />
                </UserRoute>
              }
            />

            {/* ADMIN ROUTES */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <DashboardLayout />
                </AdminRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="add" element={<AddMenu />} />
              <Route path="list" element={<ListMenu />} />
              <Route path="update/:id" element={<UpdateMenu />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="inbox" element={<AdminInbox />} />
              <Route path="deliveries" element={<Deliveries />} />
              <Route path="chefs" element={<ChefManager />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="addtable" element={<AddTable />} />
              <Route path="admintable" element={<AdminTable />} />
              <Route path="newsletter" element={<AdminNewsletterDashboard />} />
            </Route>

            {/* FALLBACK */}
            <Route path="*" element={<Navigate to="/signup" replace />} />
          </Routes>

          {!isAdminPath && <Footer key={authKey} />}
          {!isAdminPath && <Chatbot />}
        </SearchProvider>
      </BookingProvider>
    </CartProvider>
  );
}

export default App;
