import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { products, assets, categories } from "../assets/assets";

const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const todayName = DAYS[new Date().getDay()];

/* ── Magnetic tilt card hook ── */
const useTilt = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });
  const glowX = useTransform(x, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(y, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouse = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleLeave = () => { x.set(0); y.set(0); };

  return { rotateX, rotateY, glowX, glowY, handleMouse, handleLeave };
};

/* ── Category Image Card ── */
const CategoryCard = ({ cat, side, index }) => {
  const [hovered, setHovered] = useState(false);
  const { rotateX, rotateY, glowX, glowY, handleMouse, handleLeave } = useTilt();
  const slideDir = side === "left" ? -60 : 60;

  return (
    <motion.div
      initial={{ opacity: 0, x: slideDir, scale: 0.88 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.13 + 0.15, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 800 }}
    >
      <motion.div
        onMouseMove={handleMouse}
        onMouseLeave={() => { handleLeave(); setHovered(false); }}
        onMouseEnter={() => setHovered(true)}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative cursor-pointer"
      >
        {/* Outer glow */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute -inset-[2px] rounded-[18px]"
          style={{
            background: "linear-gradient(135deg, rgba(249,115,22,0.85), rgba(253,186,116,0.4) 50%, rgba(234,88,12,0.7))",
            filter: "blur(1.5px)",
          }}
        />

        {/* Card */}
        <div className="relative rounded-[16px] overflow-hidden" style={{ width: 200, height: 130 }}>
          {/* Full bleed image */}
          <motion.img
            src={cat.img}
            alt={cat.title}
            animate={{ scale: hovered ? 1.1 : 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0" style={{
            background: hovered
              ? "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.2) 55%, rgba(0,0,0,0.05) 100%)"
              : "linear-gradient(to top, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.12) 60%, rgba(0,0,0,0) 100%)",
            transition: "background 0.4s ease",
          }} />

          {/* Shimmer bar top */}
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{
            background: side === "left"
              ? "linear-gradient(90deg, #c2410c, #f97316, #fbbf24)"
              : "linear-gradient(90deg, #fbbf24, #f97316, #c2410c)",
          }} />

          {/* Mouse light reflection */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${glowX} ${glowY}, rgba(251,146,60,0.25) 0%, transparent 55%)`,
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.3s",
            }}
          />

          {/* Bottom content */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <div className="flex items-end justify-between">
              <div>
                <motion.p
                  animate={{ y: hovered ? 0 : 4, opacity: hovered ? 1 : 0.85 }}
                  transition={{ duration: 0.3 }}
                  className="text-white font-black leading-tight"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
                >
                  {cat.title}
                </motion.p>

                {/* Animated underline on hover */}
                <motion.div
                  animate={{ scaleX: hovered ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="origin-left h-[2px] mt-1 rounded-full"
                  style={{ background: "linear-gradient(90deg, #f97316, #fbbf24)", width: "100%" }}
                />
              </div>

              {/* Arrow icon on hover */}
              <motion.div
                animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 6 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center rounded-full"
                style={{
                  width: 28, height: 28,
                  background: "linear-gradient(135deg, #ea580c, #f97316)",
                  boxShadow: "0 4px 12px rgba(234,88,12,0.5)",
                  flexShrink: 0,
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-3.5 h-3.5">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            </div>
          </div>

          {/* Live "open" pill top-right */}
          <motion.div
            animate={{ scale: hovered ? 1.05 : 1 }}
            className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", display: "inline-block" }}
            />
            <span style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.85)", fontFamily: "'Lora', serif", fontWeight: 600, letterSpacing: "0.1em" }}>OPEN</span>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ════════════ MAIN COMPONENT ════════════ */
const OpeningHours = () => {
  const [text, setText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const fullText = "Experience Luxury Dining";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 75);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const blink = setInterval(() => setCursorVisible(v => !v), 530);
    return () => clearInterval(blink);
  }, []);

  const schedule = [
    { day: "Monday",    time: "9:00 AM – 11:00 PM" },
    { day: "Tuesday",   time: "9:00 AM – 11:00 PM" },
    { day: "Wednesday", time: "9:00 AM – 11:00 PM" },
    { day: "Thursday",  time: "9:00 AM – 11:00 PM" },
    { day: "Friday",    time: "9:00 AM – 11:00 PM" },
    { day: "Saturday",  time: "10:00 AM – 12:00 AM" },
    { day: "Sunday",    time: "Closed" },
  ];

  const leftCats  = categories.slice(0, 5);
  const rightCats = categories.slice(3, 8);

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: "85vh" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=Lora:wght@400;500;600;700&display=swap');
        .font-playfair { font-family: 'Playfair Display', Georgia, serif; }
        .font-lora     { font-family: 'Lora', Georgia, serif; }

        @keyframes shimmerLine {
          0%   { background-position: -300% center; }
          100% { background-position:  300% center; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #c2410c 0%, #f97316 20%, #fbbf24 40%, #f97316 60%, #c2410c 80%, #f97316 100%);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmerLine 5s linear infinite;
        }
        @keyframes orbDrift {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(24px,-18px) scale(1.06); }
          66%      { transform: translate(-14px,22px) scale(0.96); }
        }
        @keyframes sparkle {
          0%,100% { opacity:0; transform: scale(0.3) rotate(0deg); }
          50%      { opacity:1; transform: scale(1) rotate(180deg); }
        }
        @keyframes floatUpDown {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-8px); }
        }
        .schedule-row {
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          border-radius: 10px;
          padding: 9px 12px;
        }
        .schedule-row:hover {
          background: rgba(249,115,22,0.09);
          transform: translateX(4px);
        }
        .schedule-row:hover .day-dot {
          transform: scale(1.4);
          box-shadow: 0 0 10px rgba(249,115,22,0.7) !important;
        }
      `}</style>

      {/* ── VIDEO (compact) ── */}
      <video autoPlay loop muted playsInline
        className="absolute inset-0 w-full h-full object-cover">
        <source src={assets.restaurant} type="video/mp4" />
      </video>

      {/* ── Overlays ── */}
      <div className="absolute inset-0" style={{ background: "rgba(255,245,230,0.52)" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(255,230,200,0.72) 0%, rgba(255,245,230,0.25) 50%, rgba(255,245,230,0.1) 100%)" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(255,230,200,0.4), transparent 28%, transparent 72%, rgba(255,230,200,0.4))" }} />

      {/* ── Ambient orbs ── */}
      <div className="absolute pointer-events-none" style={{
        width: 600, height: 600, top: -180, left: -180, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(251,146,60,0.2) 0%, transparent 65%)",
        animation: "orbDrift 18s ease-in-out infinite",
      }} />
      <div className="absolute pointer-events-none" style={{
        width: 480, height: 480, bottom: -80, right: -100, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(253,186,116,0.22) 0%, transparent 65%)",
        animation: "orbDrift 23s ease-in-out infinite reverse",
      }} />

      {/* ── Diamond sparkles ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute" style={{
            top: `${8 + Math.random() * 84}%`,
            left: `${4 + Math.random() * 92}%`,
            fontSize: i % 4 === 0 ? "8px" : i % 3 === 0 ? "6px" : "5px",
            color: i % 2 === 0 ? "#f97316" : "#fbbf24",
            animation: `sparkle ${2 + Math.random() * 3.5}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            userSelect: "none",
          }}>
            {i % 3 === 0 ? "✦" : i % 2 === 0 ? "◆" : "✶"}
          </div>
        ))}
      </div>

      {/* ════ MAIN CONTENT ════ */}
      <div className="relative z-10 flex flex-col items-center justify-center py-16 px-4 font-lora" style={{ minHeight: "85vh" }}>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full" style={{
            background: "rgba(255,255,255,0.82)",
            border: "1.5px solid rgba(234,88,12,0.3)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 4px 24px rgba(234,88,12,0.14), inset 0 1px 0 rgba(255,255,255,0.95)",
          }}>
            <span style={{ color: "rgba(234,88,12,0.7)", fontSize: "0.5rem", letterSpacing: "0.3em" }}>✦✦✦</span>
            <span className="font-lora font-bold uppercase tracking-[0.28em] text-orange-700" style={{ fontSize: "0.6rem" }}>
              Est. 2019 · Lahore
            </span>
            <span style={{ color: "rgba(234,88,12,0.7)", fontSize: "0.5rem", letterSpacing: "0.3em" }}>✦✦✦</span>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          className="text-center mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
        >
          <h1 className="font-playfair font-black leading-none mb-1" style={{
            fontSize: "clamp(1.8rem, 5vw, 4.2rem)",
            color: "#431407",
            textShadow: "0 2px 20px rgba(234,88,12,0.18)",
          }}>
            {text}
            <span style={{ opacity: cursorVisible ? 1 : 0, color: "#f97316", fontWeight: 300 }}>|</span>
          </h1>
          <h2 className="font-playfair italic shimmer-text" style={{ fontSize: "clamp(1rem, 2.5vw, 1.7rem)", fontWeight: 400 }}>
            Taste the Best Moments
          </h2>
        </motion.div>

        {/* Subtext */}
        <motion.p
          className="font-lora text-orange-800/55 text-sm mb-8 max-w-sm text-center leading-relaxed"
          style={{ letterSpacing: "0.04em" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.8 }}
        >
          Premium dining experience with world-class taste &amp; ambience
        </motion.p>

        {/* ── OPENING HOURS CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.93 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[420px] relative"
          style={{ animation: "floatUpDown 6s ease-in-out infinite" }}
        >
          {/* Glow border */}
          <div className="absolute -inset-[1.5px] rounded-[26px]" style={{
            background: "linear-gradient(135deg, rgba(249,115,22,0.6), rgba(253,186,116,0.25) 50%, rgba(249,115,22,0.45))",
          }} />

          <div className="relative rounded-[25px] overflow-hidden" style={{
            background: "rgba(255,252,248,0.97)",
            backdropFilter: "blur(30px)",
            boxShadow: "0 32px 80px rgba(234,88,12,0.18), 0 8px 32px rgba(234,88,12,0.1), inset 0 1px 0 rgba(255,255,255,0.9)",
          }}>
            {/* Animated top bar */}
            <div className="h-[3px] w-full" style={{
              background: "linear-gradient(90deg, #c2410c, #f97316, #fbbf24, #f97316, #c2410c)",
              backgroundSize: "200% 100%",
              animation: "shimmerLine 3s linear infinite",
            }} />

            <div className="px-7 pt-6 pb-7">
              {/* Card heading */}
              <div className="text-center mb-5">
                <div className="inline-flex items-center gap-2 mb-2">
                  <div className="h-px w-8" style={{ background: "linear-gradient(90deg,transparent,rgba(234,88,12,0.35))" }} />
                  <span className="font-lora font-bold text-orange-500 tracking-[0.25em] uppercase" style={{ fontSize: "0.58rem" }}>We are open</span>
                  <div className="h-px w-8" style={{ background: "linear-gradient(90deg,rgba(234,88,12,0.35),transparent)" }} />
                </div>
                <h2 className="font-playfair font-black text-orange-950 leading-none" style={{ fontSize: "clamp(1.5rem,3.5vw,2.2rem)" }}>
                  Opening{" "}
                  <span className="shimmer-text" style={{ fontStyle: "italic" }}>Hours</span>
                </h2>
              </div>

              {/* Schedule rows */}
              <div className="space-y-0.5 mb-5">
                {schedule.map((item, idx) => {
                  const isToday = item.day === todayName;
                  const isClosed = item.time === "Closed";
                  return (
                    <motion.div
                      key={idx}
                      className="schedule-row flex items-center justify-between cursor-default"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.06, duration: 0.4 }}
                      style={{
                        borderBottom: idx < schedule.length - 1 ? "1px solid rgba(234,88,12,0.09)" : "none",
                        background: isToday ? "rgba(249,115,22,0.08)" : "transparent",
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <motion.div
                          className="day-dot w-2 h-2 rounded-full flex-shrink-0"
                          animate={isToday ? { scale: [1, 1.25, 1] } : {}}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          style={{
                            background: isToday ? "#f97316" : isClosed ? "#dc2626" : "rgba(234,88,12,0.2)",
                            boxShadow: isToday ? "0 0 8px rgba(249,115,22,0.7)" : "none",
                            transition: "transform 0.25s, box-shadow 0.25s",
                          }}
                        />
                        <span className="font-lora" style={{
                          fontSize: "0.88rem",
                          color: isToday ? "#c2410c" : "#57200a",
                          fontWeight: isToday ? 700 : 500,
                        }}>
                          {item.day}
                          {isToday && (
                            <span className="ml-2 rounded-full px-1.5 py-0.5 text-white font-bold" style={{
                              fontSize: "0.52rem", letterSpacing: "0.15em",
                              background: "linear-gradient(90deg, #ea580c, #f97316)",
                              verticalAlign: "middle",
                            }}>TODAY</span>
                          )}
                        </span>
                      </div>
                      <span className="font-lora tabular-nums font-semibold" style={{
                        fontSize: "0.82rem",
                        color: isClosed ? "#dc2626" : isToday ? "#c2410c" : "#92400e",
                        fontWeight: isToday ? 700 : 500,
                      }}>
                        {isClosed ? "✕  Closed" : item.time}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Ornamental divider */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(234,88,12,0.25))" }} />
                <span style={{ color: "rgba(234,88,12,0.45)", fontSize: "0.5rem", letterSpacing: "0.2em" }}>◆ ◆ ◆</span>
                <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg,rgba(234,88,12,0.25),transparent)" }} />
              </div>

              {/* Contact strip */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="rounded-xl p-4 relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(255,237,213,0.85) 0%, rgba(255,248,240,0.95) 100%)",
                  border: "1.5px solid rgba(234,88,12,0.18)",
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: "linear-gradient(90deg,transparent,rgba(234,88,12,0.4),transparent)" }} />
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <p className="font-lora font-bold text-orange-500 tracking-[0.2em] uppercase mb-0.5" style={{ fontSize: "0.56rem" }}>Reservations</p>
                    <p className="font-playfair font-bold text-orange-700" style={{ fontSize: "1rem" }}>📞 +92 300 1234567</p>
                  </div>
                  <div className="w-px self-stretch" style={{ background: "rgba(234,88,12,0.15)" }} />
                  <div className="flex-1">
                    <p className="font-lora font-bold text-orange-500 tracking-[0.2em] uppercase mb-0.5" style={{ fontSize: "0.56rem" }}>Location</p>
                    <p className="font-lora font-semibold text-orange-900 leading-snug" style={{ fontSize: "0.82rem" }}>
                      🏠 123 Food Street<br />
                      <span className="text-orange-600/70 font-normal">Lahore, Pakistan</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,rgba(234,88,12,0.3),transparent)" }} />
          </div>
        </motion.div>
      </div>

      {/* ════ LEFT CATEGORY CARDS ════ */}
     <div className="absolute top-[25%] hidden lg:flex flex-col gap-3 z-8" style={{ right: "calc(50% + 280px)" }}>
  {leftCats.map((cat, i) => (
    <CategoryCard key={cat.id} cat={cat} side="left" index={i} />
  ))}
</div>

{/* ════ RIGHT CATEGORY CARDS ════ */}
<div className="absolute top-[25%] hidden lg:flex flex-col gap-3 z-8" style={{ left: "calc(50% + 280px)" }}>
  {rightCats.map((cat, i) => (
    <CategoryCard key={cat.id} cat={cat} side="right" index={i} />
  ))}
</div>
    </section>
  );
};

export default OpeningHours;
