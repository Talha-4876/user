import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../config";
import { useNavigate } from "react-router-dom";
import table1 from "../assets/T1.jpg";
import table2 from "../assets/T2.jpg";
import table3 from "../assets/T3.jpeg";
import table4 from "../assets/T4.jpg";
import table5 from "../assets/T5.jpg";
import table6 from "../assets/T6.jpg";

const tableImages = [table1, table2, table3, table4, table5, table6];

const INITIAL_COUNT = 3;

// Same meta as TableDetail — location/ambiance badges dikhane ke liye
const TABLE_META = {
  1: { location: "Window Side",    ambiance: "Intimate & Quiet",    badge: "🪟 Window" },
  2: { location: "Garden Facing",  ambiance: "Fresh & Airy",        badge: "🌿 Garden" },
  3: { location: "Central Hall",   ambiance: "Lively & Social",     badge: "🏛️ Central" },
  4: { location: "Corner Booth",   ambiance: "Private & Cozy",      badge: "🔒 Private" },
  5: { location: "Balcony Edge",   ambiance: "Breezy & Scenic",     badge: "🌆 Balcony" },
  6: { location: "Window Side",    ambiance: "Elegant & Warm",      badge: "✨ Elegant" },
  7: { location: "Fireplace",      ambiance: "Warm & Luxurious",    badge: "🔥 Fireplace" },
  8: { location: "Open Hall",      ambiance: "Classic & Spacious",  badge: "👨‍👩‍👧 Family" },
  9: { location: "VIP Alcove",     ambiance: "Exclusive & Opulent", badge: "👑 VIP" },
};

const Tables = () => {
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const fetchTables = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/tables/status`);
      if (res.data.success) setTables(res.data.tables);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
    const interval = setInterval(fetchTables, 15000);
    return () => clearInterval(interval);
  }, []);

  const visibleTables = showAll ? tables : tables.slice(0, INITIAL_COUNT);

  return (
    <section className="py-12 px-6 max-w-7xl mx-auto">
      <h2 className="text-4xl font-extrabold text-center mb-2 text-orange-500">
        Tables Availability
      </h2>
      <p className="text-center text-gray-400 text-sm mb-8">
        Kisi bhi table par click karein details dekhne ke liye
      </p>

      {/* LEGEND */}
      <div className="flex justify-center gap-6 mb-8 text-sm">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
          <span className="text-gray-300">Available</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
          <span className="text-gray-300">Booked</span>
        </span>
      </div>

      {/* TABLES GRID */}
      {loading ? (
        <p className="text-center text-orange-400 text-lg animate-pulse">
          Loading tables...
        </p>
      ) : tables.length === 0 ? (
        <p className="text-center text-gray-400">Koi table nahi mili.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {visibleTables.map((table, index) => {
              const meta = TABLE_META[table.tableNumber] || {
                location: "Dining Area",
                ambiance: "Classic",
                badge: "🍽️ Table",
              };

              return (
                <div
                  key={table._id}
                  onClick={() => navigate(`/tables/${table.tableNumber}`)}
                  className="relative rounded-2xl shadow-2xl overflow-hidden h-72 transition-transform cursor-pointer hover:scale-[1.02] group"
                >
                  <img
                    src={tableImages[index % tableImages.length]}
                    alt={`Table ${table.tableNumber}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />

                  {/* Dark overlay */}
                  <div
                    className={`absolute inset-0 flex flex-col justify-end p-4 transition-all
                      ${table.status === "Booked"
                        ? "bg-gradient-to-t from-red-950/90 via-black/50 to-transparent"
                        : "bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                      }`}
                  >
                    {/* Top badges */}
                    <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold shadow
                          ${table.status === "Booked"
                            ? "bg-red-500 text-white"
                            : "bg-green-500 text-white"
                          }`}
                      >
                        {table.status === "Booked" ? "🔴 Booked" : "🟢 Available"}
                      </span>

                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-black/50 text-yellow-300 border border-yellow-400/30 backdrop-blur-sm">
                        {meta.badge}
                      </span>
                    </div>

                    {/* "View Details" hint on hover */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition duration-300">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm border border-white/20">
                        View Details →
                      </span>
                    </div>

                    {/* Bottom info */}
                    <div>
                      <h3 className="text-white text-2xl font-bold leading-tight">
                        Table {table.tableNumber}
                      </h3>

                      <p className="text-yellow-300 text-xs mt-0.5">
                        {meta.location} · {meta.ambiance}
                      </p>

                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-gray-300 text-xs">
                          👥 {table.seats} Seats
                        </span>
                        {table.label && (
                          <span className="text-gray-300 text-xs">
                            · {table.label}
                          </span>
                        )}
                      </div>

                      {table.status === "Available" ? (
                        <p className="text-xs text-green-300 mt-2 opacity-90">
                          Click karein details & booking ke liye →
                        </p>
                      ) : (
                        <p className="text-xs text-red-300 mt-2 opacity-80">
                          Abhi booked hai — details dekhne ke liye click karein
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* VIEW MORE / VIEW LESS BUTTON */}
          {tables.length > INITIAL_COUNT && (
            <div className="flex justify-center mt-10">
              <button
                onClick={() => setShowAll((prev) => !prev)}
                className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-medium transition flex items-center gap-2"
              >
                {showAll ? (
                  <>View Less <span className="text-lg leading-none">↑</span></>
                ) : (
                  <>View More <span className="text-lg leading-none">↓</span></>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Tables;
