import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../config";
import { motion, AnimatePresence } from "framer-motion";

// ── Table images ──────────────────────────────────────────────
import table1 from "../assets/T1.jpg";
import table2 from "../assets/T2.jpg";
import table3 from "../assets/T3.jpeg";
import table4 from "../assets/T4.jpg";
import table5 from "../assets/T5.jpg";
import table6 from "../assets/T6.jpg";
import table7 from "../assets/table.webp";
import table8 from "../assets/tables.webp";
import table9 from "../assets/taable.avif";

const TABLE_IMAGES = {
  1: table1, 2: table2, 3: table3,
  4: table4, 5: table5, 6: table6,
  7: table7, 8: table8, 9: table9,
};

// ── Per-table static meta ─────────────────────────────────────
const TABLE_META = {
  1: {
    location: "Window Side",
    view: "Street View",
    seating: "Cushioned Chairs",
    ambiance: "Intimate & Quiet",
    features: ["Natural Light", "Power Outlet", "Window View", "Candle Lit"],
    description:
      "A cozy window-side spot perfect for intimate dinners. Enjoy soft street views with warm candlelight and cushioned seating.",
  },
  2: {
    location: "Garden Facing",
    view: "Indoor Garden",
    seating: "Wooden Chairs",
    ambiance: "Fresh & Airy",
    features: ["Garden View", "Airy Space", "Greenery Nearby", "Natural Light"],
    description:
      "Surrounded by lush indoor greenery, this table offers a refreshing dining experience with wooden chairs and earthy tones.",
  },
  3: {
    location: "Central Hall",
    view: "Open Dining Area",
    seating: "Upholstered Sofas",
    ambiance: "Lively & Social",
    features: ["Sofa Seating", "High Ceiling", "Social Setting", "Central Location"],
    description:
      "Positioned at the heart of the restaurant, great for groups wanting to be in the middle of the action with luxurious sofa seating.",
  },
  4: {
    location: "Corner Booth",
    view: "Private Corner",
    seating: "Plush Booth Sofas",
    ambiance: "Private & Cozy",
    features: ["Booth Privacy", "Soft Lighting", "Sofa Comfort", "Secluded"],
    description:
      "A tucked-away corner booth offering maximum privacy. Ideal for business meetings or romantic evenings with plush sofa seating.",
  },
  5: {
    location: "Balcony Edge",
    view: "City Panorama",
    seating: "Rattan Chairs",
    ambiance: "Breezy & Scenic",
    features: ["City View", "Open Air", "Sunset Spot", "Scenic Backdrop"],
    description:
      "Perched at the balcony edge, this table offers a sweeping city panorama — the best seat in the house for sunset dining.",
  },
  6: {
    location: "Window Side",
    view: "Garden & Street",
    seating: "Velvet Chairs",
    ambiance: "Elegant & Warm",
    features: ["Dual View", "Velvet Seating", "Warm Lighting", "Window Side"],
    description:
      "An elegant window table with velvet chairs and a dual view of the garden and street — perfect for a refined dining experience.",
  },
  7: {
    location: "Fireplace Corner",
    view: "Interior Lounge",
    seating: "Leather Sofas",
    ambiance: "Warm & Luxurious",
    features: ["Fireplace Nearby", "Leather Sofas", "Warm Glow", "Lounge Feel"],
    description:
      "Nestled near the fireplace, this table radiates warmth and luxury. Leather sofas make it the most comfortable spot in the house.",
  },
  8: {
    location: "Open Hall",
    view: "Full Restaurant",
    seating: "Padded Chairs",
    ambiance: "Classic & Spacious",
    features: ["Spacious", "Classic Décor", "Central Access", "Family Friendly"],
    description:
      "A classic dining table in the open hall — spacious, well-lit, and perfect for families with easy access to all amenities.",
  },
  9: {
    location: "VIP Alcove",
    view: "Private Alcove",
    seating: "Designer Sofas",
    ambiance: "Exclusive & Opulent",
    features: ["VIP Section", "Designer Sofas", "Premium Service", "Exclusive Access"],
    description:
      "Our most exclusive table. Nestled in a private alcove with designer sofas and dedicated premium service — a true VIP experience.",
  },
};

const TIME_SLOTS = [
  "12:00 PM","12:30 PM","01:00 PM","01:30 PM","02:00 PM","02:30 PM",
  "03:00 PM","03:30 PM","07:00 PM","07:30 PM","08:00 PM","08:30 PM",
  "09:00 PM","09:30 PM","10:00 PM","10:30 PM","11:00 PM",
];

const todayStr = () => new Date().toISOString().split("T")[0];

// ─────────────────────────────────────────────────────────────
export default function TableDetail() {
  const { tableNumber } = useParams();
  const navigate = useNavigate();
  const num = parseInt(tableNumber);

  const [tableData, setTableData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [activeImg, setActiveImg] = useState(0);

  const meta = TABLE_META[num] || TABLE_META[1];
  const images = [TABLE_IMAGES[num], TABLE_IMAGES[num === 9 ? 1 : num + 1], TABLE_IMAGES[num === 1 ? 9 : num - 1]].filter(Boolean);

  // Fetch base table info
  useEffect(() => {
    const fetchTable = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/tables/status`);
        if (res.data.success) {
          const found = res.data.tables.find(t => t.tableNumber === num);
          setTableData(found || null);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchTable();
  }, [num]);

  // Fetch booked slots for selected date
  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDate) return;
      setLoadingSlots(true);
      try {
        const res = await axios.get(`${backendUrl}/api/tables/bookings`, {
          params: { tableNumber: num, date: selectedDate },
        });
        if (res.data.success) setBookings(res.data.bookings || []);
      } catch {
        // fallback: if endpoint doesn't exist, just show no bookings
        setBookings([]);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [selectedDate, num]);

  const bookedSlots = bookings.map(b => b.time);

  const handleBookNow = () => {
    navigate("/book-table", { state: { preSelectedTable: num, preSelectedDate: selectedDate } });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .td-root {
          min-height: 100vh;
          background: #0e0c0a;
          color: #e8e0d4;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── HERO ── */
        .td-hero {
          position: relative;
          height: 520px;
          overflow: hidden;
        }
        @media(max-width:640px){ .td-hero { height: 360px; } }

        .td-hero-img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: opacity 0.6s ease;
        }
        .td-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(14,12,10,0.2) 0%, rgba(14,12,10,0.85) 100%);
        }
        .td-hero-back {
          position: absolute; top: 24px; left: 24px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(8px);
          color: #e8e0d4; border-radius: 50px;
          padding: 8px 18px; font-size: 13px;
          cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; gap: 6px;
          font-family: 'DM Sans', sans-serif;
        }
        .td-hero-back:hover { background: rgba(255,255,255,0.15); }

        .td-hero-thumbs {
          position: absolute; bottom: 20px; right: 24px;
          display: flex; gap: 8px;
        }
        .td-hero-thumb {
          width: 56px; height: 40px; border-radius: 4px;
          overflow: hidden; cursor: pointer;
          border: 2px solid transparent; transition: border-color 0.2s;
        }
        .td-hero-thumb.active { border-color: #c9a96e; }
        .td-hero-thumb img { width: 100%; height: 100%; object-fit: cover; }

        .td-hero-badge {
          position: absolute; top: 24px; right: 24px;
          padding: 6px 16px; border-radius: 50px;
          font-size: 11px; font-weight: 500; letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .td-hero-badge.av { background: rgba(90,170,110,0.2); color: #7ddc97; border: 1px solid rgba(90,170,110,0.4); }
        .td-hero-badge.bk { background: rgba(200,80,60,0.2); color: #f08070; border: 1px solid rgba(200,80,60,0.4); }

        .td-hero-info {
          position: absolute; bottom: 32px; left: 32px;
        }
        .td-hero-tag {
          font-size: 10px; letter-spacing: 0.4em; text-transform: uppercase;
          color: #c9a96e; margin-bottom: 8px;
        }
        .td-hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 3.2rem; font-weight: 300; color: #f5efe6;
          line-height: 1.1;
        }
        .td-hero-title em { font-style: italic; color: #c9a96e; }
        @media(max-width:640px){ .td-hero-title { font-size: 2rem; } }

        /* ── BODY ── */
        .td-body {
          max-width: 1100px; margin: 0 auto;
          padding: 48px 24px 80px;
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 40px;
        }
        @media(max-width:900px){ .td-body { grid-template-columns: 1fr; } }

        /* ── LEFT COL ── */
        .td-section { margin-bottom: 40px; }
        .td-section-label {
          font-size: 9px; letter-spacing: 0.4em; text-transform: uppercase;
          color: #c9a96e; margin-bottom: 14px;
        }
        .td-desc {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.25rem; font-weight: 300; color: #ccc4b8;
          line-height: 1.8;
        }

        /* Meta pills */
        .td-meta-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
        }
        .td-meta-card {
          background: #1a1714;
          border: 1px solid #2e2a25;
          border-radius: 6px; padding: 14px 16px;
        }
        .td-meta-card-label {
          font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase;
          color: #6b6055; margin-bottom: 5px;
        }
        .td-meta-card-val {
          font-size: 14px; color: #e8dfd0; font-weight: 400;
        }

        /* Features */
        .td-features {
          display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px;
        }
        .td-feat {
          background: #1a1714; border: 1px solid #2e2a25;
          border-radius: 50px; padding: 6px 14px;
          font-size: 12px; color: #b0a090;
          display: flex; align-items: center; gap: 6px;
        }
        .td-feat-dot { width: 5px; height: 5px; border-radius: 50%; background: #c9a96e; flex-shrink: 0; }

        /* ── SLOTS ── */
        .td-slots-header {
          display: flex; align-items: center; gap: 12px; margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .td-date-input {
          background: #1a1714; border: 1px solid #2e2a25; border-radius: 4px;
          padding: 8px 12px; color: #e8dfd0;
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          outline: none; transition: border-color 0.2s;
        }
        .td-date-input:focus { border-color: #c9a96e; }
        .td-date-input::-webkit-calendar-picker-indicator { filter: invert(0.7); cursor: pointer; }

        .td-slots-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
          gap: 8px;
        }
        .td-slot {
          padding: 10px 6px; border-radius: 4px; text-align: center;
          font-size: 12px; border: 1px solid #2e2a25;
          transition: all 0.18s;
        }
        .td-slot.free {
          background: #0f1a12; border-color: #2a4030; color: #7ddc97; cursor: default;
        }
        .td-slot.booked {
          background: #1a0f0f; border-color: #3a1f1f; color: #f08070; cursor: default;
        }
        .td-slot-time { font-weight: 500; display: block; margin-bottom: 3px; }
        .td-slot-status { font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.7; }

        .td-slots-loading {
          text-align: center; color: #c9a96e; font-size: 13px; padding: 20px;
        }

        /* ── RIGHT STICKY CARD ── */
        .td-sticky {
          position: sticky; top: 24px; align-self: start;
        }
        .td-card {
          background: #141210;
          border: 1px solid #2e2a25;
          border-radius: 10px; overflow: hidden;
        }
        .td-card-img { width: 100%; height: 200px; object-fit: cover; display: block; }
        .td-card-body { padding: 24px; }
        .td-card-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 3rem; font-weight: 300; color: #c9a96e;
          line-height: 1; margin-bottom: 4px;
        }
        .td-card-name {
          font-size: 14px; color: #8a7e70; margin-bottom: 16px;
        }

        .td-card-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 10px 0; border-bottom: 1px solid #1e1b18;
          font-size: 13px;
        }
        .td-card-row:last-of-type { border-bottom: none; }
        .td-card-row-label { color: #6b6055; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; }
        .td-card-row-val { color: #d5cabc; }

        .td-card-status {
          margin: 20px 0 0;
          padding: 10px; border-radius: 4px; text-align: center;
          font-size: 12px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
        }
        .td-card-status.av { background: rgba(90,170,110,0.1); color: #7ddc97; border: 1px solid rgba(90,170,110,0.25); }
        .td-card-status.bk { background: rgba(200,80,60,0.1); color: #f08070; border: 1px solid rgba(200,80,60,0.25); }

        .td-book-btn {
          width: 100%; margin-top: 16px;
          padding: 14px;
          background: #c9a96e; color: #0e0c0a;
          border: none; border-radius: 4px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.3em; text-transform: uppercase;
          cursor: pointer; transition: all 0.2s;
        }
        .td-book-btn:hover { background: #dfc080; }
        .td-book-btn:disabled {
          background: #2e2a25; color: #5a5248; cursor: not-allowed;
        }

        .td-note {
          font-size: 10px; color: #4a4540; text-align: center;
          margin-top: 10px; line-height: 1.7;
        }

        /* divider */
        .td-rule {
          height: 1px; background: #1e1b18; margin: 32px 0;
        }
      `}</style>

      <div className="td-root">
        {/* ── HERO ── */}
        <div className="td-hero">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImg}
              src={images[activeImg]}
              alt={`Table ${num}`}
              className="td-hero-img"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          </AnimatePresence>

          <div className="td-hero-overlay" />

          <button className="td-hero-back" onClick={() => navigate(-1)}>
            ← Back
          </button>

          <span className={`td-hero-badge ${tableData?.status === "Booked" ? "bk" : "av"}`}>
            {tableData?.status === "Booked" ? "🔴 Booked" : "🟢 Available"}
          </span>

          <div className="td-hero-info">
            <p className="td-hero-tag">Fine Dining · {meta.location}</p>
            <h1 className="td-hero-title">
              Table <em>{num}</em>
            </h1>
          </div>

          {images.length > 1 && (
            <div className="td-hero-thumbs">
              {images.map((img, i) => (
                <div
                  key={i}
                  className={`td-hero-thumb ${i === activeImg ? "active" : ""}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={img} alt={`view ${i + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── BODY ── */}
        <div className="td-body">

          {/* ── LEFT ── */}
          <div>

            {/* Description */}
            <motion.div
              className="td-section"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            >
              <p className="td-section-label">About This Table</p>
              <p className="td-desc">{meta.description}</p>
            </motion.div>

            {/* Meta grid */}
            <motion.div
              className="td-section"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="td-section-label">Table Details</p>
              <div className="td-meta-grid">
                <div className="td-meta-card">
                  <p className="td-meta-card-label">Location</p>
                  <p className="td-meta-card-val">📍 {meta.location}</p>
                </div>
                <div className="td-meta-card">
                  <p className="td-meta-card-label">View</p>
                  <p className="td-meta-card-val">🌅 {meta.view}</p>
                </div>
                <div className="td-meta-card">
                  <p className="td-meta-card-label">Seating</p>
                  <p className="td-meta-card-val">🪑 {meta.seating}</p>
                </div>
                <div className="td-meta-card">
                  <p className="td-meta-card-label">Ambiance</p>
                  <p className="td-meta-card-val">✨ {meta.ambiance}</p>
                </div>
                <div className="td-meta-card">
                  <p className="td-meta-card-label">Capacity</p>
                  <p className="td-meta-card-val">👥 {tableData?.seats ?? "—"} Guests</p>
                </div>
                <div className="td-meta-card">
                  <p className="td-meta-card-label">Table No.</p>
                  <p className="td-meta-card-val">🔢 Table {num}</p>
                </div>
              </div>
            </motion.div>

            {/* Features */}
            <motion.div
              className="td-section"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            >
              <p className="td-section-label">Features & Amenities</p>
              <div className="td-features">
                {meta.features.map(f => (
                  <span className="td-feat" key={f}>
                    <span className="td-feat-dot" />{f}
                  </span>
                ))}
              </div>
            </motion.div>

            <div className="td-rule" />

            {/* Time Slots */}
            <motion.div
              className="td-section"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="td-section-label">Availability by Time Slot</p>
              <div className="td-slots-header">
                <span style={{ fontSize: 13, color: "#8a7e70" }}>Select date:</span>
                <input
                  type="date"
                  className="td-date-input"
                  value={selectedDate}
                  min={todayStr()}
                  onChange={e => setSelectedDate(e.target.value)}
                />
              </div>

              {loadingSlots ? (
                <p className="td-slots-loading">Loading slots…</p>
              ) : (
                <div className="td-slots-grid">
                  {TIME_SLOTS.map(slot => {
                    const isBooked = bookedSlots.includes(slot);
                    return (
                      <div key={slot} className={`td-slot ${isBooked ? "booked" : "free"}`}>
                        <span className="td-slot-time">{slot}</span>
                        <span className="td-slot-status">{isBooked ? "Booked" : "Free"}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>

          </div>

          {/* ── RIGHT STICKY ── */}
          <div className="td-sticky">
            <motion.div
              className="td-card"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
            >
              <img src={TABLE_IMAGES[num]} alt={`Table ${num}`} className="td-card-img" />
              <div className="td-card-body">
                <div className="td-card-num">{num}</div>
                <div className="td-card-name">{meta.location} · {meta.ambiance}</div>

                <div className="td-card-row">
                  <span className="td-card-row-label">Seats</span>
                  <span className="td-card-row-val">{tableData?.seats ?? "—"} Guests</span>
                </div>
                <div className="td-card-row">
                  <span className="td-card-row-label">Seating Type</span>
                  <span className="td-card-row-val">{meta.seating}</span>
                </div>
                <div className="td-card-row">
                  <span className="td-card-row-label">View</span>
                  <span className="td-card-row-val">{meta.view}</span>
                </div>
                <div className="td-card-row">
                  <span className="td-card-row-label">Lunch Hours</span>
                  <span className="td-card-row-val">12:00 – 15:00</span>
                </div>
                <div className="td-card-row">
                  <span className="td-card-row-label">Dinner Hours</span>
                  <span className="td-card-row-val">19:00 – 23:00</span>
                </div>
                {tableData?.label && (
                  <div className="td-card-row">
                    <span className="td-card-row-label">Label</span>
                    <span className="td-card-row-val">{tableData.label}</span>
                  </div>
                )}

                <div className={`td-card-status ${tableData?.status === "Booked" ? "bk" : "av"}`}>
                  {tableData?.status === "Booked" ? "🔴 Currently Booked" : "🟢 Available to Book"}
                </div>

                <button
                  className="td-book-btn"
                  disabled={tableData?.status === "Booked"}
                  onClick={handleBookNow}
                >
                  {tableData?.status === "Booked" ? "Not Available" : "Reserve This Table"}
                </button>

                <p className="td-note">
                  Cancellations accepted up to 2 hrs prior<br />
                  For events call us directly
                </p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </>
  );
}
