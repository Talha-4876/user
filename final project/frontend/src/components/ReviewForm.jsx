import React, { useState } from "react";

const ReviewForm = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name.trim()) { setError("Please enter your name"); return; }
    if (!comment.trim()) { setError("Please write a comment"); return; }
    if (!rating) { setError("Please select a rating"); return; }
    setError("");
    await onSubmit({ name, comment, rating });
    setName(""); setComment(""); setRating(0);
  };

  return (
    <div className="bg-[#fff8f2] border border-[#e8d5bc] rounded-2xl p-6 flex flex-col gap-4">
      <h3 className="text-base font-medium text-[#2C2C2A]">Write a review</h3>

      {/* Star Rating */}
      <div>
        <p className="text-xs text-[#888780] uppercase tracking-wide mb-2">Your rating</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(v => (
            <span key={v}
              onMouseEnter={() => setHovered(v)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(v)}
              className={`text-2xl cursor-pointer transition-colors
                ${v <= (hovered || rating) ? "text-[#BA7517]" : "text-[#e8d5bc]"}`}>
              ★
            </span>
          ))}
        </div>
      </div>

      {/* Name */}
      <div>
        <p className="text-xs text-[#888780] uppercase tracking-wide mb-1">Name</p>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name"
          className="w-full border border-[#e8d5bc] rounded-lg px-3 py-2 text-sm bg-[#fdf6ee] text-[#2C2C2A] focus:outline-none focus:border-[#D85A30]"
        />
      </div>

      {/* Comment */}
      <div>
        <p className="text-xs text-[#888780] uppercase tracking-wide mb-1">Comment</p>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Share your experience..."
          rows={3}
          className="w-full border border-[#e8d5bc] rounded-lg px-3 py-2 text-sm bg-[#fdf6ee] text-[#2C2C2A] resize-none focus:outline-none focus:border-[#D85A30] leading-relaxed"
        />
      </div>

      {error && <p className="text-xs text-[#E24B4A]">{error}</p>}

      <button onClick={handleSubmit}
        className="bg-[#D85A30] hover:bg-[#993C1D] text-white text-sm font-medium px-6 py-2.5 rounded-lg cursor-pointer self-end transition-colors">
        Post review
      </button>
    </div>
  );
};

export default ReviewForm;