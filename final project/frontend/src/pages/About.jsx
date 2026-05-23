import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import aboutVideo from "../assets/about.mp4";

/* ── CSS ─────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Outfit:wght@300;400;500;600&display=swap');

  :root {
    --cream:       #faf6ef;
    --cream-mid:   #f2e8d5;
    --cream-deep:  #e8d5b8;
    --orange:      #c8520a;
    --orange-bright:#e8680c;
    --orange-light: #f4894a;
    --orange-pale:  #fdebd8;
    --gold:         #d4a843;
    --gold-soft:    rgba(212,168,67,0.25);
    --dark:         #1a0c04;
    --dark-mid:     #5c3010;
    --dark-soft:    #8c5828;
    --shadow:       rgba(180,60,10,0.14);
  }

  @keyframes floatOrb {
    0%,100% { transform: translate(0,0) scale(1); }
    33%  { transform: translate(18px,-22px) scale(1.05); }
    66%  { transform: translate(-10px,14px) scale(0.97); }
  }
  @keyframes shimmer {
    0%   { background-position: -300% center; }
    100% { background-position: 300% center; }
  }
  @keyframes pulseRing {
    0%,100% { box-shadow: 0 0 0 0 rgba(200,82,10,0), 0 0 0 12px rgba(200,82,10,0.06); }
    50%  { box-shadow: 0 0 0 12px rgba(200,82,10,0.12), 0 0 0 28px rgba(200,82,10,0.03); }
  }
  @keyframes scanline {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(200%); }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(24px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes drawLine {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }
  @keyframes badgePulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(200,82,10,0.08), 0 8px 32px rgba(200,82,10,0.1); }
    50%      { box-shadow: 0 0 0 6px rgba(200,82,10,0.04), 0 12px 48px rgba(200,82,10,0.16); }
  }

  .shimmer-text {
    background: linear-gradient(
      90deg,
      #c8520a 0%, #e8680c 18%,
      #d4a843 36%, #f4894a 50%,
      #d4a843 64%, #e8680c 82%,
      #c8520a 100%
    );
    background-size: 300% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 6s linear infinite;
  }

  .about-section {
    position: relative;
    overflow: hidden;
    background: linear-gradient(150deg, #faf6ef 0%, #f5ece0 35%, #faf2e6 65%, #f8edd8 100%);
    font-family: 'Outfit', sans-serif;
  }

  /* Stat pill */
  .stat-pill {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 28px;
    border-radius: 16px;
    background: rgba(255,255,255,0.7);
    border: 1px solid rgba(200,82,10,0.12);
    backdrop-filter: blur(8px);
    box-shadow: 0 4px 24px rgba(200,82,10,0.06), inset 0 1px 0 rgba(255,255,255,0.8);
    transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
    cursor: default;
    flex: 1;
    min-width: 90px;
  }
  .stat-pill:hover {
    transform: translateY(-5px) scale(1.03);
    border-color: rgba(212,168,67,0.4);
    box-shadow: 0 16px 48px rgba(200,82,10,0.14), inset 0 1px 0 rgba(255,255,255,0.9);
  }
  .stat-value {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 700;
    color: #c8520a;
    line-height: 1;
    margin-bottom: 5px;
  }
  .stat-label {
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #7a4020;
  }

  /* Feature chips */
  .feature-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border-radius: 100px;
    background: rgba(255,255,255,0.6);
    border: 1px solid rgba(200,82,10,0.18);
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.05em;
    color: #6a3210;
    backdrop-filter: blur(6px);
    box-shadow: 0 2px 12px rgba(200,82,10,0.06), inset 0 1px 0 rgba(255,255,255,0.7);
    transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
    cursor: default;
  }
  .feature-chip:hover {
    transform: translateY(-3px) scale(1.05);
    border-color: rgba(212,168,67,0.5);
    background: rgba(255,255,255,0.85);
    box-shadow: 0 8px 28px rgba(200,82,10,0.12), inset 0 1px 0 rgba(255,255,255,0.9);
    color: #c8520a;
  }
  .chip-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: linear-gradient(135deg, #d4a843, #c8520a);
    flex-shrink: 0;
  }

  /* Video frame */
  .video-wrap {
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    background: #120600;
    box-shadow:
      0 0 0 1px rgba(200,82,10,0.15),
      0 40px 100px -16px rgba(200,82,10,0.2),
      0 8px 30px rgba(0,0,0,0.08);
    transition: all 0.5s cubic-bezier(0.22,1,0.36,1);
    aspect-ratio: 16/10;
  }
  .video-wrap:hover {
    transform: translateY(-4px);
    box-shadow:
      0 0 0 1px rgba(212,168,67,0.3),
      0 60px 120px -16px rgba(200,82,10,0.28),
      0 12px 40px rgba(0,0,0,0.1);
  }

  /* Controls */
  .ctrl-btn {
    padding: 6px 8px;
    border: none;
    background: none;
    cursor: pointer;
    border-radius: 8px;
    color: rgba(255,255,255,0.5);
    transition: all 0.2s ease;
  }
  .ctrl-btn:hover {
    background: rgba(200,82,10,0.2);
    color: #e8680c;
  }

  .progress-bar-wrap {
    position: relative;
    height: 3px;
    border-radius: 99px;
    background: rgba(200,82,10,0.18);
    cursor: pointer;
    transition: height 0.2s ease;
  }
  .progress-bar-wrap:hover { height: 5px; }

  /* Story badge */
  .story-badge {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 18px 52px 16px;
    border-radius: 6px;
    background: linear-gradient(160deg, rgba(200,82,10,0.05), rgba(212,168,67,0.04), rgba(200,82,10,0.05));
    border: 1px solid rgba(200,82,10,0.2);
    box-shadow: 0 0 0 5px rgba(200,82,10,0.03), 0 12px 48px rgba(200,82,10,0.07),
                inset 0 1px 0 rgba(255,255,255,0.65);
    animation: badgePulse 5s ease-in-out infinite;
    position: relative;
  }
  .corner { position:absolute; width:10px; height:10px; border-color:rgba(212,168,67,0.7); border-style:solid; }
  .corner-tl { top:-1px; left:-1px; border-width:2px 0 0 2px; }
  .corner-tr { top:-1px; right:-1px; border-width:2px 2px 0 0; }
  .corner-bl { bottom:-1px; left:-1px; border-width:0 0 2px 2px; }
  .corner-br { bottom:-1px; right:-1px; border-width:0 2px 2px 0; }
  .badge-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #a83e06;
    line-height: 1;
  }
  .badge-sub {
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #7a3a10;
  }
  .badge-divider {
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(180,100,20,0.5), transparent);
  }
`;

/* ── Video Icons ─────────────────────────────────────────── */
const PlayI  = () => <svg viewBox="0 0 24 24" fill="currentColor" style={{width:22,height:22}}><path d="M8 5v14l11-7z"/></svg>;
const PauseI = () => <svg viewBox="0 0 24 24" fill="currentColor" style={{width:22,height:22}}><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>;
const RewI   = () => <svg viewBox="0 0 24 24" fill="currentColor" style={{width:18,height:18}}><path d="M11 18V6l-8.5 6 8.5 6zm.5-6 8.5 6V6l-8.5 6z"/></svg>;
const FwdI   = () => <svg viewBox="0 0 24 24" fill="currentColor" style={{width:18,height:18}}><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/></svg>;
const MuteI  = () => <svg viewBox="0 0 24 24" fill="currentColor" style={{width:18,height:18}}><path d="M16.5 12A4.5 4.5 0 0014 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0021 12c0-4.28-3-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0017.73 18l2 2L21 18.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z"/></svg>;
const VolI   = () => <svg viewBox="0 0 24 24" fill="currentColor" style={{width:18,height:18}}><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>;
const FsI    = () => <svg viewBox="0 0 24 24" fill="currentColor" style={{width:18,height:18}}><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>;

/* ── Stagger container variants ─────────────────────────── */
const containerV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const itemV = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22,1,0.36,1] } },
};

/* ── Main Component ──────────────────────────────────────── */
const About = () => {
  const videoRef     = useRef(null);
  const containerRef = useRef(null);
  const ctrlTimeout  = useRef(null);
  const sectionRef   = useRef(null);

  const [isPlaying,    setIsPlaying]    = useState(false);
  const [progress,     setProgress]     = useState(0);
  const [duration,     setDuration]     = useState(0);
  const [volume,       setVolume]       = useState(1);
  const [muted,        setMuted]        = useState(false);
  const [speed,        setSpeed]        = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [skipAnim,     setSkipAnim]     = useState(null);
  const [hoverPos,     setHoverPos]     = useState(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0,1], ["0%", "8%"]);

  const formatTime = (sec) => {
    if (!sec || isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60), s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (v.paused) { v.play(); setIsPlaying(true); }
    else          { v.pause(); setIsPlaying(false); }
  };

  useEffect(() => {
    const v = videoRef.current;
    const onTime  = () => setProgress((v.currentTime / v.duration) * 100);
    const onMeta  = () => setDuration(v.duration);
    const onEnded = () => { setIsPlaying(false); setShowControls(true); };
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("ended", onEnded);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("ended", onEnded);
    };
  }, []);

  const changeProgress = (e) => {
    const p = e.target.value;
    videoRef.current.currentTime = (p / 100) * videoRef.current.duration;
    setProgress(p);
  };
  const changeVolume = (e) => {
    const vol = parseFloat(e.target.value);
    videoRef.current.volume = vol;
    setVolume(vol); setMuted(vol === 0);
  };
  const toggleMute  = () => { videoRef.current.muted = !muted; setMuted(!muted); };
  const changeSpeed = (e) => { const sp = parseFloat(e.target.value); videoRef.current.playbackRate = sp; setSpeed(sp); };
  const skip        = (s) => { videoRef.current.currentTime += s; };
  const handleDbl   = (e) => {
    const r = videoRef.current.getBoundingClientRect();
    const isLeft = e.clientX - r.left < r.width / 2;
    skip(isLeft ? -10 : 10);
    setSkipAnim(isLeft ? "back" : "fwd");
    setTimeout(() => setSkipAnim(null), 650);
  };
  const toggleFs = () => {
    if (!document.fullscreenElement) containerRef.current.requestFullscreen();
    else document.exitFullscreen();
  };
  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(ctrlTimeout.current);
    if (isPlaying) ctrlTimeout.current = setTimeout(() => setShowControls(false), 3000);
  };

  const features = [
    { icon: "🍽️", label: "Live Ordering" },
    { icon: "📅", label: "Table Reservations" },
    { icon: "📋", label: "Smart Menu" },
    { icon: "🛵", label: "Real-time Tracking" },
  ];

  const stats = [
    { value: "50K+", label: "Happy Diners" },
    { value: "300+", label: "Restaurants" },
    { value: "99%",  label: "Uptime" },
  ];

  return (
    <>
      <style>{STYLES}</style>

      <section ref={sectionRef} id="about" className="about-section" style={{ padding: "6rem 1.5rem 7rem" }}>

        {/* ── Ambient background orbs ── */}
        {[
          { s:700, t:-200, l:-180, op:0.45, dur:"24s" },
          { s:500, b:-130, r:-160, op:0.35, dur:"30s", rev:true },
          { s:320, t:"38%", r:"18%", op:0.22, dur:"19s" },
          { s:180, t:"12%", l:"48%", op:0.18, dur:"15s", rev:true },
        ].map((o,i) => (
          <div key={i} className="absolute pointer-events-none rounded-full" style={{
            width:o.s, height:o.s,
            top:o.t, left:o.l, bottom:o.b, right:o.r,
            opacity:o.op,
            background:"radial-gradient(circle at 35% 35%, rgba(212,168,67,0.28) 0%, rgba(200,82,10,0.16) 40%, transparent 70%)",
            filter:"blur(52px)",
            animation:`floatOrb ${o.dur} ease-in-out infinite ${o.rev?"reverse":""}`,
          }}/>
        ))}

        {/* Dot texture */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage:"radial-gradient(circle, rgba(200,82,10,0.045) 1px, transparent 1px)",
          backgroundSize:"30px 30px", opacity:0.85,
        }}/>

        {/* Top edge line */}
        <div className="absolute top-0 left-0 right-0" style={{
          height:2,
          background:"linear-gradient(90deg, transparent, rgba(200,82,10,0.35) 20%, rgba(212,168,67,0.75) 50%, rgba(200,82,10,0.35) 80%, transparent)",
        }}/>

        {/* ── Our Story Badge ── */}
        <motion.div
          className="flex justify-center mb-14"
          initial={{ opacity:0, y:-20, scale:0.9 }}
          animate={{ opacity:1, y:0, scale:1 }}
          transition={{ duration:0.9, ease:[0.22,1,0.36,1] }}>
          <div className="story-badge">
            <div className="corner corner-tl"/><div className="corner corner-tr"/>
            <div className="corner corner-bl"/><div className="corner corner-br"/>

            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ height:1, width:28, background:"linear-gradient(90deg,transparent,rgba(160,80,10,0.65))" }}/>
              <span style={{ fontSize:"0.55rem", color:"#b8762a", letterSpacing:"0.18em" }}>✦ ✦ ✦</span>
              <div style={{ height:1, width:28, background:"linear-gradient(270deg,transparent,rgba(160,80,10,0.65))" }}/>
            </div>

            <div className="badge-divider"/>
            <div className="badge-title">Our Story</div>
            <div className="badge-divider"/>
            <div className="badge-sub">Est. 2019 · Bite Boss</div>

            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ fontSize:"0.5rem", color:"#9a5820", letterSpacing:"0.12em" }}>◆ ◆ ◆ ◆ ◆</span>
            </div>
          </div>
        </motion.div>

        {/* ── Main Grid ── */}
        <div className="max-w-7xl mx-auto" style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fit, minmax(340px, 1fr))",
          gap:"5rem",
          alignItems:"center",
        }}>

          {/* ══ VIDEO COLUMN ══ */}
          <motion.div
            initial={{ opacity:0, x:-40 }} animate={{ opacity:1, x:0 }}
            transition={{ duration:0.9, ease:[0.22,1,0.36,1] }}>

            {/* Glow behind */}
            <div style={{
              position:"relative",
              filter:"drop-shadow(0 0 40px rgba(200,82,10,0.12))",
            }}>
              {/* Gold corner SVG accents */}
              {[
                { pos:{top:-10,left:-10}, d:"M0 30 L0 0 L30 0", cc:"40" },
                { pos:{bottom:-10,right:-10}, d:"M40 10 L40 40 L10 40", cc:"40" },
                { pos:{top:-10,right:-10}, d:"M10 0 L40 0 L40 30", cc:"40", dim:true },
                { pos:{bottom:-10,left:-10}, d:"M30 40 L0 40 L0 10", cc:"40", dim:true },
              ].map((c,i) => (
                <div key={i} className="absolute pointer-events-none" style={{...c.pos, zIndex:2}}>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <path d={c.d}
                      stroke={c.dim ? "rgba(200,82,10,0.4)" : "rgba(212,168,67,0.7)"}
                      strokeWidth={c.dim ? "1" : "1.5"} fill="none"/>
                    {!c.dim && <circle cx={c.d.startsWith("M0") ? 0 : 40} cy={c.d.startsWith("M0 30") ? 0 : 40} r="3" fill="rgba(212,168,67,0.6)"/>}
                  </svg>
                </div>
              ))}

              {/* Video player */}
              <div ref={containerRef} className="video-wrap"
                onMouseMove={handleMouseMove}
                onMouseLeave={() => { setHoverPos(null); }}>

                <video ref={videoRef} src={aboutVideo}
                  className="w-full h-full object-cover"
                  style={{ cursor:"pointer", opacity:0.93 }}
                  onClick={togglePlay} onDoubleClick={handleDbl}/>

                {/* Scanline texture */}
                <div className="absolute inset-0 pointer-events-none" style={{
                  background:"linear-gradient(to bottom,transparent 50%,rgba(0,0,0,0.012) 50%)",
                  backgroundSize:"100% 4px", opacity:0.35,
                }}/>

                {/* Vignette */}
                <div className="absolute inset-0 pointer-events-none" style={{
                  background:"radial-gradient(ellipse at center, transparent 48%, rgba(18,6,0,0.4) 100%)",
                }}/>

                {/* Play overlay */}
                <AnimatePresence>
                  {!isPlaying && (
                    <motion.div
                      initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0,scale:0.92}}
                      transition={{duration:0.25}}
                      className="absolute inset-0 flex items-center justify-center"
                      style={{background:"rgba(18,6,0,0.38)", backdropFilter:"blur(4px)", cursor:"pointer"}}
                      onClick={togglePlay}>
                      <motion.div
                        whileHover={{ scale:1.1 }} whileTap={{ scale:0.93 }}
                        style={{
                          width:80, height:80, borderRadius:"50%",
                          background:"linear-gradient(145deg, #d4a843 0%, #c8520a 55%, #9a3808 100%)",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          animation:"pulseRing 3s ease-in-out infinite",
                          boxShadow:"0 16px 50px rgba(160,48,8,0.5)",
                        }}>
                        <svg viewBox="0 0 24 24" fill="white" style={{width:30,height:30,marginLeft:4}}>
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Skip animation */}
                <AnimatePresence>
                  {skipAnim && (
                    <motion.div key={skipAnim}
                      initial={{opacity:0,scale:0.5}} animate={{opacity:1,scale:1}}
                      exit={{opacity:0,scale:1.3}} transition={{duration:0.25}}
                      className={`absolute top-1/2 -translate-y-1/2 ${skipAnim==="fwd"?"right-5":"left-5"}`}>
                      <div style={{
                        padding:"10px 18px", borderRadius:12,
                        background:"rgba(200,82,10,0.1)", backdropFilter:"blur(12px)",
                        border:"1px solid rgba(212,168,67,0.25)",
                        display:"flex", flexDirection:"column", alignItems:"center", gap:4,
                      }}>
                        <span style={{fontSize:"1.4rem"}}>{skipAnim==="fwd"?"⏩":"⏪"}</span>
                        <span style={{color:"#d4a843",fontSize:"0.62rem",fontWeight:500,letterSpacing:"0.06em"}}>10 sec</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Video Controls */}
                <AnimatePresence>
                  {showControls && (
                    <motion.div
                      initial={{opacity:0,y:6}} animate={{opacity:1,y:0}}
                      exit={{opacity:0,y:5}} transition={{duration:0.2}}
                      className="absolute bottom-0 left-0 right-0"
                      style={{padding:"40px 14px 12px",
                        background:"linear-gradient(to top, rgba(18,4,0,0.9) 0%, transparent 100%)"}}>

                      {/* Progress */}
                      <div className="relative group mb-3" style={{cursor:"pointer"}}
                        onMouseMove={(e) => {
                          const r = e.currentTarget.getBoundingClientRect();
                          setHoverPos(((e.clientX - r.left) / r.width) * 100);
                        }}
                        onMouseLeave={() => setHoverPos(null)}>
                        <div className="progress-bar-wrap">
                          <div style={{
                            position:"absolute",left:0,top:0,height:"100%",borderRadius:999,
                            width:`${progress}%`,
                            background:"linear-gradient(90deg,#a84008,#e8680c,#d4a843)",
                            boxShadow:"0 0 10px rgba(200,82,10,0.5)",
                          }}/>
                          {/* Hover scrubber dot */}
                          <div className="absolute top-1/2 w-4 h-4 rounded-full opacity-0 group-hover:opacity-100"
                            style={{
                              left:`${progress}%`, transform:"translateX(-50%) translateY(-50%)",
                              background:"linear-gradient(135deg,#e8680c,#d4a843)",
                              transition:"opacity 0.2s",
                              boxShadow:"0 0 0 3px rgba(200,82,10,0.22), 0 0 14px rgba(200,82,10,0.6)",
                            }}/>
                          <input type="range" min="0" max="100" value={progress}
                            onChange={changeProgress}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
                        </div>
                      </div>

                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6}}>
                        {/* Left */}
                        <div style={{display:"flex",alignItems:"center",gap:2}}>
                          <button className="ctrl-btn" onClick={() => skip(-10)}><RewI/></button>
                          <button className="ctrl-btn" onClick={togglePlay}
                            style={{color:"#d4a843"}}>
                            {isPlaying ? <PauseI/> : <PlayI/>}
                          </button>
                          <button className="ctrl-btn" onClick={() => skip(10)}><FwdI/></button>
                          <span style={{
                            marginLeft:8,color:"rgba(255,255,255,0.3)",
                            fontSize:"0.65rem",letterSpacing:"0.04em",fontWeight:300,
                          }}>
                            {formatTime(videoRef.current?.currentTime||0)}
                            <span style={{color:"rgba(212,168,67,0.28)",margin:"0 4px"}}>/</span>
                            {formatTime(duration)}
                          </span>
                        </div>

                        {/* Right */}
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <button className="ctrl-btn" onClick={toggleMute}>
                            {muted ? <MuteI/> : <VolI/>}
                          </button>
                          <div style={{position:"relative",width:56,height:3,borderRadius:999,
                            background:"rgba(200,82,10,0.18)",cursor:"pointer"}}>
                            <div style={{
                              position:"absolute",left:0,top:0,height:"100%",borderRadius:999,
                              width:`${muted?0:volume*100}%`,
                              background:"linear-gradient(90deg,#c8520a,#d4a843)",
                            }}/>
                            <input type="range" min="0" max="1" step="0.05"
                              value={muted?0:volume} onChange={changeVolume}
                              style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0,cursor:"pointer"}}/>
                          </div>

                          <select value={speed} onChange={changeSpeed} style={{
                            fontSize:"0.65rem",fontWeight:600,borderRadius:6,
                            padding:"3px 6px",border:"1px solid rgba(212,168,67,0.2)",
                            background:"rgba(200,82,10,0.1)",color:"#d4a843",
                            outline:"none",cursor:"pointer",letterSpacing:"0.04em",
                          }}>
                            {[0.25,0.5,0.75,1,1.25,1.5,2].map(s=>(
                              <option key={s} value={s} style={{background:"#200c02"}}>{s}×</option>
                            ))}
                          </select>

                          <button className="ctrl-btn" onClick={toggleFs}><FsI/></button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:0.7, duration:0.7 }}
              style={{ display:"flex", gap:12, marginTop:20 }}>
              {stats.map((s,i) => (
                <motion.div key={s.label} className="stat-pill"
                  initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay:0.75 + i*0.1, duration:0.55, ease:[0.22,1,0.36,1] }}>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* ══ TEXT COLUMN ══ */}
          <motion.div
            variants={containerV} initial="hidden" animate="show"
            style={{ display:"flex", flexDirection:"column", justifyContent:"center" }}>

            {/* Eyebrow */}
            <motion.div variants={itemV}
              style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
              <div style={{
                height:1.5, width:48,
                background:"linear-gradient(90deg,#c8520a,rgba(212,168,67,0.35))",
                borderRadius:2,
                transformOrigin:"left",
                animation:"drawLine 1s 0.4s ease both",
              }}/>
              <span style={{
                color:"#b8762a", fontSize:"0.62rem",
                letterSpacing:"0.28em", fontFamily:"'Outfit',sans-serif", fontWeight:500,
              }}>✦ &nbsp; ✦ &nbsp; ✦</span>
            </motion.div>

            {/* Heading */}
            <motion.h2 variants={itemV} style={{
              fontFamily:"'Playfair Display', Georgia, serif",
              fontSize:"clamp(2.8rem,5.5vw,4.8rem)",
              fontWeight:900,
              lineHeight:1,
              letterSpacing:"-0.025em",
              marginBottom:"1.4rem",
            }}>
              <span style={{ color:"#1a0c04", display:"block", marginBottom:"0.1em" }}>About</span>
              <span className="shimmer-text" style={{ display:"block", fontStyle:"italic" }}>Bite Boss</span>
            </motion.h2>

            {/* Decorative underline */}
            <motion.div variants={itemV}
              style={{ display:"flex", alignItems:"center", gap:10, marginBottom:28 }}>
              <div style={{ height:2.5, width:56, borderRadius:2,
                background:"linear-gradient(90deg,#c8520a,#d4a843)" }}/>
              <div style={{ height:1, flex:1, borderRadius:2,
                background:"linear-gradient(90deg,rgba(200,82,10,0.18),transparent)" }}/>
              <div style={{ width:7, height:7, borderRadius:"50%",
                background:"rgba(212,168,67,0.55)", border:"1px solid rgba(212,168,67,0.85)" }}/>
            </motion.div>

            {/* Body text */}
            <motion.p variants={itemV} style={{
              color:"#6b4020",
              fontSize:"1.08rem", lineHeight:1.9,
              fontFamily:"'Playfair Display', serif",
              fontWeight:400, letterSpacing:"0.01em", marginBottom:"1rem",
            }}>
              Bite Boss is a smart restaurant management platform that lets
              diners browse curated menus, place orders, and reserve tables —
              all in a few taps.
            </motion.p>

            <motion.p variants={itemV} style={{
              color:"#5a3010",
              fontSize:"0.98rem", lineHeight:2.05,
              fontFamily:"'Outfit', sans-serif",
              fontWeight:400, letterSpacing:"0.01em", marginBottom:"2rem",
            }}>
              We marry modern interface design with powerful kitchen tools,
              so every dining experience — from discovery to dessert — feels
              effortless and delightful.
            </motion.p>

            {/* Feature chips — pill shape, no stars */}
            <motion.div variants={itemV}
              style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
              {features.map((f,i) => (
                <motion.span key={f.label} className="feature-chip"
                  initial={{ opacity:0, scale:0.8, y:10 }}
                  animate={{ opacity:1, scale:1, y:0 }}
                  transition={{ delay:0.8+i*0.08, duration:0.45, ease:[0.34,1.56,0.64,1] }}>
                  <span style={{ fontSize:"0.95rem" }}>{f.icon}</span>
                  {f.label}
                </motion.span>
              ))}
            </motion.div>

            {/* Timeline strip */}
            <motion.div variants={itemV}
              style={{
                marginTop:36,
                padding:"20px 24px",
                borderRadius:16,
                background:"rgba(255,255,255,0.55)",
                border:"1px solid rgba(200,82,10,0.1)",
                backdropFilter:"blur(8px)",
                boxShadow:"0 4px 24px rgba(200,82,10,0.05), inset 0 1px 0 rgba(255,255,255,0.8)",
              }}>
              <div style={{ display:"flex", gap:0, alignItems:"stretch" }}>
                {[
                  { year:"2019", label:"Founded" },
                  { year:"2021", label:"Expanded" },
                  { year:"2023", label:"300+ Partners" },
                  { year:"Now", label:"50K+ Diners" },
                ].map((t,i,arr) => (
                  <React.Fragment key={t.year}>
                    <div style={{ flex:1, textAlign:"center", padding:"0 8px" }}>
                      <div style={{
                        fontFamily:"'Playfair Display',serif",
                        fontSize:"1rem", fontWeight:700, color:"#c8520a",
                        marginBottom:4,
                      }}>{t.year}</div>
                      <div style={{
                        width:8, height:8, borderRadius:"50%",
                        background:"linear-gradient(135deg,#d4a843,#c8520a)",
                        margin:"0 auto 4px",
                        boxShadow:"0 0 0 3px rgba(200,82,10,0.12)",
                      }}/>
                      <div style={{
                        fontSize:"0.65rem", fontWeight:500, letterSpacing:"0.1em",
                        textTransform:"uppercase", color:"#8c5828",
                      }}>{t.label}</div>
                    </div>
                    {i < arr.length-1 && (
                      <div style={{
                        width:1, background:"linear-gradient(180deg,transparent,rgba(200,82,10,0.25),transparent)",
                        alignSelf:"stretch", flexShrink:0,
                      }}/>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </motion.div>

            {/* Signature footer */}
            <motion.div variants={itemV} style={{ marginTop:32 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                <div style={{ flex:1, height:1, background:"linear-gradient(90deg,rgba(200,82,10,0.12),transparent)" }}/>
                <span style={{ fontSize:"0.55rem", color:"#b8762a", letterSpacing:"0.2em" }}>◆ ◆ ◆</span>
                <div style={{ flex:1, height:1, background:"linear-gradient(270deg,rgba(200,82,10,0.12),transparent)" }}/>
              </div>

              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <div style={{
                  width:46, height:46, borderRadius:12, flexShrink:0,
                  background:"linear-gradient(145deg,rgba(200,82,10,0.08),rgba(212,168,67,0.06))",
                  border:"1px solid rgba(212,168,67,0.25)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow:"inset 0 1px 0 rgba(255,255,255,0.6)",
                }}>
                  <span style={{
                    fontFamily:"'Playfair Display',serif",
                    fontSize:"1.2rem", fontWeight:700, color:"#c8520a",
                  }}>BB</span>
                </div>
                <div>
                  <div style={{
                    fontFamily:"'Playfair Display',serif",
                    fontSize:"0.95rem", fontWeight:700, color:"#5a2e08",
                    letterSpacing:"0.05em",
                  }}>Bite Boss</div>
                  <div style={{
                    fontFamily:"'Outfit',sans-serif",
                    color:"#7a4820", fontSize:"0.65rem",
                    letterSpacing:"0.16em", textTransform:"uppercase",
                    fontWeight:500, marginTop:3,
                  }}>Crafted with passion since 2019</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0" style={{
          height:1.5,
          background:"linear-gradient(90deg,transparent,rgba(212,168,67,0.5),rgba(200,82,10,0.4),rgba(212,168,67,0.5),transparent)",
        }}/>

        {/* Bottom-right watermark */}
        <div className="absolute bottom-7 right-8 pointer-events-none">
          <span style={{
            fontFamily:"'Playfair Display',serif",
            fontSize:"0.6rem", letterSpacing:"0.26em",
            color:"rgba(120,60,15,0.3)", textTransform:"uppercase",
          }}>Bite Boss ◆ 2019</span>
        </div>
      </section>
    </>
  );
};

export default About;
