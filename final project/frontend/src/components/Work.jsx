import React, { useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { works } from "../assets/assets";

const steps = [
  { id: 1, title: "Explore Menu",  desc: "Browse our hand-crafted menu and discover dishes made with premium, fresh ingredients.", icon: "📋", color: "#c2410c", accent: "#f97316", light: "#fff7ed", border: "#fed7aa", tag: "STEP 01" },
  { id: 2, title: "Choose a Dish", desc: "Pick meals that match your cravings — customise, personalise, and make it yours.",          icon: "🍔", color: "#b45309", accent: "#d97706", light: "#fffbeb", border: "#fde68a", tag: "STEP 02" },
  { id: 3, title: "Place Order",   desc: "One tap to confirm. Lightning-fast delivery straight to your door, every time.",           icon: "🚚", color: "#a16207", accent: "#ca8a04", light: "#fefce8", border: "#fef08a", tag: "STEP 03" },
];

function useMagnetic(s = 0.3) {
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18 });
  const sy = useSpring(y, { stiffness: 220, damping: 18 });
  const move  = (e) => { const r = ref.current.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * s); y.set((e.clientY - r.top - r.height / 2) * s); };
  const leave = () => { x.set(0); y.set(0); };
  return { ref, sx, sy, move, leave };
}

function StepCard({ step, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 60 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      className="relative">

      {/* Connector line */}
      {index < steps.length - 1 && (
        <div className="hidden md:block absolute top-14 left-full z-0 w-full">
          <motion.div className="h-px" style={{ background: `linear-gradient(90deg,${step.accent}60,transparent)`, transformOrigin: "left" }}
            initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: index * 0.18 + 0.4 }} />
          <motion.div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
            style={{ background: steps[index + 1].accent }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }} />
        </div>
      )}

      <motion.div className="relative overflow-hidden rounded-[1.75rem] p-7 cursor-pointer"
        style={{
          background: hovered ? step.light : "rgba(255,252,248,0.95)",
          border: `1.5px solid ${hovered ? step.border : "rgba(234,88,12,0.15)"}`,
          boxShadow: hovered
            ? `0 24px 60px -8px ${step.accent}30, 0 0 0 1px ${step.border}80`
            : "0 8px 32px rgba(234,88,12,0.1), 0 2px 8px rgba(234,88,12,0.06)",
          transition: "all 0.35s ease",
        }}
        whileTap={{ scale: 0.98 }}>

        {/* Top shimmer on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div className="absolute top-0 left-8 right-8 h-[2px] rounded-full"
              style={{ background: `linear-gradient(90deg,transparent,${step.accent},transparent)` }}
              initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.3 }} />
          )}
        </AnimatePresence>

        {/* Tag */}
        <span className="text-[10px] font-black tracking-[0.35em] px-2.5 py-1 rounded-full inline-block mb-5"
          style={{ color: step.color, background: `${step.accent}18`, border: `1px solid ${step.accent}30`, fontFamily: "'Courier New',monospace" }}>
          {step.tag}
        </span>

        {/* Icon */}
        <motion.div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5 relative"
          style={{ background: `linear-gradient(135deg,${step.accent}20,${step.accent}08)`, border: `2px solid ${step.border}` }}
          animate={hovered ? { rotate: [-4, 4, -4], scale: 1.08 } : { rotate: 0, scale: 1 }}
          transition={{ duration: 0.5 }}>
          {step.icon}
          {hovered && (
            <motion.div className="absolute inset-0 rounded-2xl"
              style={{ background: `radial-gradient(circle,${step.accent}20,transparent)` }}
              animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }} transition={{ duration: 2, repeat: Infinity }} />
          )}
        </motion.div>

        {/* Text */}
        <h3 className="text-xl font-black mb-2.5 leading-tight"
          style={{ color: step.color, fontFamily: "'Georgia',serif", letterSpacing: "-0.02em" }}>
          {step.title}
        </h3>
        <div className="h-px w-10 mb-3 rounded-full" style={{ background: `linear-gradient(90deg,${step.accent},transparent)` }} />
        <p className="text-sm leading-relaxed" style={{ color: "#92400e88" }}>{step.desc}</p>

        <motion.div className="mt-5 flex items-center gap-1.5 text-[11px] font-black tracking-[0.25em]"
          style={{ color: step.color, fontFamily: "'Courier New',monospace" }}
          animate={hovered ? { x: 4 } : { x: 0 }} transition={{ duration: 0.25 }}>
          START HERE →
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

const Work = () => {
  const workVideo = works[0].video;
  const sectionRef = useRef(null);
  const headingInView = useInView(sectionRef, { once: true, margin: "-60px" });
  const videoBtnMag = useMagnetic(0.3);
  const [videoPlaying, setVideoPlaying] = useState(true);
  const videoRef = useRef(null);

  const toggleVideo = () => {
    if (videoRef.current) {
      videoPlaying ? videoRef.current.pause() : videoRef.current.play();
      setVideoPlaying(!videoPlaying);
    }
  };

  return (
    <section ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-28 px-5"
      style={{ background: "linear-gradient(160deg,#fff7ed 0%,#fff1e6 50%,#fef3c7 100%)" }}>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lora:wght@400;500;600&display=swap');`}</style>

      {/* Warm orbs */}
      <div className="absolute pointer-events-none" style={{ width: 700, height: 700, top: "-15%", left: "-18%", borderRadius: "50%", background: "radial-gradient(circle,rgba(251,146,60,0.15) 0%,transparent 65%)" }} />
      <div className="absolute pointer-events-none" style={{ width: 500, height: 500, bottom: "-10%", right: "-12%", borderRadius: "50%", background: "radial-gradient(circle,rgba(253,186,116,0.18) 0%,transparent 65%)" }} />

      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle,rgba(234,88,12,0.1) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />

      {/* Header */}
      <motion.div className="text-center mb-20 relative z-10"
        initial={{ opacity: 0, y: 40 }} animate={headingInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}>
        <motion.p className="text-xs font-black tracking-[0.45em] mb-5"
          style={{ color: "#c2410c", fontFamily: "'Courier New',monospace" }}>
          ◆ THE PROCESS ◆
        </motion.p>
        <h2 className="text-5xl md:text-7xl font-black leading-none mb-6"
          style={{ fontFamily: "'Georgia',serif", letterSpacing: "-0.04em", color: "#431407" }}>
          How We{" "}
          <span style={{ background: "linear-gradient(135deg,#c2410c,#f97316,#d97706)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Work?
          </span>
        </h2>
        <motion.div className="h-[3px] mx-auto rounded-full mb-6"
          style={{ background: "linear-gradient(90deg,transparent,#c2410c,#f97316,transparent)" }}
          initial={{ width: 0 }} animate={headingInView ? { width: 200 } : {}}
          transition={{ duration: 0.9, delay: 0.3 }} />
        <p className="max-w-lg mx-auto text-base leading-relaxed"
          style={{ color: "#92400e99", fontFamily: "'Georgia',serif" }}>
          Simple, fast, and enjoyable — from menu exploration to your doorstep in minutes.
        </p>
      </motion.div>

      {/* Step Cards */}
      <div className="relative z-10 w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 relative">
          {steps.map((step, i) => <StepCard key={step.id} step={step} index={i} />)}
        </div>

        {/* Video Showcase */}
        <motion.div className="relative flex flex-col md:flex-row items-center gap-12 rounded-[2.5rem] overflow-hidden p-8 md:p-14"
          style={{
            background: "rgba(255,252,248,0.97)",
            border: "2px solid rgba(234,88,12,0.18)",
            boxShadow: "0 40px 100px -20px rgba(234,88,12,0.15), 0 8px 32px rgba(234,88,12,0.08)",
          }}
          initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.8 }}>

          {/* Corner glow accents */}
          <div className="absolute top-0 left-0 w-64 h-64 rounded-br-full pointer-events-none"
            style={{ background: "radial-gradient(circle at top left,rgba(249,115,22,0.1),transparent)" }} />
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-tl-full pointer-events-none"
            style={{ background: "radial-gradient(circle at bottom right,rgba(253,186,116,0.12),transparent)" }} />

          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1"
            style={{ background: "linear-gradient(90deg,#c2410c,#f97316,#fbbf24,#f97316,#c2410c)" }} />

          {/* Left text */}
          <div className="flex-1 relative z-10">
            <span className="text-[10px] font-black tracking-[0.4em] px-2.5 py-1 rounded-full inline-block mb-6"
              style={{ color: "#c2410c", background: "rgba(194,65,12,0.1)", border: "1px solid rgba(194,65,12,0.25)", fontFamily: "'Courier New',monospace" }}>
              LIVE PREVIEW
            </span>
            <h3 className="text-3xl md:text-4xl font-black leading-tight mb-4"
              style={{ fontFamily: "'Georgia',serif", letterSpacing: "-0.03em", color: "#431407" }}>
              See It In{" "}
              <span style={{ color: "#f97316" }}>Action</span>
            </h3>
            <div className="h-px w-12 mb-4 rounded-full" style={{ background: "linear-gradient(90deg,#f97316,transparent)" }} />
            <p className="text-sm leading-relaxed mb-8" style={{ color: "#92400e88" }}>
              Watch how effortless the ordering experience feels — designed for speed, built for delight.
            </p>

            {/* Stats */}
            <div className="flex gap-8">
              {[["3 min","Avg. Delivery"],["98%","Satisfaction"],["50k+","Orders Daily"]].map(([val, label]) => (
                <div key={label}>
                  <div className="text-2xl font-black" style={{ color: "#c2410c", fontFamily: "'Georgia',serif" }}>{val}</div>
                  <div className="text-[11px] tracking-wider mt-0.5" style={{ color: "rgba(146,64,14,0.5)", fontFamily: "'Courier New',monospace" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Video */}
          <div className="relative flex-shrink-0 flex items-center justify-center">
            {/* Spinning conic ring */}
            <motion.div className="absolute rounded-full" style={{ width: 360, height: 360 }}
              animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
              <div className="w-full h-full rounded-full" style={{
                background: "conic-gradient(from 0deg,#c2410c,#f97316,#fbbf24,#d97706,#c2410c)",
                padding: 3,
              }}>
                <div className="w-full h-full rounded-full" style={{ background: "rgba(255,252,248,0.97)" }} />
              </div>
            </motion.div>

            {/* Pulse rings */}
            {[1, 1.15, 1.3].map((s, i) => (
              <motion.div key={i} className="absolute rounded-full border pointer-events-none"
                style={{ width: 310, height: 310, borderColor: "rgba(249,115,22,0.2)" }}
                animate={{ scale: [s, s * 1.06, s], opacity: [0.5, 0.1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.8 }} />
            ))}

            {/* Video circle */}
            <div className="relative z-10 overflow-hidden rounded-full" style={{
              width: 300, height: 300,
              border: "4px solid rgba(249,115,22,0.4)",
              boxShadow: "0 0 60px rgba(249,115,22,0.2), inset 0 0 30px rgba(234,88,12,0.05)",
            }}>
              <video ref={videoRef} src={workVideo} autoPlay loop muted playsInline
                className="w-full h-full object-cover" />
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.08) 0%,transparent 50%)" }} />
            </div>

            {/* Play/Pause */}
            <motion.button ref={videoBtnMag.ref} style={{ x: videoBtnMag.sx, y: videoBtnMag.sy, bottom: 10, right: 10, position: "absolute" }}
              onMouseMove={videoBtnMag.move} onMouseLeave={videoBtnMag.leave} onClick={toggleVideo}
              className="z-20 w-11 h-11 rounded-full flex items-center justify-center text-sm font-black"
              style={{ background: "linear-gradient(135deg,#c2410c,#f97316)", boxShadow: "0 8px 24px rgba(194,65,12,0.4)", color: "#fff" }}
              whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
              {videoPlaying ? "⏸" : "▶"}
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Bottom tagline */}
      <motion.div className="relative z-10 mt-16 flex items-center gap-4"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
        <div className="h-px w-16 rounded-full" style={{ background: "rgba(194,65,12,0.25)" }} />
        <span className="text-[11px] tracking-[0.35em] font-black"
          style={{ color: "rgba(194,65,12,0.45)", fontFamily: "'Courier New',monospace" }}>
          SIMPLE · FAST · DELICIOUS
        </span>
        <div className="h-px w-16 rounded-full" style={{ background: "rgba(194,65,12,0.25)" }} />
      </motion.div>
    </section>
  );
};

export default Work;
