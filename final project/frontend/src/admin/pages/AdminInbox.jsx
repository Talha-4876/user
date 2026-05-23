// pages/AdminInbox.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const backendUrl = "http://localhost:3200";

const AdminInbox = () => {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [deleting, setDeleting] = useState(false);

  const fetchMessages = async (showLoader = false) => {
    if (showLoader) setFetching(true);
    try {
      const res = await axios.get(`${backendUrl}/api/contact`);
      const data = Array.isArray(res.data) ? res.data : res.data.contacts || [];
      setMessages(data);
    } catch (err) {
      toast.error("Messages load nahi hue");
    }
    if (showLoader) setFetching(false);
  };

  useEffect(() => {
    fetchMessages(true);
    const interval = setInterval(() => fetchMessages(false), 5000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = messages.filter(m => !m.isRead).length;

  const filtered = messages.filter(c => {
    const matchSearch =
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.message?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "unread" && !c.isRead) ||
      (filter === "read" && c.isRead);
    return matchSearch && matchFilter;
  });

  const openMessage = async (msg) => {
    setSelected(msg);
    setReply("");
    if (!msg.isRead) {
      try {
        await axios.put(`${backendUrl}/api/contact/${msg._id}/read`);
        setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, isRead: true } : m));
        setSelected(prev => ({ ...prev, isRead: true }));
      } catch {
        toast.error("Read mark nahi hua");
      }
    }
  };

  const deleteMsg = async (id) => {
    if (!window.confirm("Yeh message delete karna chahte hain?")) return;
    setDeleting(true);
    try {
      await axios.delete(`${backendUrl}/api/contact/${id}`);
      toast.success("Message delete ho gaya");
      setSelected(null);
      fetchMessages(false);
    } catch {
      toast.error("Delete nahi hua");
    }
    setDeleting(false);
  };

  const sendReply = async () => {
    if (!selected) return toast.error("Pehle message select karein");
    if (!reply.trim()) return toast.error("Reply khali nahi ho sakti");
    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/contact/${selected._id}/reply`, {
        replyMessage: reply,
      });
      if (res.data.success) {
        toast.success("Reply bhej di gayi! ✓");
        const newReply = { message: reply, from: "admin", createdAt: new Date() };
        const updated = { ...selected, replies: [...(selected.replies || []), newReply] };
        setSelected(updated);
        setMessages(prev => prev.map(m => m._id === selected._id ? updated : m));
        setReply("");
      } else {
        toast.error("Reply nahi gayi");
      }
    } catch {
      toast.error("Server error");
    }
    setLoading(false);
  };

  const getInitials = (name) =>
    name ? name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "?";

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const avatarColors = ["#e76f51", "#2a9d8f", "#457b9d", "#8338ec", "#e63946", "#F2A83E", "#2D8A47"];

  return (
    <div style={S.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@700&display=swap');
        .msg-item { transition: background 0.12s; }
        .msg-item:hover { background: #FFF8EE !important; }
        .inbox-scroll { overflow-y: auto; }
        .inbox-scroll::-webkit-scrollbar { width: 4px; }
        .inbox-scroll::-webkit-scrollbar-thumb { background: #EDE0C8; border-radius: 99px; }
        .fbtn:hover { background: #FFF3DC !important; }
        .del-btn:hover { background: #FEE2E2 !important; }
        .send-btn:hover:not(:disabled) { background: #d4922e !important; }
      `}</style>

      <Toaster position="top-right" toastOptions={{ style: { fontFamily: "'DM Sans', sans-serif", fontSize: "13px" } }} />

      {/* ── PAGE HEADER ── */}
      <div style={S.pageHeader}>
        <div>
          <h1 style={S.pageTitle}>Messages Inbox</h1>
          <p style={S.pageSubtitle}>Bite Boss — Admin Panel</p>
        </div>
        <button onClick={() => fetchMessages(true)} style={S.refreshBtn}>↻ Refresh</button>
      </div>

      {/* ── STATS ── */}
      <div style={S.stats}>
        {[
          { label: "Total Messages", value: messages.length, color: "#1C1410" },
          { label: "Unread", value: unreadCount, color: "#F2A83E" },
          { label: "Read", value: messages.length - unreadCount, color: "#6DBF82" },
        ].map(s => (
          <div key={s.label} style={S.statCard}>
            <div style={S.statLabel}>{s.label}</div>
            <div style={{ ...S.statValue, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* ── MAIN PANEL ── */}
      <div style={S.mainPanel}>

        {/* LEFT: Message List */}
        <div style={S.listPanel}>
          {/* Toolbar */}
          <div style={S.toolbar}>
            <input
              type="text"
              placeholder="🔍  Search messages..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={S.searchInput}
            />
            <div style={S.filterRow}>
              {["all", "unread", "read"].map(f => (
                <button
                  key={f}
                  className="fbtn"
                  onClick={() => setFilter(f)}
                  style={{
                    ...S.filterBtn,
                    background: filter === f ? "#F2A83E" : "transparent",
                    color: filter === f ? "#1C1410" : "#A0896A",
                    fontWeight: filter === f ? "600" : "400",
                    borderColor: filter === f ? "#F2A83E" : "#EDE0C8",
                  }}
                >
                  {f === "all" ? "All" : f === "unread" ? `Unread (${unreadCount})` : "Read"}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="inbox-scroll" style={S.msgList}>
            {fetching ? (
              <div style={S.emptyState}>Loading...</div>
            ) : filtered.length === 0 ? (
              <div style={S.emptyState}>Koi message nahi mila</div>
            ) : filtered.map((msg, i) => {
              const color = avatarColors[i % avatarColors.length];
              const isActive = selected?._id === msg._id;
              return (
                <div
                  key={msg._id}
                  className="msg-item"
                  onClick={() => openMessage(msg)}
                  style={{
                    ...S.msgItem,
                    background: isActive ? "#FFF8EE" : msg.isRead ? "#fff" : "#FFFBF4",
                    borderLeft: isActive ? "3px solid #F2A83E" : msg.isRead ? "3px solid transparent" : "3px solid #F2A83E",
                  }}
                >
                  <div style={{ ...S.avatar, background: color, width: "36px", height: "36px", fontSize: "12px" }}>
                    {getInitials(msg.name)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={S.msgTop}>
                      <span style={{ ...S.msgName, fontWeight: msg.isRead ? "500" : "600" }}>{msg.name}</span>
                      <span style={S.msgTime}>{formatTime(msg.createdAt)}</span>
                    </div>
                    <div style={S.msgEmail}>{msg.email}</div>
                    <div style={S.msgPreview}>{msg.message || "(No message)"}</div>
                    {msg.replies?.length > 0 && (
                      <div style={S.repliedBadge}>💬 {msg.replies.length} repl{msg.replies.length > 1 ? "ies" : "y"}</div>
                    )}
                  </div>
                  {!msg.isRead && <div style={S.unreadDot} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Detail Panel */}
        <div style={S.detailPanel}>
          {!selected ? (
            <div style={S.noSelection}>
              <div style={{ fontSize: "40px", marginBottom: "10px", opacity: 0.3 }}>✉</div>
              <div style={{ color: "#A0896A", fontSize: "14px", fontWeight: "500" }}>Koi message select karein</div>
              <div style={{ color: "#C4A97A", fontSize: "12px", marginTop: "4px" }}>Left se message choose karein</div>
            </div>
          ) : (
            <div className="inbox-scroll" style={{ ...S.detailContent, overflowY: "auto", maxHeight: "calc(100vh - 280px)" }}>

              {/* Contact Header */}
              <div style={S.detailHeader}>
                <div style={{ ...S.avatar, background: "#F2A83E", width: "44px", height: "44px", fontSize: "16px", flexShrink: 0 }}>
                  {getInitials(selected.name)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={S.detailName}>{selected.name}</div>
                  <div style={S.detailEmail}>{selected.email}</div>
                  {selected.phone && <div style={S.detailPhone}>📞 {selected.phone}</div>}
                </div>
                <button
                  className="del-btn"
                  onClick={() => deleteMsg(selected._id)}
                  disabled={deleting}
                  style={S.deleteBtn}
                >
                  {deleting ? "..." : "✕ Delete"}
                </button>
              </div>

              {/* Meta */}
              <div style={S.metaRow}>
                <span style={S.metaDate}>📅 {formatDate(selected.createdAt)}</span>
                <span style={{
                  ...S.metaBadge,
                  background: selected.isRead ? "#EAF7EE" : "#FFF8EE",
                  color: selected.isRead ? "#2D8A47" : "#C47A1C",
                }}>
                  {selected.isRead ? "● Read" : "● Unread"}
                </span>
              </div>

              {/* Original Message */}
              <div style={S.origMsg}>
                <div style={S.secLabel}>Original Message</div>
                <div style={S.msgBody}>{selected.message || "(No message provided)"}</div>
              </div>

              {/* Conversation Thread */}
              {selected.replies?.length > 0 && (
                <div style={{ marginBottom: "8px" }}>
                  <div style={S.secLabel}>Conversation Thread</div>
                  <div style={S.thread}>
                    {selected.replies.map((r, i) => (
                      <div key={i} style={{
                        ...S.bubble,
                        alignSelf: r.from === "admin" ? "flex-end" : "flex-start",
                        background: r.from === "admin" ? "#FFF3DC" : "#F4F4F4",
                        borderRadius: r.from === "admin" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                      }}>
                        <div style={S.bubbleFrom}>{r.from === "admin" ? "👨‍💼 Admin" : `👤 ${selected.name}`}</div>
                        <div style={S.bubbleText}>{r.message}</div>
                        <div style={S.bubbleTime}>{formatDate(r.createdAt || new Date())}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reply Box */}
              <div style={S.replyBox}>
                <div style={S.secLabel}>Reply to {selected.email}</div>
                <textarea
                  placeholder="Write your reply here..."
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  rows={4}
                  style={S.replyTextarea}
                  disabled={loading}
                />
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    className="send-btn"
                    onClick={sendReply}
                    disabled={loading || !reply.trim()}
                    style={{
                      ...S.sendBtn,
                      opacity: (loading || !reply.trim()) ? 0.5 : 1,
                      cursor: (loading || !reply.trim()) ? "not-allowed" : "pointer",
                    }}
                  >
                    {loading ? "Sending..." : "Send Reply ↗"}
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const S = {
  page: { minHeight: "100vh", background: "#F8F4EE", fontFamily: "'DM Sans', sans-serif", padding: "32px 24px" },
  pageHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" },
  pageTitle: { fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: "700", color: "#1C1410", margin: 0 },
  pageSubtitle: { fontSize: "13px", color: "#A0896A", marginTop: "4px" },
  refreshBtn: { background: "#1C1410", color: "#F5EDD8", border: "none", padding: "9px 18px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontFamily: "'DM Sans', sans-serif" },

  stats: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "20px" },
  statCard: { background: "#fff", border: "1px solid #EDE0C8", borderRadius: "12px", padding: "18px 22px" },
  statLabel: { fontSize: "11px", color: "#A0896A", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" },
  statValue: { fontSize: "30px", fontWeight: "700", fontFamily: "'Playfair Display', serif" },

  mainPanel: { display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "16px", alignItems: "start" },

  listPanel: { background: "#fff", border: "1px solid #EDE0C8", borderRadius: "12px", overflow: "hidden" },
  toolbar: { padding: "14px", borderBottom: "1px solid #EDE0C8", display: "flex", flexDirection: "column", gap: "8px" },
  searchInput: { border: "1px solid #EDE0C8", borderRadius: "8px", padding: "8px 12px", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none", color: "#1C1410", background: "#FDFAF5", width: "100%", boxSizing: "border-box" },
  filterRow: { display: "flex", gap: "6px" },
  filterBtn: { border: "1px solid #EDE0C8", borderRadius: "20px", padding: "3px 10px", fontSize: "11px", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "all 0.15s" },
  msgList: { maxHeight: "580px" },
  emptyState: { padding: "40px", textAlign: "center", color: "#A0896A", fontSize: "13px" },

  msgItem: { padding: "13px 14px", borderBottom: "1px solid #F0E8D8", cursor: "pointer", display: "flex", gap: "10px", alignItems: "flex-start" },
  avatar: { borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600", color: "#fff", flexShrink: 0 },
  msgTop: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "6px" },
  msgName: { fontSize: "13px", color: "#1C1410", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  msgTime: { fontSize: "10px", color: "#A0896A", flexShrink: 0 },
  msgEmail: { fontSize: "11px", color: "#A0896A", marginTop: "1px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  msgPreview: { fontSize: "12px", color: "#8A7860", marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "180px" },
  repliedBadge: { fontSize: "10px", color: "#A0896A", marginTop: "3px" },
  unreadDot: { width: "7px", height: "7px", background: "#F2A83E", borderRadius: "50%", flexShrink: 0, marginTop: "5px" },

  detailPanel: { background: "#fff", border: "1px solid #EDE0C8", borderRadius: "12px", minHeight: "500px" },
  noSelection: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "500px", textAlign: "center" },
  detailContent: { padding: "22px", display: "flex", flexDirection: "column", gap: "18px" },
  detailHeader: { display: "flex", alignItems: "flex-start", gap: "12px" },
  detailName: { fontSize: "16px", fontWeight: "700", color: "#1C1410" },
  detailEmail: { fontSize: "13px", color: "#A0896A", marginTop: "2px" },
  detailPhone: { fontSize: "12px", color: "#A0896A", marginTop: "2px" },
  deleteBtn: { background: "transparent", border: "1px solid #FECACA", color: "#C0392B", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", marginLeft: "auto", whiteSpace: "nowrap", transition: "background 0.15s" },

  metaRow: { display: "flex", gap: "10px", alignItems: "center" },
  metaDate: { fontSize: "12px", color: "#A0896A" },
  metaBadge: { fontSize: "10px", fontWeight: "500", padding: "2px 8px", borderRadius: "20px" },

  origMsg: { background: "#FDFAF5", border: "1px solid #EDE0C8", borderRadius: "10px", padding: "14px 16px" },
  secLabel: { fontSize: "10px", color: "#A0896A", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px", fontWeight: "600" },
  msgBody: { fontSize: "14px", color: "#3C2F1C", lineHeight: "1.7" },

  thread: { display: "flex", flexDirection: "column", gap: "8px" },
  bubble: { maxWidth: "85%", padding: "9px 12px" },
  bubbleFrom: { fontSize: "10px", color: "#A0896A", marginBottom: "3px", fontWeight: "600" },
  bubbleText: { fontSize: "13px", color: "#3C2F1C", lineHeight: "1.5" },
  bubbleTime: { fontSize: "10px", color: "#A0896A", marginTop: "3px", textAlign: "right" },

  replyBox: { background: "#fff", border: "1px solid #EDE0C8", borderRadius: "12px", overflow: "hidden", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" },
  replyTextarea: { width: "100%", border: "1px solid #EDE0C8", borderRadius: "8px", padding: "10px 12px", fontSize: "13.5px", fontFamily: "'DM Sans', sans-serif", outline: "none", color: "#1C1410", background: "#FDFAF5", resize: "vertical", boxSizing: "border-box", lineHeight: "1.6" },
  sendBtn: { background: "#F2A83E", border: "none", color: "#1C1410", padding: "10px 22px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", fontFamily: "'DM Sans', sans-serif", transition: "background 0.15s" },
};

export default AdminInbox;
