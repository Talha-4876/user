// src/components/GetInTouch.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const GetInTouch = () => {
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
  const [values, setValues] = useState({ name: "", email: "", phone: "", message: "" });
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });
    setLoading(true);

    const { name, email, phone, message } = values;

    try {
      const res = await fetch("http://localhost:3200/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({ type: "success", message: data.message });
        setValues({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatus({ type: "error", message: data.message || "Something went wrong" });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Server error. Try again later." });
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: "name",
      type: "text",
      label: "Full Name",
      placeholder: "John Doe",
      required: true,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      name: "email",
      type: "email",
      label: "Email Address",
      placeholder: "you@example.com",
      required: true,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
          <rect x="2" y="4" width="20" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      name: "phone",
      type: "tel",
      label: "Phone Number",
      placeholder: "+1 (555) 000-0000",
      required: true,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.4 2 2 0 0 1 3.59 2.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l.91-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.98 17.4z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{ fontFamily: "'Sora', sans-serif" }}
      className="relative py-28 px-6 overflow-hidden bg-[#0d0d0d] scroll-mt-24"
    >
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;1,600&display=swap');

        .input-field {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          color: #f5f5f5;
          transition: all 0.3s ease;
        }
        .input-field::placeholder { color: rgba(255,255,255,0.2); }
        .input-field:focus {
          outline: none;
          background: rgba(255,255,255,0.06);
          border-color: rgba(251, 146, 60, 0.7);
          box-shadow: 0 0 0 3px rgba(251, 146, 60, 0.1), inset 0 1px 0 rgba(255,255,255,0.04);
        }
        .field-icon { color: rgba(255,255,255,0.3); transition: color 0.3s ease; }
        .field-wrapper:focus-within .field-icon { color: rgb(251, 146, 60); }
        .field-wrapper:focus-within .field-label { color: rgb(251, 146, 60); }
        .field-label {
          color: rgba(255,255,255,0.4);
          font-size: 11px;
          letter-spacing: 0.08em;
          font-weight: 600;
          text-transform: uppercase;
          transition: color 0.3s ease;
        }
        .submit-btn {
          background: linear-gradient(135deg, #f97316, #ea580c);
          position: relative;
          overflow: hidden;
        }
        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #fb923c, #f97316);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .submit-btn:hover::before { opacity: 1; }
        .submit-btn:not(:disabled):active { transform: scale(0.98); }
        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }
        .map-frame {
          border: 1px solid rgba(255,255,255,0.06);
          box-shadow: 0 32px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05);
        }
        .info-card {
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
          backdrop-filter: blur(10px);
        }
        .info-card:hover {
          border-color: rgba(251, 146, 60, 0.3);
          background: rgba(251, 146, 60, 0.04);
        }
        .tag-pill {
          background: rgba(251, 146, 60, 0.12);
          color: rgb(251, 146, 60);
          border: 1px solid rgba(251, 146, 60, 0.2);
        }
      `}</style>

      {/* Background Orbs */}
      <div className="glow-orb w-96 h-96 bg-orange-600 opacity-[0.06] top-0 -left-24" />
      <div className="glow-orb w-80 h-80 bg-orange-400 opacity-[0.04] bottom-0 right-0" />
      <div className="glow-orb w-64 h-64 bg-amber-500 opacity-[0.05] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
        }}
      />

      <div className="relative max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-16 text-center"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 tag-pill px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block" />
            Contact Us
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-white mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.2rem, 5vw, 4rem)", lineHeight: 1.1, fontWeight: 700 }}>
            Let's Start a{" "}
            <span style={{ fontStyle: "italic", color: "transparent", WebkitTextStroke: "1.5px rgb(251,146,60)" }}>
              Conversation
            </span>
          </motion.h2>
          <motion.p variants={itemVariants} className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed">
            Have a question, a reservation, or just want to say hello? We'd love to hear from you.
          </motion.p>
        </motion.div>

        {/* Main Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid lg:grid-cols-5 gap-6 items-start"
        >
          {/* Left Column: Map + Info Cards */}
          <motion.div variants={itemVariants} className="lg:col-span-2 flex flex-col gap-4">
            {/* Map */}
            <div className="map-frame rounded-2xl overflow-hidden h-64">
              <iframe
                title="Bite Boss Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019694122176!2d-122.419415184681!3d37.77492977975986!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808c7a2e5f3f%3A0xf7f5c2a3bbf8a04a!2sSan%20Francisco!5e0!3m2!1sen!2sus!4v1690000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) saturate(0.7)" }}
                loading="lazy"
              />
            </div>

            {/* Info Cards */}
            {[
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="10" r="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                label: "Location",
                value: "123 Flavor Street, San Francisco, CA",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5">
                    <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                label: "Hours",
                value: "Mon–Sun: 10:00 AM – 11:00 PM",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="info-card rounded-xl p-4 flex items-start gap-4 cursor-default"
                style={{ transition: "border-color 0.3s, background 0.3s" }}
              >
                <div className="mt-0.5 text-orange-400 flex-shrink-0">{item.icon}</div>
                <div>
                  <div className="text-gray-600 text-xs font-semibold uppercase tracking-widest mb-1">{item.label}</div>
                  <div className="text-gray-200 text-sm leading-snug">{item.value}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Right Column: Form */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-3 map-frame rounded-2xl p-8 md:p-10"
            style={{ background: "rgba(255,255,255,0.015)", backdropFilter: "blur(20px)" }}
          >
            <div className="mb-8">
              <h3 className="text-white text-2xl font-bold mb-1">Send us a message</h3>
              <p className="text-gray-600 text-sm">We'll get back to you within 24 hours.</p>
            </div>

            {/* Status */}
            <AnimatePresence>
              {status.type && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className={`mb-6 px-4 py-3 rounded-xl text-sm flex items-start gap-3 ${
                    status.type === "success"
                      ? "bg-green-500/10 border border-green-500/20 text-green-400"
                      : "bg-red-500/10 border border-red-500/20 text-red-400"
                  }`}
                >
                  <span className="text-lg leading-none mt-0.5">
                    {status.type === "success" ? "✅" : "❌"}
                  </span>
                  <span>{status.message}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {/* Name + Email row */}
              <div className="grid sm:grid-cols-2 gap-5">
                {fields.slice(0, 2).map((field) => (
                  <div key={field.name} className="field-wrapper flex flex-col gap-1.5">
                    <label className="field-label flex items-center gap-1.5">
                      <span className="field-icon">{field.icon}</span>
                      {field.label}
                    </label>
                    <input
                      name={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      required={field.required}
                      value={values[field.name]}
                      onChange={handleChange}
                      className="input-field w-full rounded-xl px-4 py-3.5 text-sm"
                    />
                  </div>
                ))}
              </div>

              {/* Phone */}
              <div className="field-wrapper flex flex-col gap-1.5">
                <label className="field-label flex items-center gap-1.5">
                  <span className="field-icon">{fields[2].icon}</span>
                  {fields[2].label}
                </label>
                <input
                  name="phone"
                  type="tel"
                  placeholder={fields[2].placeholder}
                  required
                  value={values.phone}
                  onChange={handleChange}
                  className="input-field w-full rounded-xl px-4 py-3.5 text-sm"
                />
              </div>

              {/* Message */}
              <div className="field-wrapper flex flex-col gap-1.5">
                <label className="field-label flex items-center gap-1.5">
                  <span className="field-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  Message
                  <span className="ml-auto text-gray-700 font-normal normal-case tracking-normal" style={{ fontSize: "10px" }}>Optional</span>
                </label>
                <textarea
                  name="message"
                  placeholder="Tell us what's on your mind..."
                  rows={4}
                  value={values.message}
                  onChange={handleChange}
                  className="input-field w-full rounded-xl px-4 py-3.5 text-sm resize-none"
                />
              </div>

              {/* Submit */}
              <div className="flex items-center justify-between gap-4 mt-2">
                <p className="text-gray-700 text-xs leading-snug max-w-[200px]">
                  By submitting, you agree to our privacy policy.
                </p>
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.97 } : {}}
                  className={`submit-btn relative text-white font-semibold text-sm px-8 py-3.5 rounded-xl flex items-center gap-2.5 flex-shrink-0 ${
                    loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {loading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                          <path d="m22 2-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </>
                    )}
                  </span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default GetInTouch;
