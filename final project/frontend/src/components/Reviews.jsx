import React, { useState } from "react";
import { reviews as defaultReviews } from "../assets/assets";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

const StarRating = ({ rating }) => {
  return (
    <div className="flex justify-center gap-1 my-3">
      {[1, 2, 3, 4, 5].map((star) => {
        const fill = rating >= star ? 1 : rating >= star - 0.5 ? 0.5 : 0;
        return (
          <svg
            key={star}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            className="drop-shadow-sm"
          >
            <defs>
              <linearGradient id={`grad-${star}-${rating}`}>
                <stop offset={`${fill * 100}%`} stopColor="#f97316" />
                <stop offset={`${fill * 100}%`} stopColor="#d1d5db" />
              </linearGradient>
            </defs>
            <polygon
              points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
              fill={`url(#grad-${star}-${rating})`}
              stroke="#f97316"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        );
      })}
    </div>
  );
};

const AnimatedNumber = ({ value }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => v.toFixed(1));
  useEffect(() => {
    const controls = animate(count, value, { duration: 1.8, ease: "easeOut" });
    return controls.stop;
  }, [value]);
  return <motion.span>{rounded}</motion.span>;
};

const ReviewCard = ({ review, index }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative group"
    >
      {/* Glow effect behind card */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.9 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-300/30 to-amber-200/20 blur-xl -z-10"
      />

      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative bg-gradient-to-b from-[#fffaf4] to-white rounded-3xl p-7 text-center border border-orange-100 shadow-lg shadow-orange-100/50 overflow-hidden"
      >
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-orange-100 to-transparent rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-10 h-10 bg-gradient-to-tr from-amber-100 to-transparent rounded-tr-full" />

        {/* Quote mark */}
        <div className="absolute top-4 left-5 text-5xl text-orange-200 font-serif leading-none select-none">"</div>

        {/* Avatar with ring animation */}
        <div className="relative inline-block mb-4 mt-2">
          <motion.div
            animate={{ rotate: hovered ? 360 : 0 }}
            transition={{ duration: 3, ease: "linear", repeat: hovered ? Infinity : 0 }}
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-400 via-amber-300 to-orange-500 p-[3px] -m-[3px]"
          />
          <img
            src={review.img}
            alt={review.name}
            className="relative w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
          />
          {/* Online indicator */}
          <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm" />
        </div>

        <h3 className="font-bold text-lg text-gray-800 tracking-tight">
          {review.name}
        </h3>

        {review.role && (
          <p className="text-xs text-orange-500 font-medium uppercase tracking-wider mb-1">
            {review.role}
          </p>
        )}

        <StarRating rating={review.rating} />

        <p className="text-gray-600 text-sm leading-relaxed mt-2 relative z-10">
          {review.comment}
        </p>

        {/* Bottom verified badge */}
        <div className="mt-4 inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-600 text-xs font-medium px-3 py-1 rounded-full">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          Verified Customer
        </div>
      </motion.div>
    </motion.div>
  );
};

const Reviews = () => {
  const [reviews] = useState(defaultReviews);
  const avgRating = (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1);

  return (
    <section
      id="reviews"
      className="relative py-20 overflow-hidden scroll-mt-24 cursor-pointer"
      style={{ background: "linear-gradient(160deg, #fff8f0 0%, #fffdf9 40%, #fff7ed 100%)" }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-10 -left-20 w-64 h-64 bg-orange-100 rounded-full opacity-40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-80 h-80 bg-amber-100 rounded-full opacity-30 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-orange-50 rounded-full opacity-50 blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-5 border border-orange-200"
          >
            <span>⭐</span> Customer Reviews
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
          >
            What Our{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                Customers
              </span>
              <motion.span
                className="absolute bottom-0 left-0 right-0 h-3 bg-orange-200 rounded-full -z-0"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                style={{ transformOrigin: "left" }}
              />
            </span>{" "}
            Say 💬
          </motion.h2>

          <motion.p
            className="text-gray-500 max-w-xl mx-auto text-base leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Real stories from real people who love what we do.
          </motion.p>

          {/* Stats bar */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 mt-8 mb-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {[
              { label: "Average Rating", value: avgRating, suffix: "/5", icon: "⭐" },
              { label: "Happy Customers", value: "2,400", suffix: "+", icon: "😊" },
              { label: "5-Star Reviews", value: "98", suffix: "%", icon: "🏆" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center bg-white/70 backdrop-blur-sm border border-orange-100 rounded-2xl px-6 py-4 shadow-sm min-w-[120px]">
                <span className="text-2xl mb-1">{stat.icon}</span>
                <span className="text-2xl font-bold text-gray-800">
                  {stat.label === "Average Rating" ? (
                    <><AnimatedNumber value={parseFloat(avgRating)} />{stat.suffix}</>
                  ) : (
                    <>{stat.value}{stat.suffix}</>
                  )}
                </span>
                <span className="text-xs text-gray-500 font-medium mt-0.5">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <ReviewCard key={review.id} review={review} index={index} />
          ))}
        </div>

        {/* Our Story Button — Large & Prominent */}
        <motion.div
          className="mt-16 flex justify-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(249,115,22,0.35)" }}
            whileTap={{ scale: 0.97 }}
            className="relative group inline-flex items-center gap-4 bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 text-white font-bold text-xl px-12 py-5 rounded-2xl shadow-xl shadow-orange-200 overflow-hidden transition-all duration-300"
          >
            {/* Shimmer effect */}
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
              initial={{ x: "-150%" }}
              whileHover={{ x: "150%" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />

            {/* Book icon */}
            <span className="relative z-10 bg-white/20 rounded-xl p-2.5 group-hover:bg-white/30 transition-colors">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </span>

            <span className="relative z-10 flex flex-col items-start leading-tight">
              <span className="text-white/70 text-sm font-medium tracking-wider uppercase">Discover</span>
              <span className="text-xl font-extrabold tracking-tight">Our Story</span>
            </span>

            {/* Arrow */}
            <motion.span
              className="relative z-10 ml-2"
              animate={{ x: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </motion.span>
          </motion.button>
        </motion.div>

        {/* Decorative bottom line */}
        <motion.div
          className="mt-12 flex justify-center gap-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="h-1.5 rounded-full bg-gradient-to-r from-orange-400 to-amber-300"
              initial={{ width: 0 }}
              whileInView={{ width: i === 2 ? 40 : i === 1 || i === 3 ? 24 : 14 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
            />
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Reviews;
