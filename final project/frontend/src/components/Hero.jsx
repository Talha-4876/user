import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "../assets/assets";

const CATEGORY_ORDER = [
  "fast food", "breakfast", "lunch",
  "dinner", "coffee", "cold-drinks", "juices",
];

function buildSlides(products) {
  const seen = new Set();
  const slides = [];
  for (const cat of CATEGORY_ORDER) {
    const item = products.find((p) => p.category === cat && !seen.has(p.id));
    if (item) { seen.add(item.id); slides.push(item); }
  }
  for (const p of products) {
    if (slides.length >= 8) break;
    if (!seen.has(p.id)) { seen.add(p.id); slides.push(p); }
  }
  return slides;
}

const MARQUEE_ITEMS = [
  "🍔 Burgers", "🍕 Pizza", "🌮 Wraps", "🍟 Fries",
  "☕ Coffee", "🧃 Juices", "🍜 Noodles", "🍱 Karahi",
  "🥤 Cold Drinks", "🍰 Desserts",
];

const FLOAT_CARDS = [
  { emoji: "🍔", name: "Creamy Burger", price: "PKR 650" },
  { emoji: "🍕", name: "Pizza Slice",   price: "PKR 380" },
  { emoji: "☕", name: "Cold Brew",      price: "PKR 420" },
];

const TYPEWRITER_WORDS = [
  "Fast Food Ka Asli Boss",
  "Desi Zaiqay, Modern Andaaz",
  "Har Dish Mein Pyaar",
  "Lahore Ka No.1 Taste",
];

const LIVE_ORDERS = [
  { name: "Ali R.",    item: "Zinger Burger",   time: "2 min ago",  emoji: "🍔" },
  { name: "Sara K.",   item: "Cold Brew Coffee", time: "4 min ago",  emoji: "☕" },
  { name: "Hamza M.",  item: "Chicken Karahi",   time: "7 min ago",  emoji: "🍱" },
  { name: "Zara B.",   item: "Fries + Nuggets",  time: "9 min ago",  emoji: "🍟" },
  { name: "Usman T.",  item: "Mango Juice",      time: "11 min ago", emoji: "🥭" },
];

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const HERO_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,600;0,9..40,700;1,9..40,300&display=swap');

  .bb-root * { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── AMBIENT GLOWS ── */
  .bb-glow-tr {
    position: absolute; top: -15%; right: -10%;
    width: 700px; height: 700px; z-index: 0; pointer-events: none;
    background: radial-gradient(circle, rgba(255,80,0,.22) 0%, transparent 65%);
    animation: bbGlowPulse 5s ease-in-out infinite;
  }
  .bb-glow-bl {
    position: absolute; bottom: -10%; left: -10%;
    width: 500px; height: 500px; z-index: 0; pointer-events: none;
    background: radial-gradient(circle, rgba(255,140,0,.14) 0%, transparent 60%);
    animation: bbGlowPulse 7s ease-in-out infinite reverse;
  }
  .bb-glow-center {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
    width: 600px; height: 400px; z-index: 0; pointer-events: none;
    background: radial-gradient(ellipse, rgba(255,50,0,.07) 0%, transparent 65%);
  }
  @keyframes bbGlowPulse {
    0%,100% { opacity: .7; transform: scale(1); }
    50%      { opacity: 1;  transform: scale(1.08); }
  }

  /* ── GRID BG ── */
  .bb-grid-bg {
    position: absolute; inset: 0; z-index: 0; pointer-events: none; opacity: .04;
    background-image:
      linear-gradient(rgba(255,120,0,.6) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,120,0,.6) 1px, transparent 1px);
    background-size: 60px 60px;
  }

  /* ── HERO WRAPPER ── */
  .bb-hero {
    min-height: 100vh;
    background: #0A0501;
    font-family: 'DM Sans', sans-serif;
    display: grid;
    grid-template-columns: 1fr 1fr;
    position: relative;
    overflow: hidden;
  }

  @media (max-width: 860px) {
    .bb-hero { grid-template-columns: 1fr; padding-bottom: 64px; }
    .bb-right { order: -1; padding: 3rem 1.5rem 1rem; }
    .bb-ring-system { width: 300px !important; height: 300px !important; }
    .bb-fcards { display: none; }
    .bb-left { padding: 2rem 1.5rem 5rem; align-items: center; text-align: center; }
    .bb-trust-row { flex-wrap: wrap; gap: 1rem; }
    .bb-trust-item { border-right: none; padding: 0 1rem; }
    .bb-live-ticker { display: none; }
  }

  /* ── LEFT PANEL ── */
  .bb-left {
    padding: 3rem 2.5rem 5.5rem 3rem;
    display: flex; flex-direction: column;
    align-items: flex-start; gap: 0;
    z-index: 10; position: relative;
    justify-content: center;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Eyebrow */
  .bb-eyebrow {
    display: inline-flex; align-items: center; gap: 10px;
    font-size: 10px; font-weight: 700; letter-spacing: .24em;
    text-transform: uppercase; color: #FFB347;
    margin-bottom: 1.1rem;
  }
  .bb-eyebrow-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #FF5500;
    box-shadow: 0 0 0 0 rgba(255,85,0,.6);
    animation: bbSonar 2s infinite;
  }
  @keyframes bbSonar {
    0%   { box-shadow: 0 0 0 0   rgba(255,85,0,.7); }
    70%  { box-shadow: 0 0 0 10px rgba(255,85,0,0);  }
    100% { box-shadow: 0 0 0 0   rgba(255,85,0,0);  }
  }
  .bb-eyebrow-dash {
    width: 28px; height: 1.5px;
    background: linear-gradient(90deg, #FF5500, #FFB347);
  }

  /* Headline */
  .bb-h-white {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4rem, 7vw, 7rem);
    line-height: .88; letter-spacing: -.01em;
    color: #FFF5E6; display: block;
    text-shadow: 0 0 60px rgba(255,100,0,.15);
  }
  .bb-typewriter-wrap {
    display: flex; align-items: center;
    min-height: 2.8rem; margin-top: .2rem;
  }
  .bb-typewriter {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(1.9rem, 3.2vw, 3.2rem);
    color: #FF5500; letter-spacing: .04em;
    text-shadow: 0 0 30px rgba(255,85,0,.5);
  }
  .bb-cursor {
    display: inline-block; width: 3px; height: 1em;
    background: #FF5500; margin-left: 5px;
    vertical-align: middle; border-radius: 2px;
    animation: bbBlink .7s steps(1) infinite;
    box-shadow: 0 0 8px rgba(255,85,0,.8);
  }
  @keyframes bbBlink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }

  /* Divider */
  .bb-divider {
    width: 100%; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,120,0,.3) 30%, rgba(255,180,60,.4) 50%, rgba(255,120,0,.3) 70%, transparent);
    margin: 1.2rem 0;
    box-shadow: 0 0 10px rgba(255,120,0,.15);
  }

  /* Live Ticker */
  .bb-live-ticker {
    width: 100%; margin-bottom: 1.1rem;
    background: rgba(255,50,0,.06);
    border: 1px solid rgba(255,120,0,.2);
    border-radius: 10px; overflow: hidden;
    box-shadow: 0 4px 30px rgba(255,60,0,.08), inset 0 1px 0 rgba(255,255,255,.04);
  }
  .bb-ticker-header {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 14px;
    border-bottom: 1px solid rgba(255,100,0,.12);
    background: rgba(255,40,0,.05);
  }
  .bb-live-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #FF4000;
    animation: bbSonar 1.5s infinite;
  }
  .bb-ticker-label {
    font-size: 9px; font-weight: 700; letter-spacing: .2em;
    text-transform: uppercase; color: #FF8040;
  }
  .bb-ticker-count { margin-left: auto; font-size: 9px; color: #5A3E2E; letter-spacing: .1em; }
  .bb-ticker-list  { display: flex; flex-direction: column; }
  .bb-ticker-item  {
    display: flex; align-items: center; gap: 10px;
    padding: 7px 14px;
    border-bottom: 1px solid rgba(255,255,255,.04);
    transition: background .2s;
  }
  .bb-ticker-item:last-child { border-bottom: none; }
  .bb-ticker-item:hover { background: rgba(255,80,0,.07); }
  .bb-ticker-emoji { font-size: 15px; flex-shrink: 0; }
  .bb-ticker-text  { font-size: 12px; color: #D4A882; flex: 1; }
  .bb-ticker-text strong { color: #FFF0DC; font-weight: 600; }
  .bb-ticker-time  { font-size: 10px; color: #5A3E2E; flex-shrink: 0; }

  /* Description */
  .bb-desc {
    font-size: .93rem; color: #C8956A;
    line-height: 2; max-width: 370px; font-weight: 400;
    margin-bottom: 1.2rem;
  }

  /* Pills */
  .bb-pills { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 1.3rem; }
  .bb-pill {
    font-size: 10px; font-weight: 700; letter-spacing: .1em;
    text-transform: uppercase; padding: 6px 14px; border-radius: 5px;
    cursor: default; transition: transform .2s, box-shadow .2s;
  }
  .bb-pill:hover { transform: translateY(-2px); }
  .bb-p-red   { background: linear-gradient(135deg,#FF3D00,#FF6500); color: #fff; box-shadow: 0 4px 18px rgba(255,60,0,.4); }
  .bb-p-amber { background: rgba(255,160,0,.12); color: #FFB040; border: 1px solid rgba(255,160,0,.3); }
  .bb-p-amber:hover { box-shadow: 0 4px 16px rgba(255,160,0,.2); }
  .bb-p-ghost { background: rgba(255,255,255,.05); color: #E8C89A; border: 1px solid rgba(255,255,255,.14); }
  .bb-p-ghost:hover { box-shadow: 0 4px 16px rgba(255,255,255,.06); }

  /* CTAs */
  .bb-cta-row { display: flex; gap: 12px; align-items: center; margin-bottom: 1.4rem; }
  .bb-btn-primary {
    padding: 15px 36px; background: linear-gradient(135deg,#FF4500,#FF1C00); color: #fff;
    font-family: 'DM Sans', sans-serif; font-size: .9rem; font-weight: 700;
    border: none; border-radius: 6px; cursor: pointer; letter-spacing: .06em;
    transition: transform .2s, box-shadow .2s;
    position: relative; overflow: hidden;
  }
  .bb-btn-primary::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,.18) 0%, transparent 55%);
    pointer-events: none;
  }
  .bb-btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 40px rgba(255,60,0,.55), 0 0 0 1px rgba(255,120,0,.4);
  }
  .bb-btn-outline {
    padding: 15px 28px; background: transparent; color: #FFB347;
    font-family: 'DM Sans', sans-serif; font-size: .9rem; font-weight: 600;
    border: 1px solid rgba(255,180,60,.35); border-radius: 6px; cursor: pointer;
    letter-spacing: .06em; transition: all .2s;
  }
  .bb-btn-outline:hover {
    border-color: #FFB347; background: rgba(255,180,60,.09);
    box-shadow: 0 0 20px rgba(255,180,60,.15);
  }

  /* Stats */
  .bb-trust-row {
    display: flex; gap: 0; padding-top: 1.3rem;
    border-top: 1px solid rgba(255,255,255,.08);
  }
  .bb-trust-item {
    display: flex; flex-direction: column; align-items: flex-start;
    padding: 0 2rem 0 0;
    border-right: 1px solid rgba(255,255,255,.08);
  }
  .bb-trust-item:first-child { padding-left: 0; }
  .bb-trust-item:last-child  { border-right: none; }
  .bb-trust-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.8rem; color: #FFF5E6; line-height: 1; letter-spacing: .02em;
    text-shadow: 0 0 30px rgba(255,120,0,.2);
  }
  .bb-trust-suf   { color: #FF5500; font-size: 1.7rem; }
  .bb-trust-suf-s { color: #FF5500; font-size: 1.2rem; }
  .bb-trust-lbl   { font-size: 10px; color: #5A3A25; text-transform: uppercase; letter-spacing: .16em; margin-top: 5px; }

  /* ── RIGHT PANEL ── */
  .bb-right {
    z-index: 10; position: relative;
    display: flex; align-items: center; justify-content: center;
    padding: 2rem 3rem 5.5rem;
  }
  .bb-ring-wrap { display: flex; flex-direction: column; align-items: center; }

  /* Ring System */
  .bb-ring-system {
    position: relative; width: 470px; height: 470px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .bb-ring { position: absolute; border-radius: 50%; }

  .bb-r-outer {
    inset: -38px;
    border: 1px dashed rgba(255,130,0,.15);
    animation: bbCW 30s linear infinite;
  }
  .bb-r-conic1 {
    inset: -20px;
    background: conic-gradient(
      #FF4000 0deg,#FF4000 30deg,transparent 30deg,transparent 65deg,
      #FF8C00 65deg,#FF8C00 90deg,transparent 90deg,transparent 150deg,
      #FFAA40 150deg,#FFAA40 168deg,transparent 168deg,transparent 225deg,
      #FF4000 225deg,#FF4000 260deg,transparent 260deg,transparent 315deg,
      #FF8C00 315deg,#FF8C00 342deg,transparent 342deg,transparent 360deg
    );
    animation: bbCW 8s linear infinite;
  }
  .bb-r-conic1::after {
    content: ''; position: absolute; inset: 7px;
    border-radius: 50%; background: #0A0501;
  }
  .bb-r-main {
    inset: 0;
    border: 2px solid rgba(255,100,0,.28);
    box-shadow: inset 0 0 80px rgba(255,60,0,.14), 0 0 80px rgba(255,60,0,.12), 0 0 0 1px rgba(255,180,60,.06);
  }
  .bb-r-inner {
    inset: 14px;
    background: conic-gradient(
      rgba(255,60,0,.55)  0deg,rgba(255,60,0,.55)  16deg,transparent 16deg,transparent 55deg,
      rgba(255,140,0,.5) 55deg,rgba(255,140,0,.5) 64deg,transparent 64deg,transparent 118deg,
      rgba(255,60,0,.5) 118deg,rgba(255,60,0,.5) 132deg,transparent 132deg,transparent 210deg,
      rgba(255,140,0,.55) 210deg,rgba(255,140,0,.55) 234deg,transparent 234deg,transparent 294deg,
      rgba(255,60,0,.5) 294deg,rgba(255,60,0,.5) 313deg,transparent 313deg,transparent 360deg
    );
    animation: bbCCW 5.5s linear infinite;
  }
  .bb-r-inner::after {
    content: ''; position: absolute; inset: 7px;
    border-radius: 50%; background: #0A0501;
  }

  /* Orbit dots */
  .bb-orbit-wrap {
    position: absolute; inset: -38px; border-radius: 50%;
    animation: bbCW 12s linear infinite;
  }
  .bb-orbit-dot {
    position: absolute; width: 8px; height: 8px; border-radius: 50%;
    background: #FF5500;
    box-shadow: 0 0 12px rgba(255,85,0,.9), 0 0 24px rgba(255,85,0,.4);
  }

  /* Image Circle */
  .bb-img-circle {
    position: absolute; inset: 26px; border-radius: 50%;
    overflow: hidden; z-index: 5;
    box-shadow: 0 0 0 1px rgba(255,120,0,.2), 0 0 120px rgba(255,60,0,.25), inset 0 0 50px rgba(0,0,0,.5);
  }
  .bb-img-circle img {
    width: 100%; height: 100%; object-fit: cover;
    border-radius: 50%; display: block;
  }
  .bb-img-circle::after {
    content: ''; position: absolute; inset: 0; border-radius: 50%;
    background: radial-gradient(circle, transparent 48%, rgba(10,5,1,.65) 100%);
    z-index: 6; pointer-events: none;
  }

  /* Float Cards */
  .bb-fcards { pointer-events: none; }
  .bb-fc {
    position: absolute; z-index: 20;
    background: rgba(12,6,1,.92); backdrop-filter: blur(20px);
    border: 1px solid rgba(255,150,0,.22);
    border-radius: 10px; padding: 11px 18px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 600; color: #F5E0CC;
    white-space: nowrap;
    box-shadow: 0 10px 40px rgba(0,0,0,.55), 0 0 0 1px rgba(255,200,100,.06);
  }
  .bb-fc-price { display: block; font-size: 11px; font-weight: 500; color: #FF9040; margin-top: 3px; letter-spacing: .06em; }
  .bb-fc-0 { top: 16px;   left: -72px; }
  .bb-fc-1 { bottom: 40px; left: -64px; }
  .bb-fc-2 { top: 60px;   right: -72px; }

  /* Food Label */
  .bb-food-name {
    margin-top: 1.6rem; text-align: center;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.15rem; letter-spacing: .2em; color: #FF9040;
    min-height: 1.7rem; min-width: 220px;
    text-shadow: 0 0 25px rgba(255,140,64,.45);
  }
  .bb-slide-cat {
    margin-top: .4rem;
    font-size: 9px; font-weight: 700; letter-spacing: .2em;
    text-transform: uppercase; color: #3A2518;
  }

  /* Dots */
  .bb-dots { display: flex; gap: 8px; justify-content: center; margin-top: .9rem; }
  .bb-dot {
    height: 3px; border-radius: 2px;
    border: none; padding: 0; cursor: pointer;
    transition: width .35s, background .35s, box-shadow .35s;
  }

  /* Marquee */
  .bb-marquee {
    position: absolute; bottom: 0; left: 0; right: 0;
    border-top: 1px solid rgba(255,100,0,.2);
    background: rgba(10,5,1,.95);
    padding: 10px 0; overflow: hidden; z-index: 30;
    backdrop-filter: blur(20px);
  }
  .bb-marquee-track { display: flex; width: max-content; will-change: transform; }
  .bb-mi {
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 700; letter-spacing: .2em;
    text-transform: uppercase; color: #7A4828;
    padding: 0 28px; white-space: nowrap; transition: color .3s;
  }
  .bb-mi:hover { color: #FF8C40; }
  .bb-sep { color: rgba(255,100,0,.35); padding: 0 4px; font-size: 13px; line-height: 1; }

  /* Particle Canvas */
  .bb-particles {
    position: absolute; inset: 0;
    pointer-events: none; z-index: 2; opacity: .35;
  }

  @keyframes bbCW  { from { transform: rotate(0deg);    } to { transform: rotate(360deg);   } }
  @keyframes bbCCW { from { transform: rotate(0deg);    } to { transform: rotate(-360deg);  } }
`;

const vLeft  = { hidden: { opacity: 0, x: -28 }, show: { opacity: 1, x: 0 } };
const vRight = { hidden: { opacity: 0, x:  28 }, show: { opacity: 1, x: 0 } };
const vDown  = { hidden: { opacity: 0, y: -18 }, show: { opacity: 1, y: 0 } };
const vUp    = { hidden: { opacity: 0, y:  18 }, show: { opacity: 1, y: 0 } };

// ─────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────
function useTypewriter(words, typingSpeed = 58, deletingSpeed = 30, pauseMs = 1900, delayMs = 1600) {
  const [displayed, setDisplayed] = useState("");
  const [wordIdx,   setWordIdx]   = useState(0);
  const [phase,     setPhase]     = useState("wait");
  const [charIdx,   setCharIdx]   = useState(0);

  useEffect(() => {
    let timer;
    const word = words[wordIdx];
    if (phase === "wait") {
      timer = setTimeout(() => setPhase("typing"), delayMs);
    } else if (phase === "typing") {
      if (charIdx < word.length) {
        timer = setTimeout(() => { setDisplayed(word.slice(0, charIdx + 1)); setCharIdx(c => c + 1); }, typingSpeed);
      } else {
        timer = setTimeout(() => setPhase("pause"), pauseMs);
      }
    } else if (phase === "pause") {
      timer = setTimeout(() => setPhase("deleting"), 300);
    } else if (phase === "deleting") {
      if (charIdx > 0) {
        timer = setTimeout(() => { setDisplayed(d => d.slice(0, -1)); setCharIdx(c => c - 1); }, deletingSpeed);
      } else {
        setWordIdx(w => (w + 1) % words.length);
        setPhase("typing");
      }
    }
    return () => clearTimeout(timer);
  }, [phase, charIdx, wordIdx, words, typingSpeed, deletingSpeed, pauseMs, delayMs]);

  return displayed;
}

function useLiveOrders(orders, intervalMs = 3800) {
  const [visible, setVisible] = useState(orders);
  useEffect(() => {
    const t = setInterval(() => {
      setVisible(prev => {
        const next = [...prev];
        next.push(next.shift());
        return next;
      });
    }, intervalMs);
    return () => clearInterval(t);
  }, [orders, intervalMs]);
  return visible;
}

// ─────────────────────────────────────────────
// PARTICLE CANVAS
// ─────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let pts = [];

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const init = () => {
      pts = Array.from({ length: 55 }, () => ({
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        vx: (Math.random() - .5) * .28,
        vy: (Math.random() - .5) * .28,
        r:  Math.random() * 1.8 + .4,
        a:  Math.random(),
        da: Math.random() * .006 + .002,
        col: `hsl(${Math.random() * 30 + 10},100%,${Math.random() * 30 + 50}%)`,
      }));
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.a += p.da;
        if (p.a > 1 || p.a < 0) p.da *= -1;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.save();
        ctx.globalAlpha = p.a * .6;
        ctx.fillStyle = p.col;
        ctx.shadowBlur = 8; ctx.shadowColor = p.col;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });
      animId = requestAnimationFrame(tick);
    };

    resize(); init(); tick();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="bb-particles" />;
}

// ─────────────────────────────────────────────
// HERO COMPONENT
// ─────────────────────────────────────────────
export default function Hero() {
  const slides     = buildSlides(products);
  const [cur, setCur] = useState(0);
  const trackRef   = useRef(null);
  const rafRef     = useRef(null);
  const lastTsRef  = useRef(null);
  const xRef       = useRef(0);

  const [showLeft, setShowLeft] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShowLeft(true), 1400);
    return () => clearTimeout(t);
  }, []);

  const typedText  = useTypewriter(TYPEWRITER_WORDS);
  const liveOrders = useLiveOrders(LIVE_ORDERS);

  // Auto-advance slides
  useEffect(() => {
    const t = setInterval(() => setCur(c => (c + 1) % slides.length), 3400);
    return () => clearInterval(t);
  }, [slides.length]);

  // Marquee RAF
  useEffect(() => {
    const loop = ts => {
      if (lastTsRef.current != null && trackRef.current) {
        xRef.current -= (ts - lastTsRef.current) * 0.032;
        const third = trackRef.current.scrollWidth / 3;
        if (xRef.current <= -third) xRef.current += third;
        trackRef.current.style.transform = `translateX(${xRef.current}px)`;
      }
      lastTsRef.current = ts;
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleViewMenu = useCallback(() => {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const marqueeContent = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  // Orbit dot positions
  const orbitDots = [0, 120, 240].map(deg => {
    const r   = 273;
    const rad = (deg * Math.PI) / 180;
    return {
      x: Math.cos(rad) * r,
      y: Math.sin(rad) * r,
    };
  });

  return (
    <div className="bb-root">
      <style>{HERO_CSS}</style>

      <section id="hero" className="bb-hero">

        {/* Ambient glows */}
        <div className="bb-glow-tr" />
        <div className="bb-glow-bl" />
        <div className="bb-glow-center" />

        {/* Grid background */}
        <div className="bb-grid-bg" />

        {/* Particles */}
        <ParticleCanvas />

        {/* ── LEFT PANEL ── */}
        <AnimatePresence>
          {showLeft && (
            <div className="bb-left">

              {/* Eyebrow */}
              <motion.div
                className="bb-eyebrow"
                variants={vDown} initial="hidden" animate="show"
                transition={{ duration: 0.55, delay: 0 }}
              >
                <span className="bb-eyebrow-dot" />
                <span className="bb-eyebrow-dash" />
                Now Open · Giddar Kotha, Lahore
              </motion.div>

              {/* Headline */}
              <motion.div
                variants={vLeft} initial="hidden" animate="show"
                transition={{ duration: 0.75, delay: 0.12 }}
              >
                <span className="bb-h-white">Fast Food</span>
                <div className="bb-typewriter-wrap">
                  <span className="bb-typewriter">{typedText}</span>
                  <span className="bb-cursor" />
                </div>
              </motion.div>

              {/* Divider */}
              <motion.div
                className="bb-divider"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              />

              {/* Live Ticker */}
              <motion.div
                className="bb-live-ticker"
                variants={vUp} initial="hidden" animate="show"
                transition={{ duration: 0.6, delay: 0.38 }}
              >
                <div className="bb-ticker-header">
                  <span className="bb-live-dot" />
                  <span className="bb-ticker-label">Live Orders</span>
                  <span className="bb-ticker-count">247 orders today</span>
                </div>
                <div className="bb-ticker-list">
                  <AnimatePresence mode="popLayout">
                    {liveOrders.slice(0, 3).map(order => (
                      <motion.div
                        key={order.name + order.item}
                        className="bb-ticker-item"
                        initial={{ opacity: 0, x: -14 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 14 }}
                        transition={{ duration: 0.35 }}
                      >
                        <span className="bb-ticker-emoji">{order.emoji}</span>
                        <span className="bb-ticker-text">
                          <strong>{order.name}</strong> ordered {order.item}
                        </span>
                        <span className="bb-ticker-time">{order.time}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Description */}
              <motion.p
                className="bb-desc"
                variants={vLeft} initial="hidden" animate="show"
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                Fresh, hot aur pyaar se bana — desi karahi se lekar cold brews tak,
                sab ek jagah milega{" "}
                <strong style={{ color: "#FFB347", fontWeight: 700 }}>Bite Boss</strong> pe.
              </motion.p>

              {/* Pills */}
              <motion.div
                className="bb-pills"
                variants={vUp} initial="hidden" animate="show"
                transition={{ duration: 0.6, delay: 0.62 }}
              >
                <span className="bb-pill bb-p-red">🌶 Spicy</span>
                <span className="bb-pill bb-p-amber">🍔 Burgers</span>
                <span className="bb-pill bb-p-ghost">☕ Coffee</span>
                <span className="bb-pill bb-p-ghost">✨ New Menu</span>
              </motion.div>

              {/* CTAs */}
              <motion.div
                className="bb-cta-row"
                variants={vUp} initial="hidden" animate="show"
                transition={{ duration: 0.6, delay: 0.74 }}
              >
                <motion.button
                  className="bb-btn-primary"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleViewMenu}
                >
                  View Menu →
                </motion.button>
                <motion.button
                  className="bb-btn-outline"
                  whileHover={{ borderColor: "#FFB347" }}
                  whileTap={{ scale: 0.97 }}
                >
                  Reserve Table
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="bb-trust-row"
                variants={vUp} initial="hidden" animate="show"
                transition={{ duration: 0.6, delay: 0.88 }}
              >
                <div className="bb-trust-item">
                  <div className="bb-trust-num">200<span className="bb-trust-suf">+</span></div>
                  <div className="bb-trust-lbl">Menu Items</div>
                </div>
                <div className="bb-trust-item">
                  <div className="bb-trust-num">4.9<span className="bb-trust-suf">★</span></div>
                  <div className="bb-trust-lbl">Rating</div>
                </div>
                <div className="bb-trust-item">
                  <div className="bb-trust-num">30<span className="bb-trust-suf-s">min</span></div>
                  <div className="bb-trust-lbl">Delivery</div>
                </div>
              </motion.div>

            </div>
          )}
        </AnimatePresence>

        {/* ── RIGHT PANEL ── */}
        <motion.div
          className="bb-right"
          variants={vRight} initial="hidden" animate="show"
          transition={{ duration: 0.85, delay: 0.3 }}
        >
          <div className="bb-ring-wrap">
            <div className="bb-ring-system">

              {/* Outer dashed ring */}
              <div className="bb-ring bb-r-outer" />

              {/* Orbit dots */}
              <div className="bb-orbit-wrap">
                {orbitDots.map((dot, i) => (
                  <div
                    key={i}
                    className="bb-orbit-dot"
                    style={{
                      left: "50%",
                      top:  "50%",
                      transform: `translate(calc(-50% + ${dot.x}px), calc(-50% + ${dot.y}px))`,
                    }}
                  />
                ))}
              </div>

              {/* Conic rings */}
              <div className="bb-ring bb-r-conic1" />
              <div className="bb-ring bb-r-main" />
              <div className="bb-ring bb-r-inner" />

              {/* Image */}
              <div className="bb-img-circle">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={cur}
                    src={slides[cur].img}
                    alt={slides[cur].name}
                    initial={{ opacity: 0, scale: 1.1, rotate: -6 }}
                    animate={{ opacity: 1, scale: 1,   rotate: 0  }}
                    exit={{    opacity: 0, scale: .93,  rotate: 5  }}
                    transition={{ duration: 0.65, ease: "easeInOut" }}
                  />
                </AnimatePresence>
              </div>

              {/* Float cards */}
              <div className="bb-fcards">
                {FLOAT_CARDS.map((fc, i) => (
                  <motion.div
                    key={i}
                    className={`bb-fc bb-fc-${i}`}
                    animate={{ y: [0, i % 2 === 0 ? -12 : 10, 0] }}
                    transition={{ duration: 3.6 + i * .55, repeat: Infinity, ease: "easeInOut", delay: i * 1.0 }}
                  >
                    {fc.emoji} {fc.name}
                    <span className="bb-fc-price">{fc.price}</span>
                  </motion.div>
                ))}
              </div>

            </div>

            {/* Slide label */}
            <AnimatePresence mode="wait">
              <motion.div
                key={cur + "_label"}
                style={{ textAlign: "center" }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0  }}
                exit={{    opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <p className="bb-food-name">{slides[cur].name}</p>
                {slides[cur].category && (
                  <p className="bb-slide-cat">{slides[cur].category}</p>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="bb-dots">
              {slides.map((_, i) => (
                <motion.button
                  key={i}
                  className="bb-dot"
                  style={{
                    width:      i === cur ? 24 : 8,
                    background: i === cur ? "#FF5500" : "rgba(255,255,255,.14)",
                    boxShadow:  i === cur ? "0 0 10px rgba(255,85,0,.6)" : "none",
                  }}
                  onClick={() => setCur(i)}
                  whileHover={{ scale: 1.5 }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── MARQUEE ── */}
        <div className="bb-marquee">
          <div className="bb-marquee-track" ref={trackRef}>
            {marqueeContent.map((item, i) => (
              <React.Fragment key={i}>
                <span className="bb-mi">{item}</span>
                <span className="bb-sep">·</span>
              </React.Fragment>
            ))}
          </div>
        </div>

      </section>
    </div>
  );
}
