import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaPaperPlane, FaMicrophone, FaComment, FaTimes } from "react-icons/fa";
import { MdRestaurantMenu } from "react-icons/md";

const EMOJIS = ["😋", "🍕", "🍔", "🥤", "🔥", "💯", "👌", "❤️"];

const QUICK_CHIPS = [
  { label: "Full Menu", msg: "menu dikhao" },
  { label: "Pizzas 🍕", msg: "pizza menu" },
  { label: "Burgers 🍔", msg: "burger menu" },
  { label: "Drinks 🥤", msg: "drinks menu" },
  { label: "Best Item 🔥", msg: "best item" },
];

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Assalam o Alaikum! 👋 Main BiteBoss ka official bot hoon.\n\nMenu dekhna ho, price puchna ho, ya order total — sab kuch poochh saktay hain! 🍽️",
    },
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [open, setOpen] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const normalizeText = (text) => {
    const corrections = {
      piza: "pizza", barger: "burger", coke: "coca-cola",
      surprise: "sprite", dew: "mountain dew",
    };
    let t = text.toLowerCase().trim();
    Object.entries(corrections).forEach(([k, v]) => {
      t = t.replace(new RegExp(k, "gi"), v);
    });
    return t;
  };

  const toggleMic = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Browser voice input support nahi karta.");

    if (!listening) {
      const rec = new SR();
      rec.lang = "en-US";
      rec.interimResults = false;
      rec.onstart = () => setListening(true);
      rec.onend = () => setListening(false);
      rec.onresult = (e) => sendMessage(normalizeText(e.results[0][0].transcript));
      recognitionRef.current = rec;
      rec.start();
    } else {
      recognitionRef.current?.stop();
      setListening(false);
    }
  };

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { type: "user", text: trimmed }]);
    setInput("");
    setShowEmoji(false);
    setIsTyping(true);

    try {
      const { data } = await axios.post(`${BACKEND_URL}/api/chat`, {
        message: normalizeText(trimmed),
      });
      setIsTyping(false);
      setMessages((prev) => [...prev, { type: "bot", text: data.reply }]);
    } catch {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "Server error. Dobara try karein. 🙏" },
      ]);
    }
  };

  return (
    <>
      {/* FAB */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: "fixed", bottom: 28, right: 28,
            width: 60, height: 60, borderRadius: "50%", border: "none",
            background: "linear-gradient(135deg, #c9a84c, #e8c96a)",
            boxShadow: "0 8px 32px rgba(201,168,76,0.45)",
            cursor: "pointer", display: "flex", alignItems: "center",
            justifyContent: "center", zIndex: 9999,
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <FaComment size={22} color="#0f0d0a" />
        </button>
      )}

      {/* CHAT WINDOW */}
      {open && (
        <div
          style={{
            position: "fixed", bottom: 28, right: 28,
            width: 380, height: 580,
            background: "#0f0d0a",
            borderRadius: 20,
            border: "1px solid rgba(201,168,76,0.2)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
            display: "flex", flexDirection: "column",
            overflow: "hidden", zIndex: 9999,
            fontFamily: "'DM Sans', sans-serif",
            animation: "slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500&family=DM+Sans:wght@300;400;500&display=swap');
            @keyframes slideUp { from { opacity:0; transform:scale(0.85) translateY(20px); } to { opacity:1; transform:scale(1) translateY(0); } }
            @keyframes pulse { 0%,60%,100% { opacity:0.3; transform:scale(0.9); } 30% { opacity:1; transform:scale(1.1); } }
            @keyframes msgIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
            @keyframes waveBar { 0%,100% { height:4px; } 50% { height:14px; } }
            .msg-anim { animation: msgIn 0.25s ease; }
            .bb-chip:hover { background: rgba(201,168,76,0.25) !important; border-color: #c9a84c !important; cursor:pointer; }
            .bb-input:focus { border-color: rgba(201,168,76,0.5) !important; outline: none; }
            .bb-input::placeholder { color: #8a8070; }
            .bb-iconbtn:hover { filter: brightness(1.1); }
            .bb-iconbtn:active { transform: scale(0.92); }
            .bb-em:hover { background: rgba(201,168,76,0.15); border-radius:6px; }
            ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.2); border-radius:4px; }
          `}</style>

          {/* HEADER */}
          <div style={{ background: "#1a1712", borderBottom: "1px solid rgba(201,168,76,0.2)", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(201,168,76,0.12)", border: "1.5px solid #c9a84c", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", flexShrink: 0 }}>
              <MdRestaurantMenu size={20} color="#c9a84c" />
              <div style={{ position: "absolute", top: -2, right: -2, width: 10, height: 10, background: "#27ae60", borderRadius: "50%", border: "2px solid #1a1712" }} />
            </div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "#f5f0e8", fontWeight: 500 }}>BiteBoss Bot</div>
              <div style={{ fontSize: 11, color: "#8a8070", marginTop: 2, letterSpacing: "0.04em" }}>Online · Powered by your menu DB</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#8a8070", padding: 4, borderRadius: 6, display: "flex", transition: "color 0.2s" }}>
              <FaTimes size={16} />
            </button>
          </div>

          {/* QUICK CHIPS */}
          <div style={{ background: "#1a1712", borderBottom: "1px solid rgba(201,168,76,0.15)", padding: "8px 14px", display: "flex", gap: 6, flexWrap: "wrap" }}>
            {QUICK_CHIPS.map((c) => (
              <button key={c.label} className="bb-chip" onClick={() => sendMessage(c.msg)}
                style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", color: "#c9a84c", fontSize: 11, padding: "4px 10px", borderRadius: 20, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}>
                {c.label}
              </button>
            ))}
          </div>

          {/* MESSAGES */}
          <div style={{ flex: 1, overflowY: "auto", padding: "14px 12px", display: "flex", flexDirection: "column", gap: 10, background: "#0f0d0a" }}>
            {messages.map((m, i) => (
              <div key={i} className="msg-anim" style={{ display: "flex", alignItems: "flex-end", gap: 8, flexDirection: m.type === "user" ? "row-reverse" : "row" }}>
                {m.type === "bot" && (
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <MdRestaurantMenu size={13} color="#c9a84c" />
                  </div>
                )}
                <div style={{
                  maxWidth: "75%", padding: "10px 14px", borderRadius: 16,
                  fontSize: 13.5, lineHeight: 1.55, whiteSpace: "pre-wrap",
                  ...(m.type === "bot"
                    ? { background: "#1a1712", color: "#f5f0e8", border: "1px solid rgba(201,168,76,0.15)", borderBottomLeftRadius: 4 }
                    : { background: "#c9a84c", color: "#0f0d0a", fontWeight: 500, borderBottomRightRadius: 4 }),
                }}>
                  {m.text}
                </div>
              </div>
            ))}

            {/* TYPING INDICATOR */}
            {isTyping && (
              <div className="msg-anim" style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MdRestaurantMenu size={13} color="#c9a84c" />
                </div>
                <div style={{ background: "#1a1712", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 16, borderBottomLeftRadius: 4, padding: "12px 16px", display: "flex", gap: 5, alignItems: "center" }}>
                  {[0, 1, 2].map((d) => (
                    <div key={d} style={{ width: 7, height: 7, borderRadius: "50%", background: "#c9a84c", animation: `pulse 1.2s ${d * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}

            {/* LISTENING INDICATOR */}
            {listening && (
              <div style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "#c0392b", fontSize: 12, fontWeight: 500 }}>
                <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
                  {[0, 0.1, 0.2, 0.3].map((d, i) => (
                    <div key={i} style={{ width: 3, borderRadius: 2, background: "#c0392b", animation: `waveBar 0.8s ${d}s ease-in-out infinite` }} />
                  ))}
                </div>
                Listening...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* FOOTER */}
          <div style={{ background: "#1a1712", borderTop: "1px solid rgba(201,168,76,0.15)", padding: "10px 12px" }}>
            {/* EMOJI TRAY */}
            {showEmoji && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, paddingBottom: 8 }}>
                {EMOJIS.map((em) => (
                  <span key={em} className="bb-em" onClick={() => setInput((p) => p + em)}
                    style={{ fontSize: 20, cursor: "pointer", padding: "4px 5px" }}>{em}</span>
                ))}
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* EMOJI BTN */}
              <button className="bb-iconbtn" onClick={() => setShowEmoji((p) => !p)}
                style={{ width: 36, height: 36, borderRadius: 10, background: "#231f1a", border: "1px solid rgba(201,168,76,0.2)", fontSize: 17, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                😊
              </button>

              {/* INPUT */}
              <input ref={inputRef} className="bb-input" value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="Type your message..."
                style={{ flex: 1, background: "#231f1a", border: "1px solid rgba(201,168,76,0.2)", color: "#f5f0e8", borderRadius: 12, padding: "9px 14px", fontSize: 13.5, fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s" }}
              />

              {/* MIC BTN */}
              <button className="bb-iconbtn" onClick={toggleMic}
                style={{ width: 36, height: 36, borderRadius: 10, background: listening ? "#c0392b" : "#231f1a", border: `1px solid ${listening ? "#c0392b" : "rgba(201,168,76,0.2)"}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                <FaMicrophone size={14} color={listening ? "#fff" : "#8a8070"} />
              </button>

              {/* SEND BTN */}
              <button className="bb-iconbtn" onClick={() => sendMessage(input)}
                style={{ width: 36, height: 36, borderRadius: 10, background: "#c9a84c", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                <FaPaperPlane size={14} color="#0f0d0a" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
