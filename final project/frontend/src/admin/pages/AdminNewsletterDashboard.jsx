// pages/AdminNewsletterDashboard.jsx
import React, { useEffect, useState } from 'react';
import { backendUrl } from "../../config";

const AdminNewsletterDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);

  // Send Newsletter State
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState('idle'); // idle | success | error
  const [sendMsg, setSendMsg] = useState('');

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/newsletter/subscribers`);
      const json = await res.json();
      if (json.success) setData(json);
    } catch (err) {
      console.error('Fetch error:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id, email) => {
    if (!window.confirm(`Remove ${email}?`)) return;
    setDeleting(id);
    try {
      await fetch(`${backendUrl}/api/newsletter/subscribers/${id}`, { method: 'DELETE' });
      await fetchSubscribers();
    } catch (err) {
      console.error(err);
    }
    setDeleting(null);
  };

  const handleSendNewsletter = async () => {
    if (!subject.trim()) {
      setSendStatus('error');
      setSendMsg('Subject likhna zaroori hai.');
      return;
    }
    if (!message.trim()) {
      setSendStatus('error');
      setSendMsg('Message likhna zaroori hai.');
      return;
    }

    const activeCount = data?.subscribers?.filter(s => s.isActive).length ?? 0;
    if (activeCount === 0) {
      setSendStatus('error');
      setSendMsg('Koi active subscriber nahi hai.');
      return;
    }

    if (!window.confirm(`${activeCount} subscribers ko email bhejna hai?`)) return;

    setSending(true);
    setSendStatus('idle');
    try {
      const res = await fetch(`${backendUrl}/api/newsletter/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message }),
      });
      const json = await res.json();
      if (json.success) {
        setSendStatus('success');
        setSendMsg(`✓ ${json.sent} subscribers ko email bhej di gayi!`);
        setSubject('');
        setMessage('');
      } else {
        setSendStatus('error');
        setSendMsg(json.message || 'Kuch ghalat hua, dobara try karein.');
      }
    } catch (err) {
      setSendStatus('error');
      setSendMsg('Network error. Dobara try karein.');
    }
    setSending(false);
  };

  const filtered = data?.subscribers?.filter(s =>
    s.email.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-PK', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Newsletter Subscribers</h1>
            <p style={styles.subtitle}>Bite Boss — Admin Panel</p>
          </div>
          <button onClick={fetchSubscribers} style={styles.refreshBtn}>
            ↻ Refresh
          </button>
        </div>

        {/* Stat Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Subscribers</div>
            <div style={styles.statValue}>{loading ? '—' : data?.total ?? 0}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>This Month</div>
            <div style={{ ...styles.statValue, color: '#F2A83E' }}>
              {loading ? '—' : data?.thisMonth ?? 0}
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Active</div>
            <div style={{ ...styles.statValue, color: '#6DBF82' }}>
              {loading ? '—' : data?.subscribers?.filter(s => s.isActive).length ?? 0}
            </div>
          </div>
        </div>

        {/* ─── SEND NEWSLETTER SECTION ─── */}
        <div style={styles.sendCard}>
          <div style={styles.sendCardHeader}>
            <div>
              <h2 style={styles.sendTitle}>📨 Send Newsletter</h2>
              <p style={styles.sendSubtitle}>
                Yeh email saare <strong>{data?.subscribers?.filter(s => s.isActive).length ?? 0} active</strong> subscribers ko jayegi.
              </p>
            </div>
          </div>

          <div style={styles.sendForm}>
            {/* Subject */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Subject *</label>
              <input
                type="text"
                placeholder="e.g. 🔥 Weekend Special — 20% Off!"
                value={subject}
                onChange={e => { setSubject(e.target.value); setSendStatus('idle'); }}
                style={styles.inputField}
                disabled={sending}
              />
            </div>

            {/* Message */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Message *</label>
              <textarea
                placeholder="Apna offer ya update yahan likhein..."
                value={message}
                onChange={e => { setMessage(e.target.value); setSendStatus('idle'); }}
                style={styles.textareaField}
                rows={5}
                disabled={sending}
              />
            </div>

            {/* Status Message */}
            {sendStatus === 'success' && (
              <div style={styles.successAlert}>{sendMsg}</div>
            )}
            {sendStatus === 'error' && (
              <div style={styles.errorAlert}>{sendMsg}</div>
            )}

            {/* Send Button */}
            <button
              onClick={handleSendNewsletter}
              disabled={sending}
              style={{
                ...styles.sendBtn,
                opacity: sending ? 0.7 : 1,
                cursor: sending ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={e => { if (!sending) e.currentTarget.style.background = '#d4922e'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#F2A83E'; }}
            >
              {sending ? '⏳ Bhej raha hai...' : '📤 Send to All Subscribers'}
            </button>
          </div>
        </div>

        {/* Search */}
        <div style={styles.searchRow}>
          <input
            type="text"
            placeholder="🔍  Search by email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <span style={styles.resultCount}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Table */}
        <div style={styles.tableWrapper}>
          {loading ? (
            <div style={styles.loadingMsg}>Loading subscribers...</div>
          ) : filtered.length === 0 ? (
            <div style={styles.emptyMsg}>No subscribers found.</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHead}>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Email Address</th>
                  <th style={styles.th}>Subscribed On</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((sub, index) => (
                  <tr key={sub._id} style={{
                    ...styles.tableRow,
                    background: index % 2 === 0 ? '#fff' : '#FDFAF5',
                  }}>
                    <td style={styles.td}>{index + 1}</td>
                    <td style={{ ...styles.td, fontWeight: '500', color: '#2C2416' }}>
                      {sub.email}
                    </td>
                    <td style={styles.td}>{formatDate(sub.subscribedAt)}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        background: sub.isActive ? '#EAF7EE' : '#FEF0F0',
                        color: sub.isActive ? '#2D8A47' : '#C0392B',
                      }}>
                        {sub.isActive ? '● Active' : '● Inactive'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={() => handleDelete(sub._id, sub.email)}
                        disabled={deleting === sub._id}
                        style={styles.deleteBtn}
                        onMouseEnter={e => e.currentTarget.style.background = '#FEE2E2'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        {deleting === sub._id ? '...' : 'Remove'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#F8F4EE', fontFamily: "'DM Sans', sans-serif", padding: '40px 24px' },
  container: { maxWidth: '900px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' },
  title: { fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: '700', color: '#1C1410', margin: 0 },
  subtitle: { fontSize: '13px', color: '#A0896A', marginTop: '4px' },
  refreshBtn: { background: '#1C1410', color: '#F5EDD8', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '13.5px', fontFamily: "'DM Sans', sans-serif" },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' },
  statCard: { background: '#fff', border: '1px solid #EDE0C8', borderRadius: '12px', padding: '20px 24px' },
  statLabel: { fontSize: '12px', color: '#A0896A', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' },
  statValue: { fontSize: '32px', fontWeight: '700', color: '#1C1410', fontFamily: "'Playfair Display', serif" },

  // Send Newsletter Card
  sendCard: { background: '#fff', border: '1px solid #EDE0C8', borderRadius: '12px', padding: '28px', marginBottom: '28px' },
  sendCardHeader: { marginBottom: '20px' },
  sendTitle: { fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: '700', color: '#1C1410', margin: '0 0 4px 0' },
  sendSubtitle: { fontSize: '13px', color: '#A0896A', margin: 0 },
  sendForm: { display: 'flex', flexDirection: 'column', gap: '16px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#5C4A2A' },
  inputField: { border: '1px solid #EDE0C8', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', fontFamily: "'DM Sans', sans-serif", outline: 'none', color: '#1C1410', background: '#FDFAF5' },
  textareaField: { border: '1px solid #EDE0C8', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', fontFamily: "'DM Sans', sans-serif", outline: 'none', color: '#1C1410', background: '#FDFAF5', resize: 'vertical' },
  sendBtn: { background: '#F2A83E', border: 'none', color: '#1C1410', padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', fontFamily: "'DM Sans', sans-serif", transition: 'background 0.2s', alignSelf: 'flex-start' },
  successAlert: { background: '#EAF7EE', border: '1px solid #6DBF82', color: '#2D8A47', padding: '10px 16px', borderRadius: '8px', fontSize: '13.5px' },
  errorAlert: { background: '#FEF0F0', border: '1px solid #FECACA', color: '#C0392B', padding: '10px 16px', borderRadius: '8px', fontSize: '13.5px' },

  searchRow: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' },
  searchInput: { flex: 1, border: '1px solid #EDE0C8', borderRadius: '8px', padding: '10px 16px', fontSize: '14px', fontFamily: "'DM Sans', sans-serif", outline: 'none', background: '#fff', color: '#1C1410' },
  resultCount: { fontSize: '13px', color: '#A0896A', whiteSpace: 'nowrap' },
  tableWrapper: { background: '#fff', border: '1px solid #EDE0C8', borderRadius: '12px', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHead: { background: '#F2A83E' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#1C1410', textTransform: 'uppercase', letterSpacing: '0.8px' },
  tableRow: { borderBottom: '1px solid #F0E8D8', transition: 'background 0.15s' },
  td: { padding: '13px 16px', fontSize: '14px', color: '#5C4A2A' },
  badge: { fontSize: '11.5px', fontWeight: '500', padding: '3px 10px', borderRadius: '20px' },
  deleteBtn: { background: 'transparent', border: '1px solid #FECACA', color: '#C0392B', padding: '5px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12.5px', fontFamily: "'DM Sans', sans-serif", transition: 'background 0.2s' },
  loadingMsg: { padding: '40px', textAlign: 'center', color: '#A0896A', fontSize: '14px' },
  emptyMsg: { padding: '40px', textAlign: 'center', color: '#A0896A', fontSize: '14px' },
};

export default AdminNewsletterDashboard;
