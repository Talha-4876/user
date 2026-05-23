import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FaUtensils, FaTruck, FaTable,
  FaConciergeBell, FaStar, FaTools,
} from "react-icons/fa";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

/* ── Service data ───────────────────────────────────────── */
const services = [
  {
    id: 1, number: "01", tag: "CUISINE",
    title: "Delicious Food",
    desc: "Freshly prepared meals crafted with premium ingredients sourced from around the globe.",
    icon: <FaUtensils />,
    color: "#bf4a08", accent: "#e8680c", light: "#fff8f2", border: "#fdd5b0",
  },
  {
    id: 2, number: "02", tag: "LOGISTICS",
    title: "Fast Delivery",
    desc: "Lightning-fast delivery right at your doorstep. Hot, fresh, and always on time.",
    icon: <FaTruck />,
    color: "#a85c08", accent: "#d97706", light: "#fffbf0", border: "#fde5a0",
  },
  {
    id: 3, number: "03", tag: "RESERVE",
    title: "Table Booking",
    desc: "Reserve your perfect table instantly, anytime. Luxury dining awaits your arrival.",
    icon: <FaTable />,
    color: "#bf4a08", accent: "#ea580c", light: "#fff5f0", border: "#fcc8a8",
  },
  {
    id: 4, number: "04", tag: "SUPPORT",
    title: "24 / 7 Service",
    desc: "Round-the-clock service with a team that never sleeps. We exist to serve you.",
    icon: <FaConciergeBell />,
    color: "#bf4a08", accent: "#e8680c", light: "#fff8f2", border: "#fdcfaa",
  },
  {
    id: 5, number: "05", tag: "QUALITY",
    title: "Top Quality",
    desc: "Uncompromising quality standards with every detail curated to perfection.",
    icon: <FaStar />,
    color: "#8c5208", accent: "#c8820a", light: "#fffbeb", border: "#fde9a0",
  },
  {
    id: 6, number: "06", tag: "CARE",
    title: "Maintenance",
    desc: "Seamless maintenance and support to keep every service running flawlessly.",
    icon: <FaTools />,
    color: "#9a5a08", accent: "#c8820a", light: "#fffbeb", border: "#fde8a0",
  },
];

/* ── Magnetic hook ──────────────────────────────────────── */
function useMagnetic(strength = 0.32) {
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18 });
  const sy = useSpring(y, { stiffness: 200, damping: 18 });
  const onMove  = (e) => { const r = ref.current.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * strength); y.set((e.clientY - r.top - r.height / 2) * strength); };
  const onLeave = () => { x.set(0); y.set(0); };
  return { ref, sx, sy, onMove, onLeave };
}

/* ── CSS ────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Nunito:wght@400;500;600;700;800&display=swap');

  .svc-section {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 6rem 1.5rem 5rem;
    background: linear-gradient(160deg, #fff9f3 0%, #fff4ea 45%, #fef6e4 100%);
    font-family: 'Nunito', sans-serif;
  }

  /* Card */
  .svc-card {
    position: absolute;
    top: 50%; left: 50%;
    width: 300px;
    min-height: 400px;
    border-radius: 28px;
    overflow: hidden;
    cursor: pointer;
    user-select: none;
    display: flex;
    flex-direction: column;
  }

  /* Side list item */
  .svc-list-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 14px 20px;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
    border: 1.5px solid transparent;
  }
  .svc-list-item:hover {
    transform: translateX(6px);
  }
  .svc-list-item.active {
    background: rgba(255,255,255,0.85);
    border-color: rgba(232,104,12,0.22);
    box-shadow: 0 4px 20px rgba(232,104,12,0.1), inset 0 1px 0 rgba(255,255,255,0.9);
  }

  /* Nav dot */
  .nav-dot {
    border-radius: 99px;
    transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
    cursor: pointer;
    border: none;
    outline: none;
  }

  /* Shimmer line */
  @keyframes shimLine {
    0%   { background-position: -300% center; }
    100% { background-position: 300% center; }
  }
  .shim-line {
    background: linear-gradient(90deg, transparent, #e8680c, #d4a843, #e8680c, transparent);
    background-size: 300% auto;
    animation: shimLine 4s linear infinite;
  }

  /* Float orb */
  @keyframes floatO {
    0%,100% { transform: translate(0,0) scale(1); }
    33%  { transform: translate(16px,-20px) scale(1.04); }
    66%  { transform: translate(-10px,12px) scale(0.97); }
  }

  /* Icon pulse */
  @keyframes iconPulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(232,104,12,0.0); }
    50%      { box-shadow: 0 0 0 12px rgba(232,104,12,0.08); }
  }

  /* Slide in */
  @keyframes slideUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
  }
`;

/* ── Service Card Component ─────────────────────────────── */
function ServiceCard({ service, position, onClick }) {
  const isCenter   = position === 0;
  const isAdjacent = Math.abs(position) === 1;
  const scale   = isCenter ? 1 : isAdjacent ? 0.8 : 0.62;
  const opacity = isCenter ? 1 : isAdjacent ? 0.45 : 0.15;
  const zIndex  = isCenter ? 10 : isAdjacent ? 5 : 1;

  return (
    <motion.div
      className="svc-card"
      style={{ zIndex }}
      animate={{
        x: position * 320 - 150,
        y: "-50%",
        scale,
        opacity,
        rotateY: isCenter ? 0 : position * -18,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      onClick={() => !isCenter && onClick(position)}
    >
      <motion.div
        className="w-full h-full rounded-[28px] relative overflow-hidden"
        style={{
          background: isCenter
            ? `linear-gradient(160deg, #ffffff 0%, ${service.light} 100%)`
            : "rgba(255,250,245,0.75)",
          border: isCenter
            ? `2px solid ${service.border}`
            : "1.5px solid rgba(232,104,12,0.08)",
          boxShadow: isCenter
            ? `0 28px 72px -10px ${service.accent}28, 0 0 0 1px ${service.border}50, 0 6px 20px rgba(232,104,12,0.08)`
            : "0 4px 16px rgba(232,104,12,0.05)",
          minHeight: 400,
          display: "flex",
          flexDirection: "column",
        }}
        whileHover={isCenter ? { scale: 1.02, y: -4 } : {}}
        transition={{ duration: 0.3 }}
      >
        {/* Top shimmer bar */}
        {isCenter && (
          <div className="absolute top-0 left-10 right-10 h-[2px] rounded-full shim-line" />
        )}

        {/* Watermark number */}
        <div
          className="absolute top-3 right-5 pointer-events-none select-none"
          style={{
            fontSize: "5.5rem",
            fontWeight: 900,
            fontFamily: "'Playfair Display', serif",
            color: `${service.accent}0d`,
            WebkitTextStroke: `1px ${service.accent}14`,
            lineHeight: 1,
          }}
        >
          {service.number}
        </div>

        {/* Tag pill */}
        <div className="absolute top-6 left-6">
          <span style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: "0.65rem",
            fontWeight: 800,
            letterSpacing: "0.28em",
            padding: "5px 14px",
            borderRadius: 99,
            color: service.color,
            background: `${service.accent}16`,
            border: `1px solid ${service.accent}28`,
          }}>
            {service.tag}
          </span>
        </div>

        {/* Icon */}
        <div className="flex justify-center" style={{ marginTop: 80 }}>
          <motion.div
            style={{
              width: 80, height: 80,
              borderRadius: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              color: service.color,
              background: `linear-gradient(145deg, ${service.accent}20, ${service.accent}0c)`,
              border: `2px solid ${service.border}`,
              animation: isCenter ? "iconPulse 3s ease-in-out infinite" : "none",
              boxShadow: isCenter ? `0 8px 28px ${service.accent}20` : "none",
            }}
            animate={isCenter ? { rotate: [0, 4, -4, 0] } : {}}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            {service.icon}

            {isCenter && (
              <motion.div
                className="absolute inset-0 rounded-[22px]"
                style={{ background: `radial-gradient(circle, ${service.accent}20, transparent)` }}
                animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2.8, repeat: Infinity }}
              />
            )}
          </motion.div>
        </div>

        {/* Text block */}
        <div style={{ padding: "24px 28px 32px", marginTop: "auto" }}>
          <div style={{
            height: 2, width: 40, borderRadius: 2, marginBottom: 14,
            background: `linear-gradient(90deg, ${service.color}, transparent)`,
          }} />

          {/* Title — large, readable */}
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.45rem",
            fontWeight: 700,
            color: service.color,
            letterSpacing: "-0.01em",
            lineHeight: 1.3,
            marginBottom: 10,
          }}>
            {service.title}
          </h3>

          {/* Description — bigger font, softer color */}
          <p style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: "0.95rem",
            fontWeight: 500,
            color: "#7a4a1e",
            lineHeight: 1.75,
            opacity: 0.88,
          }}>
            {service.desc}
          </p>

          {isCenter && (
            <motion.div
              style={{
                marginTop: 18,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.2em",
                color: service.color,
                fontFamily: "'Nunito', sans-serif",
              }}
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              EXPLORE <span style={{ fontSize: "1rem" }}>→</span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main Component ─────────────────────────────────────── */
export default function Services() {
  const [index, setIndex]     = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStartX  = useRef(0);
  const intervalRef = useRef(null);
  const prevBtn = useMagnetic(0.38);
  const nextBtn = useMagnetic(0.38);
  const current = services[index];

  const startAuto = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(
      () => setIndex(i => (i + 1) % services.length), 4500
    );
  }, []);

  useEffect(() => { startAuto(); return () => clearInterval(intervalRef.current); }, [startAuto]);

  const go = (dir) => {
    clearInterval(intervalRef.current);
    setIndex(i => (i + dir + services.length) % services.length);
    startAuto();
  };

  const onDragStart = (e) => {
    setDragging(true);
    dragStartX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
  };
  const onDragEnd = (e) => {
    if (!dragging) return;
    const diff = dragStartX.current - (e.clientX ?? e.changedTouches?.[0]?.clientX ?? 0);
    if (Math.abs(diff) > 50) go(diff > 0 ? 1 : -1);
    setDragging(false);
  };

  const getPos = (i) => {
    let p = i - index;
    if (p >  services.length / 2) p -= services.length;
    if (p < -services.length / 2) p += services.length;
    return p;
  };

  return (
    <>
      <style>{STYLES}</style>

      <section className="svc-section">

        {/* Ambient orbs */}
        {[
          { w:650, h:650, t:"-15%", l:"-14%", op:0.42, dur:"26s" },
          { w:480, h:480, b:"-12%", r:"-12%", op:0.32, dur:"32s", rev:true },
          { w:300, h:300, t:"42%",  r:"16%",  op:0.2,  dur:"20s" },
        ].map((o,i) => (
          <div key={i} className="absolute pointer-events-none rounded-full" style={{
            width:o.w, height:o.h,
            top:o.t, left:o.l, bottom:o.b, right:o.r,
            opacity:o.op,
            background:"radial-gradient(circle at 35% 35%, rgba(232,140,60,0.22) 0%, rgba(212,168,67,0.14) 40%, transparent 70%)",
            filter:"blur(55px)",
            animation:`floatO ${o.dur} ease-in-out infinite ${o.rev?"reverse":""}`,
          }}/>
        ))}

        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage:"radial-gradient(circle, rgba(232,104,12,0.08) 1.5px, transparent 1.5px)",
          backgroundSize:"36px 36px",
        }}/>

        {/* Top edge accent */}
        <div className="absolute top-0 left-0 right-0" style={{
          height:2,
          background:"linear-gradient(90deg,transparent,rgba(232,104,12,0.3) 20%,rgba(212,168,67,0.65) 50%,rgba(232,104,12,0.3) 80%,transparent)",
        }}/>

        {/* ── Header ── */}
        <div className="relative z-20 text-center mb-14">
          {/* Eyebrow */}
          <motion.div
            key={current.id + "ey"}
            initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
            style={{ marginBottom:14, display:"flex", alignItems:"center", justifyContent:"center", gap:12 }}>
            <div style={{ height:1, width:40, background:`linear-gradient(90deg,transparent,${current.color})` }}/>
            <span style={{
              fontFamily:"'Nunito',sans-serif",
              fontSize:"0.68rem", fontWeight:800,
              letterSpacing:"0.35em",
              color: current.color,
            }}>
              ◆ WHAT WE OFFER ◆
            </span>
            <div style={{ height:1, width:40, background:`linear-gradient(270deg,transparent,${current.color})` }}/>
          </motion.div>

          {/* Main heading — very large for readability */}
          <h1 style={{
            fontFamily:"'Playfair Display', serif",
            fontSize:"clamp(3.5rem, 8vw, 7rem)",
            fontWeight:900,
            lineHeight:1,
            letterSpacing:"-0.03em",
            color:"#3d1c06",
            marginBottom:16,
          }}>
            Our{" "}
            <motion.span
              key={current.id + "sp"}
              initial={{ opacity:0 }} animate={{ opacity:1 }}
              style={{ color: current.accent, fontStyle:"italic" }}>
              Services
            </motion.span>
          </h1>

          {/* Sub heading */}
          <motion.p
            key={current.id + "sub"}
            initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.1 }}
            style={{
              fontFamily:"'Nunito',sans-serif",
              fontSize:"1.05rem",
              fontWeight:500,
              color:"#8c5028",
              maxWidth:480,
              margin:"0 auto 16px",
              lineHeight:1.7,
            }}>
            Everything you need for an unforgettable dining experience.
          </motion.p>

          {/* Animated underline */}
          <motion.div
            key={current.id + "ul"}
            className="shim-line mx-auto rounded-full"
            style={{ height:3 }}
            animate={{ width:["0px","200px"] }}
            transition={{ duration:0.7 }}
          />
        </div>

        {/* ── Carousel ── */}
        <div
          className="relative w-full max-w-4xl z-10"
          style={{ height:440, perspective:"1200px" }}
          onMouseDown={onDragStart} onMouseUp={onDragEnd}
          onTouchStart={onDragStart} onTouchEnd={onDragEnd}
          onMouseEnter={() => clearInterval(intervalRef.current)}
          onMouseLeave={startAuto}
        >
          {services.map((s, i) => (
            <ServiceCard key={s.id} service={s} position={getPos(i)} onClick={go} />
          ))}
        </div>

        {/* ── Navigation ── */}
        <div className="flex items-center gap-10 mt-14 z-20">

          {/* Prev */}
          <motion.button
            ref={prevBtn.ref}
            style={{ x: prevBtn.sx, y: prevBtn.sy,
              width:58, height:58, borderRadius:"50%",
              border:`2px solid ${current.border}`,
              background:"rgba(255,255,255,0.88)",
              color: current.color,
              fontSize:"1.2rem", fontWeight:800,
              display:"flex", alignItems:"center", justifyContent:"center",
              cursor:"pointer",
              boxShadow:`0 6px 24px ${current.accent}18`,
            }}
            onMouseMove={prevBtn.onMove} onMouseLeave={prevBtn.onLeave}
            onClick={() => go(-1)}
            whileHover={{ scale:1.14 }} whileTap={{ scale:0.91 }}
          >←</motion.button>

          {/* Dots */}
          <div className="flex items-center gap-3">
            {services.map((_, i) => (
              <motion.button
                key={i}
                className="nav-dot"
                onClick={() => { clearInterval(intervalRef.current); setIndex(i); startAuto(); }}
                animate={{
                  width:  index === i ? 32 : 9,
                  height: 9,
                  background: index === i ? current.accent : `${current.accent}30`,
                }}
                transition={{ type:"spring", stiffness:300, damping:26 }}
              />
            ))}
          </div>

          {/* Next */}
          <motion.button
            ref={nextBtn.ref}
            style={{ x: nextBtn.sx, y: nextBtn.sy,
              width:58, height:58, borderRadius:"50%",
              border:`2px solid ${current.border}`,
              background:"rgba(255,255,255,0.88)",
              color: current.color,
              fontSize:"1.2rem", fontWeight:800,
              display:"flex", alignItems:"center", justifyContent:"center",
              cursor:"pointer",
              boxShadow:`0 6px 24px ${current.accent}18`,
            }}
            onMouseMove={nextBtn.onMove} onMouseLeave={nextBtn.onLeave}
            onClick={() => go(1)}
            whileHover={{ scale:1.14 }} whileTap={{ scale:0.91 }}
          >→</motion.button>
        </div>

        {/* ── Counter + current label ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id + "ctr"}
            initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
            transition={{ duration:0.35 }}
            className="z-20 mt-10 flex flex-col items-center gap-2"
          >
            <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
              <span style={{
                fontFamily:"'Playfair Display',serif",
                fontSize:"2.4rem", fontWeight:900,
                color: current.accent, lineHeight:1,
              }}>
                {current.number}
              </span>
              <span style={{ color:`${current.accent}40`, fontSize:"1.3rem", fontWeight:300 }}>/</span>
              <span style={{
                fontFamily:"'Nunito',sans-serif",
                fontSize:"0.85rem", fontWeight:700,
                color:`${current.accent}60`,
                letterSpacing:"0.1em",
              }}>
                0{services.length}
              </span>
            </div>

            {/* Current service name below counter */}
            <span style={{
              fontFamily:"'Nunito',sans-serif",
              fontSize:"0.75rem", fontWeight:800,
              letterSpacing:"0.25em",
              color: current.color,
              textTransform:"uppercase",
              opacity:0.75,
            }}>
              {current.title}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* ── Side list (desktop) — quick access ── */}
        <div
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col gap-2"
          style={{ maxWidth:200 }}
        >
          {services.map((s, i) => (
            <button
              key={s.id}
              className={`svc-list-item ${i === index ? "active" : ""}`}
              onClick={() => { clearInterval(intervalRef.current); setIndex(i); startAuto(); }}
              style={{
                background: i === index ? "rgba(255,255,255,0.85)" : "transparent",
                borderColor: i === index ? `${current.border}` : "transparent",
              }}
            >
              {/* Icon dot */}
              <div style={{
                width:36, height:36, borderRadius:10, flexShrink:0,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"0.95rem",
                color: i === index ? s.color : "#c8a088",
                background: i === index ? `${s.accent}18` : "rgba(232,104,12,0.06)",
                transition:"all 0.3s ease",
              }}>
                {s.icon}
              </div>
              {/* Label */}
              <div>
                <div style={{
                  fontFamily:"'Nunito',sans-serif",
                  fontSize:"0.82rem",
                  fontWeight: i === index ? 700 : 500,
                  color: i === index ? s.color : "#b07050",
                  lineHeight:1.2,
                  transition:"color 0.3s",
                }}>
                  {s.title}
                </div>
                <div style={{
                  fontFamily:"'Nunito',sans-serif",
                  fontSize:"0.6rem",
                  fontWeight:700,
                  letterSpacing:"0.18em",
                  color: i === index ? `${s.accent}` : "rgba(200,120,60,0.45)",
                  textTransform:"uppercase",
                  marginTop:2,
                  transition:"color 0.3s",
                }}>
                  {s.tag}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 right-0" style={{
          height:1.5,
          background:"linear-gradient(90deg,transparent,rgba(212,168,67,0.5),rgba(232,104,12,0.35),rgba(212,168,67,0.5),transparent)",
        }}/>
      </section>
    </>
  );
}
