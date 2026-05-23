// components/Footer.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { backendUrl } from '../config';

const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error | duplicate
  const [errorMsg, setErrorMsg] = useState('');

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Tables', path: '/tables' },
    { name: 'Contact Us', path: '/contact-us' },
    { name: 'About Us', path: '/about' },
  ];

  const socialLinks = [
    { label: 'f', href: 'https://facebook.com', title: 'Facebook' },
    { label: '𝕏', href: 'https://twitter.com', title: 'Twitter' },
    { label: '◎', href: 'https://instagram.com', title: 'Instagram' },
    { label: 'in', href: 'https://linkedin.com', title: 'LinkedIn' },
  ];

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch(`${backendUrl}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.status === 409) {
        setStatus('duplicate');
        setErrorMsg('This email is already subscribed!');
      } else if (data.success) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
        setErrorMsg(data.message || 'Something went wrong.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg('Network error. Please try again.');
    }
  };

  return (
    <footer style={styles.footer}>

      {/* Top Grid */}
      <div style={styles.topGrid}>

        {/* Brand / Contact */}
        <div style={styles.brandCol}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>🍔</div>
            Bite Boss
          </div>
          <div style={styles.tagline}>Premium Dining Experience</div>

          <div style={styles.contactList}>
            {[
              { icon: '📍', text: '123 Main Street, Your City' },
              { icon: '✉', text: 'info@biteboss.com' },
              { icon: '📞', text: '+92 300 1234567' },
            ].map(({ icon, text }) => (
              <div key={text} style={styles.contactRow}>
                <div style={styles.contactIcon}>{icon}</div>
                <span>{text}</span>
              </div>
            ))}
          </div>

          <div style={styles.socials}>
            {socialLinks.map(({ label, href, title }) => (
              <a key={title} href={href} target="_blank" rel="noreferrer"
                title={title} style={styles.socialBtn}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#F2A83E';
                  e.currentTarget.style.color = '#1C1410';
                  e.currentTarget.style.borderColor = '#F2A83E';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(242,168,62,0.06)';
                  e.currentTarget.style.color = '#C4A97A';
                  e.currentTarget.style.borderColor = 'rgba(242,168,62,0.25)';
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <div style={styles.sectionTitle}>
            Quick Links <span style={styles.titleLine} />
          </div>
          <ul style={styles.linkList}>
            {quickLinks.map(link => (
              <li key={link.name} style={{ listStyle: 'none' }}>
                <button onClick={() => navigate(link.path)} style={styles.linkBtn}
                  onMouseEnter={e => e.currentTarget.style.color = '#F5EDD8'}
                  onMouseLeave={e => e.currentTarget.style.color = '#C4A97A'}
                >
                  <span style={{ fontSize: '11px', opacity: 0.5 }}>→</span>
                  {link.name}
                </button>
              </li>
            ))}
          </ul>

          <div style={styles.hours}>
            {[
              { days: 'Mon – Fri', time: '11:00 AM – 11:00 PM' },
              { days: 'Sat – Sun', time: '10:00 AM – 12:00 AM' },
            ].map(({ days, time }) => (
              <div key={days} style={styles.hoursRow}>
                <span style={{ color: '#C4A97A' }}>{days}</span>
                <span style={{ color: '#F5EDD8' }}>{time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <div style={styles.sectionTitle}>
            Newsletter <span style={styles.titleLine} />
          </div>
          <p style={styles.newsletterDesc}>
            Subscribe and get exclusive deals, new menu launches &amp; weekend specials.
          </p>

          {status === 'success' ? (
            <div style={styles.successMsg}>
              <span style={{ color: '#6DBF82', fontSize: '16px' }}>✓</span>
              Subscribed! Welcome to the Bite Boss family.
            </div>
          ) : (
            <>
              <div style={{
                ...styles.inputGroup,
                borderColor: (status === 'error' || status === 'duplicate')
                  ? 'rgba(226,75,74,0.6)' : 'rgba(242,168,62,0.3)',
              }}>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setStatus('idle'); }}
                  onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
                  style={styles.emailInput}
                  disabled={status === 'loading'}
                />
                <button onClick={handleSubscribe} style={{
                  ...styles.subscribeBtn,
                  opacity: status === 'loading' ? 0.7 : 1,
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                }}>
                  {status === 'loading' ? '...' : 'Subscribe ↗'}
                </button>
              </div>

              {(status === 'error' || status === 'duplicate') && (
                <p style={{ color: '#E24B4A', fontSize: '12px', marginTop: '6px' }}>
                  {errorMsg}
                </p>
              )}
            </>
          )}

          <div style={styles.badges}>
            {['🔥 Weekly Deals', '🍽 New Arrivals', '🎁 Exclusive Offers'].map(b => (
              <span key={b} style={styles.badge}>{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={styles.bottomBar}>
        <span>© {new Date().getFullYear()} Bite Boss. All rights reserved.</span>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {['Privacy Policy', 'Terms of Service', 'Sitemap'].map((item, i) => (
            <React.Fragment key={item}>
              {i > 0 && <span style={{ opacity: 0.3 }}>·</span>}
              <a href="#" style={styles.bottomLink}>{item}</a>
            </React.Fragment>
          ))}
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: { background: '#1C1410', color: '#F5EDD8', fontFamily: "'DM Sans', sans-serif", width: '100%', boxSizing: 'border-box' },
  topGrid: { display: 'grid', gridTemplateColumns: '1.4fr 1fr 1.4fr', gap: '48px', padding: '52px 48px 40px', borderBottom: '1px solid rgba(245,200,100,0.15)' },
  brandCol: { display: 'flex', flexDirection: 'column', gap: '12px' },
  logo: { fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: '700', color: '#F2A83E', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' },
  logoIcon: { width: '32px', height: '32px', background: '#F2A83E', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' },
  tagline: { fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: '#C4A97A', marginTop: '-4px' },
  contactList: { display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' },
  contactRow: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: '#D6C4A0' },
  contactIcon: { width: '28px', height: '28px', background: 'rgba(242,168,62,0.12)', border: '1px solid rgba(242,168,62,0.2)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '12px' },
  socials: { display: 'flex', gap: '10px', marginTop: '8px' },
  socialBtn: { width: '36px', height: '36px', border: '1px solid rgba(242,168,62,0.25)', borderRadius: '8px', background: 'rgba(242,168,62,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#C4A97A', textDecoration: 'none', fontSize: '13px', transition: 'all 0.2s' },
  sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: '16px', fontWeight: '600', color: '#F2A83E', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' },
  titleLine: { display: 'inline-block', width: '24px', height: '2px', background: 'rgba(242,168,62,0.4)', borderRadius: '2px' },
  linkList: { padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '2px' },
  linkBtn: { background: 'none', border: 'none', color: '#C4A97A', fontSize: '14px', fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', padding: '6px 0', display: 'flex', alignItems: 'center', gap: '8px', transition: 'color 0.2s' },
  hours: { display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid rgba(245,200,100,0.1)' },
  hoursRow: { display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' },
  newsletterDesc: { fontSize: '13.5px', color: '#C4A97A', lineHeight: '1.6', marginBottom: '16px', marginTop: 0 },
  inputGroup: { display: 'flex', border: '1px solid rgba(242,168,62,0.3)', borderRadius: '10px', overflow: 'hidden', background: 'rgba(255,255,255,0.04)', transition: 'border-color 0.2s' },
  emailInput: { flex: 1, background: 'none', border: 'none', outline: 'none', padding: '11px 14px', color: '#F5EDD8', fontSize: '13.5px', fontFamily: "'DM Sans', sans-serif" },
  subscribeBtn: { background: '#F2A83E', border: 'none', padding: '10px 18px', color: '#1C1410', fontSize: '13px', fontWeight: '500', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap', transition: 'opacity 0.2s' },
  successMsg: { display: 'flex', alignItems: 'center', gap: '8px', color: '#6DBF82', fontSize: '13.5px', padding: '10px 0' },
  badges: { display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap' },
  badge: { background: 'rgba(242,168,62,0.15)', color: '#F2A83E', fontSize: '10px', padding: '3px 9px', borderRadius: '20px', fontWeight: '500', letterSpacing: '0.5px' },
  bottomBar: { padding: '16px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px', color: '#8A7860' },
  bottomLink: { color: '#8A7860', textDecoration: 'none' },
};

export default Footer;
