// src/components/Navbar.jsx
import React, { useState, useContext, useEffect, useRef } from "react";
import { CartContext } from "../context/CartContext";
import { SearchContext } from "../context/SearchContext";
import { useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart, FaSearch, FaBars, FaTimes, FaUserCircle, FaSignOutAlt, FaBell, FaUtensils, FaChair } from "react-icons/fa";
import { toast } from "react-toastify";

const Navbar = ({ openAuth }) => {
  const [isOpen,      setIsOpen]      = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [active,      setActive]      = useState("Home");
  const [scrolled,    setScrolled]    = useState(false);
  const [shakeCart,   setShakeCart]   = useState(false);
  const [isLoggedIn,  setIsLoggedIn]  = useState(false);
  const [userName,    setUserName]    = useState("");
  const [hasNotif,    setHasNotif]    = useState(true);

  const searchRef = useRef(null);

  const { cartItems }                                         = useContext(CartContext);
  const { searchQuery, setSearchQuery, productResults, tableResults } = useContext(SearchContext);
  const navigate  = useNavigate();
  const location  = useLocation();

  const menuItems = [
    { name: "Home",    type: "scroll", target: "hero"    },
    { name: "Menu",    type: "scroll", target: "menu"    },
    { name: "About",   type: "scroll", target: "about"   },
    { name: "Tables",  type: "route",  target: "/tables" },
    { name: "Contact", type: "scroll", target: "contact" },
  ];

  const checkAuth = () => {
    const token = localStorage.getItem("userToken");
    const info  = localStorage.getItem("userInfo");
    if (token && info) {
      setIsLoggedIn(true);
      try {
        const user = JSON.parse(info);
        setUserName(user?.name || user?.email?.split("@")[0] || "User");
      } catch { setUserName("User"); }
    } else {
      setIsLoggedIn(false);
      setUserName("");
    }
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener("storage", checkAuth);
    window.addEventListener("authChange", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userInfo");
    setIsLoggedIn(false);
    setUserName("");
    setIsOpen(false);
    window.dispatchEvent(new Event("authChange"));
    toast.success("Logged out successfully!");
    navigate("/signup");
  };

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = () => {
      const pos = window.scrollY + 150;
      ["hero","menu","about"].forEach(id => {
        const el = document.getElementById(id);
        if (el && pos >= el.offsetTop && pos < el.offsetTop + el.offsetHeight) {
          if (id==="hero")  setActive("Home");
          if (id==="menu")  setActive("Menu");
          if (id==="about") setActive("About");
        }
      });
    };
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      setShakeCart(true);
      setTimeout(() => setShakeCart(false), 500);
    }
  }, [cartItems]);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const fn = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const handleScroll = (id, name) => {
    setActive(name);
    if (location.pathname !== "/") navigate("/", { state: { scrollTo: id } });
    else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  const handleRoute = (path, name) => {
    setActive(name);
    navigate(path);
    setIsOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleProductClick = (product) => {
    setSearchOpen(false);
    setSearchQuery("");
    // Navigate to home and scroll to menu
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: "menu" } });
    } else {
      document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleTableClick = (table) => {
    setSearchOpen(false);
    setSearchQuery("");
    navigate(`/tables/${table.tableNumber}`);
  };

  const handleBellClick = () => {
    setHasNotif(false);
    handleRoute("/notifications", "Notifications");
  };

  const hasResults = productResults.length > 0 || tableResults.length > 0;

  const AuthButton = ({ mobile = false }) => {
    if (isLoggedIn) {
      return (
        <button
          onClick={handleLogout}
          className={mobile
            ? `w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white cursor-pointer font-lora font-semibold text-sm tracking-widest uppercase bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-[0_4px_16px_rgba(239,68,68,0.3)] hover:shadow-[0_6px_24px_rgba(239,68,68,0.45)] active:scale-95 transition-all duration-200 border-none`
            : `font-lora font-semibold text-xs tracking-widest uppercase px-5 py-2.5 rounded-full text-white cursor-pointer bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-[0_4px_16px_rgba(239,68,68,0.28)] hover:shadow-[0_6px_24px_rgba(239,68,68,0.44)] hover:-translate-y-0.5 hover:scale-105 active:scale-95 transition-all duration-200 border-none flex items-center gap-2`
          }
        >
          <FaSignOutAlt size={12} />
          Logout
        </button>
      );
    }
    return (
      <button
        onClick={openAuth}
        className={mobile
          ? `w-full px-4 py-2.5 rounded-xl text-white cursor-pointer font-lora font-semibold text-sm tracking-widest uppercase bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-[0_4px_16px_rgba(234,88,12,0.3)] hover:shadow-[0_6px_24px_rgba(234,88,12,0.45)] active:scale-95 transition-all duration-200 border-none`
          : `font-lora font-semibold text-xs tracking-widest uppercase px-5 py-2.5 rounded-full text-white cursor-pointer bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-[0_4px_16px_rgba(234,88,12,0.32)] hover:shadow-[0_6px_24px_rgba(234,88,12,0.48)] hover:-translate-y-0.5 hover:scale-105 active:scale-95 transition-all duration-200 border-none`
        }
      >
        Sign Up
      </button>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lora:wght@400;500;600&display=swap');
        .font-playfair { font-family: 'Playfair Display', Georgia, serif; }
        .font-lora     { font-family: 'Lora', Georgia, serif; }

        @keyframes cartShake {
          0%,100%{ transform:rotate(0deg); }
          20%    { transform:rotate(-14deg); }
          40%    { transform:rotate(14deg); }
          60%    { transform:rotate(-8deg); }
          80%    { transform:rotate(8deg); }
        }
        .shake { animation: cartShake 0.5s ease; }

        @keyframes bellRing {
          0%,100%{ transform:rotate(0deg); }
          15%    { transform:rotate(-18deg); }
          30%    { transform:rotate(18deg); }
          45%    { transform:rotate(-12deg); }
          60%    { transform:rotate(12deg); }
          75%    { transform:rotate(-6deg); }
          90%    { transform:rotate(6deg); }
        }
        .bell-ring { animation: bellRing 0.7s ease; }

        @keyframes searchDrop {
          from { opacity:0; transform:translateY(-8px) scale(.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        .search-drop { animation: searchDrop .25s cubic-bezier(.34,1.56,.64,1); }

        .nav-link { position: relative; padding-bottom: 3px; }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 50%;
          width: 0; height: 2px;
          background: linear-gradient(90deg, #ea580c, #f97316);
          border-radius: 2px;
          transform: translateX(-50%);
          transition: width 0.3s cubic-bezier(.34,1.56,.64,1);
        }
        .nav-link:hover::after, .nav-link.is-active::after { width: 100%; }

        .user-chip {
          display: flex; align-items: center;
          background: linear-gradient(135deg, rgba(234,88,12,0.08), rgba(251,146,60,0.12));
          border: 1px solid rgba(234,88,12,0.2);
          border-radius: 20px;
          padding: 4px 12px 4px 6px;
          font-family: 'Lora', serif;
          font-size: 0.72rem;
          font-weight: 600;
          color: #c2410c;
          gap: 6px;
          cursor: default;
          white-space: nowrap;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .user-chip-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          flex-shrink: 0;
          box-shadow: 0 0 0 2px rgba(34,197,94,0.2);
        }

        @keyframes notifPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(234,88,12,0.5); }
          50%       { box-shadow: 0 0 0 4px rgba(234,88,12,0); }
        }
        .notif-dot { animation: notifPulse 1.8s ease infinite; }

        .search-result-item:hover { background: rgba(234,88,12,0.07); }
        .search-results-scroll::-webkit-scrollbar { width: 4px; }
        .search-results-scroll::-webkit-scrollbar-track { background: transparent; }
        .search-results-scroll::-webkit-scrollbar-thumb { background: #fed7aa; border-radius: 4px; }
      `}</style>

      <nav className={`font-lora fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-orange-50/97 backdrop-blur-xl shadow-[0_4px_32px_rgba(234,88,12,0.12)] border-b border-orange-200/70" : "bg-orange-50/85 backdrop-blur-md border-b border-orange-100/50"}`}>

        <div className="h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-80" />

        <div className="w-full px-9">
          <div className="flex items-center h-20">

            {/* LOGO — bilkul left corner */}
            <div onClick={() => handleScroll("hero", "Home")} className="flex items-center gap-3 cursor-pointer group flex-shrink-0 pl-3">
              <div className="w-12 h-12 rounded-2xl flex-shrink-0 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-700 flex items-center justify-center shadow-[0_4px_18px_rgba(234,88,12,0.38)] group-hover:shadow-[0_6px_26px_rgba(234,88,12,0.55)] group-hover:scale-105 transition-all duration-300 border border-orange-300/40 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-2xl" />
                <span className="font-playfair text-white font-black text-lg leading-none tracking-tight select-none relative z-10">BB</span>
              </div>
              <div className="flex flex-col">
                <span className="font-playfair font-black text-stone-800 leading-none tracking-tight" style={{ fontSize: "1.18rem" }}>Bite Boss</span>
                <span className="font-lora font-medium text-orange-500 uppercase tracking-[0.22em] leading-none mt-1" style={{ fontSize: "0.52rem" }}>Fine Dining</span>
              </div>
            </div>

            {/* DESKTOP NAV — center */}
            <ul className="hidden md:flex items-center gap-9 list-none m-0 p-0 flex-1 justify-center">
              {menuItems.map((item, i) => (
                <li key={i} onClick={() => item.type === "route" ? handleRoute(item.target, item.name) : handleScroll(item.target, item.name)}
                  className={`nav-link cursor-pointer select-none font-lora font-semibold text-sm tracking-widest uppercase transition-colors duration-200 ${active === item.name ? "is-active text-orange-600" : "text-stone-500 hover:text-orange-600"}`}>
                  {item.name}
                </li>
              ))}
            </ul>

            {/* DESKTOP RIGHT — bilkul right corner */}
            <div className="hidden md:flex items-center gap-1 flex-shrink-0 pr-3">

              {/* SEARCH with dropdown */}
              <div className="relative" ref={searchRef}>
                <button
                  onClick={() => { setSearchOpen(o => !o); if (searchOpen) setSearchQuery(""); }}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-stone-500 hover:text-orange-600 hover:bg-orange-100/80 transition-all duration-200 border-none bg-transparent cursor-pointer"
                >
                  <FaSearch size={14} />
                </button>

                {/* GLOBAL SEARCH DROPDOWN */}
                {searchOpen && (
                  <div className="search-drop absolute right-0 top-[calc(100%+12px)] w-80 bg-white rounded-2xl border border-orange-200/70 shadow-[0_16px_48px_rgba(234,88,12,0.16)] z-50 overflow-hidden">
                    {/* Search Input */}
                    <div className="p-3 border-b border-orange-100">
                      <div className="relative">
                        <FaSearch size={11} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-300" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={handleSearchChange}
                          placeholder="Search food, tables..."
                          autoFocus
                          className="w-full font-lora text-sm text-stone-800 pl-9 pr-4 py-2.5 rounded-xl bg-orange-50/60 border border-orange-200 placeholder-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* Results */}
                    {searchQuery.trim() && (
                      <div className="search-results-scroll max-h-80 overflow-y-auto">
                        {!hasResults ? (
                          <div className="px-4 py-6 text-center">
                            <p className="text-stone-400 font-lora text-sm">Koi result nahi mila</p>
                            <p className="text-orange-300 font-lora text-xs mt-1">"{searchQuery}" ke liye</p>
                          </div>
                        ) : (
                          <>
                            {/* Food Results */}
                            {productResults.length > 0 && (
                              <div>
                                <div className="px-4 pt-3 pb-1.5 flex items-center gap-2">
                                  <FaUtensils size={9} className="text-orange-400" />
                                  <span className="font-lora text-[0.55rem] tracking-[0.2em] uppercase text-orange-400 font-semibold">Food Items ({productResults.length})</span>
                                </div>
                                {productResults.slice(0, 5).map((product) => (
                                  <div
                                    key={product._id}
                                    onClick={() => handleProductClick(product)}
                                    className="search-result-item flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors duration-150"
                                  >
                                    {product.image ? (
                                      <img src={product.image} alt={product.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0 border border-orange-100" />
                                    ) : (
                                      <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                                        <FaUtensils size={12} className="text-orange-400" />
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <p className="font-lora font-semibold text-sm text-stone-700 truncate">{product.name}</p>
                                      <p className="font-lora text-xs text-orange-400 capitalize">{product.category}</p>
                                    </div>
                                    {product.price && (
                                      <span className="font-lora font-semibold text-xs text-orange-600 flex-shrink-0">PKR {product.price}</span>
                                    )}
                                  </div>
                                ))}
                                {productResults.length > 5 && (
                                  <p className="px-4 py-1.5 font-lora text-xs text-orange-400 text-center">+{productResults.length - 5} more items</p>
                                )}
                              </div>
                            )}

                            {/* Divider */}
                            {productResults.length > 0 && tableResults.length > 0 && (
                              <div className="mx-4 my-1 h-px bg-orange-100" />
                            )}

                            {/* Table Results */}
                            {tableResults.length > 0 && (
                              <div>
                                <div className="px-4 pt-3 pb-1.5 flex items-center gap-2">
                                  <FaChair size={9} className="text-orange-400" />
                                  <span className="font-lora text-[0.55rem] tracking-[0.2em] uppercase text-orange-400 font-semibold">Tables ({tableResults.length})</span>
                                </div>
                                {tableResults.map((table) => (
                                  <div
                                    key={table._id}
                                    onClick={() => handleTableClick(table)}
                                    className="search-result-item flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors duration-150"
                                  >
                                    <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                                      <FaChair size={12} className="text-orange-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-lora font-semibold text-sm text-stone-700">Table {table.tableNumber}</p>
                                      <p className="font-lora text-xs text-stone-400">👥 {table.seats} seats</p>
                                    </div>
                                    <span className={`font-lora font-semibold text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${table.status === "Booked" ? "bg-red-100 text-red-500" : "bg-green-100 text-green-600"}`}>
                                      {table.status}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}

                    {/* Empty state — no query */}
                    {!searchQuery.trim() && (
                      <div className="px-4 py-5 text-center">
                        <FaSearch size={18} className="text-orange-200 mx-auto mb-2" />
                        <p className="font-lora text-xs text-stone-400">Food ya table search karein</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="w-px h-5 bg-orange-200 mx-1" />

              <button onClick={() => handleRoute("/cart", "Cart")} className="relative w-9 h-9 rounded-full flex items-center justify-center text-stone-500 hover:text-orange-600 hover:bg-orange-100/80 transition-all duration-200 border-none bg-transparent cursor-pointer">
                <FaShoppingCart size={15} className={shakeCart ? "shake" : ""} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full bg-gradient-to-br from-orange-500 to-orange-700 text-white font-bold flex items-center justify-center border-2 border-orange-50 shadow-md leading-none" style={{ fontSize: "0.58rem" }}>
                    {cartItems.length}
                  </span>
                )}
              </button>

              <button onClick={handleBellClick} className="relative w-9 h-9 rounded-full flex items-center justify-center text-stone-500 hover:text-orange-600 hover:bg-orange-100/80 transition-all duration-200 border-none bg-transparent cursor-pointer">
                <FaBell size={15} className={hasNotif ? "bell-ring" : ""} />
                {hasNotif && (
                  <span className="notif-dot absolute -top-1 -right-1 w-[10px] h-[10px] rounded-full bg-gradient-to-br from-orange-500 to-orange-700 border-2 border-orange-50" />
                )}
              </button>

              <div className="w-px h-5 bg-orange-200 mx-1" />

              {isLoggedIn && (
                <div className="user-chip mr-1">
                  <div className="user-chip-dot" />
                  {userName}
                </div>
              )}

              <AuthButton />
            </div>

            {/* MOBILE RIGHT */}
            <div className="md:hidden flex items-center gap-2 ml-auto pr-3">
              <button onClick={() => handleRoute("/cart","Cart")} className="relative w-9 h-9 rounded-full flex items-center justify-center text-stone-600 hover:text-orange-600 hover:bg-orange-100 transition-all border-none bg-transparent cursor-pointer">
                <FaShoppingCart size={17} className={shakeCart ? "shake" : ""} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full bg-orange-500 text-white font-bold flex items-center justify-center border-2 border-orange-50 leading-none" style={{ fontSize:"0.58rem" }}>
                    {cartItems.length}
                  </span>
                )}
              </button>
              <button onClick={() => setIsOpen(true)} className="w-9 h-9 rounded-full flex items-center justify-center text-stone-600 hover:text-orange-600 hover:bg-orange-100 transition-all border-none bg-transparent cursor-pointer">
                <FaBars size={18} />
              </button>
            </div>

          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-orange-200/60 to-transparent" />
      </nav>

      {/* MOBILE OVERLAY */}
      <div onClick={() => setIsOpen(false)} className={`fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} />

      {/* MOBILE DRAWER */}
      <div className={`font-lora fixed top-0 right-0 h-full w-72 z-50 bg-orange-50 border-l border-orange-200/60 shadow-[-8px_0_48px_rgba(234,88,12,0.13)] flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? "translate-x-0" : "translate-x-full"}`}>

        <div className="h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-80" />

        <div className="flex items-center justify-between px-5 py-4 border-b border-orange-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex-shrink-0 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-700 flex items-center justify-center shadow-[0_3px_12px_rgba(234,88,12,0.35)] border border-orange-300/40 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent" />
              <span className="font-playfair text-white font-black text-base leading-none tracking-tight select-none relative z-10">BB</span>
            </div>
            <div>
              <p className="font-playfair font-black text-stone-800 leading-none" style={{ fontSize:"1.05rem" }}>Bite Boss</p>
              <p className="font-lora font-medium text-orange-500 uppercase tracking-[0.2em] mt-0.5" style={{ fontSize:"0.5rem" }}>Fine Dining</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-orange-600 hover:bg-orange-100 transition-all border-none bg-transparent cursor-pointer">
            <FaTimes size={15} />
          </button>
        </div>

        {isLoggedIn && (
          <div className="mx-4 mt-4 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-100 to-amber-50 border border-orange-200/60 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_0_3px_rgba(34,197,94,0.2)] flex-shrink-0" />
            <FaUserCircle size={13} className="text-orange-500 flex-shrink-0" />
            <span className="font-lora font-semibold text-xs text-orange-700 truncate">{userName}</span>
          </div>
        )}

        <div className="flex-1 px-4 py-5 overflow-y-auto">
          <p className="font-lora text-[0.52rem] tracking-[0.22em] uppercase text-orange-300 font-medium mb-3 px-1">Navigation</p>
          <ul className="space-y-1.5 list-none p-0 m-0">
            {menuItems.map((item, i) => (
              <li key={i} onClick={() => item.type === "route" ? handleRoute(item.target, item.name) : handleScroll(item.target, item.name)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl cursor-pointer font-lora font-semibold text-sm tracking-widest uppercase transition-all duration-200 ${active === item.name ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-[0_4px_16px_rgba(234,88,12,0.3)]" : "text-stone-500 hover:bg-orange-100 hover:text-orange-600"}`}>
                <span className={`text-[0.6rem] ${active === item.name ? "text-orange-200" : "text-orange-300"}`}>◆</span>
                {item.name}
              </li>
            ))}
          </ul>

          {/* Mobile Search */}
          <div className="mt-6">
            <p className="font-lora text-[0.52rem] tracking-[0.22em] uppercase text-orange-300 font-medium mb-3 px-1">Search</p>
            <div className="relative">
              <FaSearch size={11} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-300" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search food, tables..."
                className="w-full font-lora text-sm text-stone-800 pl-9 pr-4 py-2.5 rounded-xl bg-white/80 border border-orange-200 placeholder-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 transition-all duration-200"
              />
            </div>

            {/* Mobile search results */}
            {searchQuery.trim() && (
              <div className="mt-2 rounded-xl border border-orange-100 overflow-hidden bg-white">
                {!hasResults ? (
                  <p className="px-4 py-3 font-lora text-xs text-stone-400 text-center">Koi result nahi mila</p>
                ) : (
                  <>
                    {productResults.slice(0, 3).map((product) => (
                      <div key={product._id} onClick={() => { handleProductClick(product); setIsOpen(false); }}
                        className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-orange-50 transition-colors border-b border-orange-50 last:border-0">
                        <FaUtensils size={10} className="text-orange-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-lora font-semibold text-xs text-stone-700 truncate">{product.name}</p>
                          <p className="font-lora text-[0.6rem] text-orange-400">{product.category}</p>
                        </div>
                      </div>
                    ))}
                    {tableResults.slice(0, 2).map((table) => (
                      <div key={table._id} onClick={() => { handleTableClick(table); setIsOpen(false); }}
                        className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-orange-50 transition-colors border-b border-orange-50 last:border-0">
                        <FaChair size={10} className="text-orange-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-lora font-semibold text-xs text-stone-700">Table {table.tableNumber}</p>
                          <p className="font-lora text-[0.6rem] text-stone-400">{table.seats} seats</p>
                        </div>
                        <span className={`text-[0.6rem] font-semibold px-1.5 py-0.5 rounded-full ${table.status === "Booked" ? "bg-red-100 text-red-500" : "bg-green-100 text-green-600"}`}>
                          {table.status}
                        </span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="px-4 py-4 border-t border-orange-100 space-y-2.5">
          <button
            onClick={() => { handleBellClick(); setIsOpen(false); }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/70 border border-orange-200 text-stone-600 hover:text-orange-600 hover:border-orange-400 hover:bg-orange-50 font-lora font-semibold text-sm tracking-wide transition-all duration-200 cursor-pointer relative"
          >
            <FaBell size={15} />
            Notifications
            {hasNotif && (
              <span className="notif-dot absolute top-2.5 right-4 w-[8px] h-[8px] rounded-full bg-orange-500 border border-orange-50" />
            )}
          </button>
          <AuthButton mobile />
        </div>
      </div>

      <div className="h-20" />
    </>
  );
};

export default Navbar;
