import React, { useState } from "react";

const starsOf = (n) => "★".repeat(n) + "☆".repeat(5 - n);

const ReviewItem = ({ review, onLike, onDelete, onEdit }) => {
  const [editing, setEditing] = useState(false);
  const [editComment, setEditComment] = useState(review.comment);
  const [editRating, setEditRating] = useState(review.rating);
  const [hovered, setHovered] = useState(0);

  const handleSave = () => {
    if (!editComment.trim()) return;
    onEdit({ comment: editComment, rating: editRating });
    setEditing(false);
  };

  const fmtDate = (d) =>
    new Date(d).toLocaleDateString("en-PK", {
      day: "numeric", month: "short", year: "numeric",
    });

  return (
    <div className="bg-[#fff8f2] border border-[#e8d5bc] rounded-2xl p-5">

      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-[#F5C4B3] text-[#712B13] text-sm font-medium flex items-center justify-center flex-shrink-0">
          {review.name?.[0]?.toUpperCase()}
        </div>
        <div className="flex-grow">
          <p className="text-sm font-medium text-[#2C2C2A]">{review.name}</p>
          <p className="text-xs text-[#888780]">{fmtDate(review.createdAt)}</p>
        </div>
        <span className="text-[#BA7517] text-sm">{starsOf(review.rating)}</span>
      </div>

      {/* Edit Mode */}
      {editing ? (
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-xs text-[#888780] uppercase tracking-wide mb-1">Rating</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(v => (
                <span key={v}
                  onMouseEnter={() => setHovered(v)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setEditRating(v)}
                  className={`text-2xl cursor-pointer transition-colors
                    ${v <= (hovered || editRating) ? "text-[#BA7517]" : "text-[#e8d5bc]"}`}>
                  ★
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-[#888780] uppercase tracking-wide mb-1">Comment</p>
            <textarea
              value={editComment}
              onChange={e => setEditComment(e.target.value)}
              className="w-full min-h-[70px] resize-none border border-[#e8d5bc] rounded-lg p-3 text-sm bg-[#fdf6ee] text-[#2C2C2A] focus:outline-none focus:border-[#D85A30]"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave}
              className="bg-[#D85A30] text-white text-xs px-4 py-2 rounded-lg cursor-pointer hover:bg-[#993C1D]">
              Save
            </button>
            <button onClick={() => { setEditing(false); setEditComment(review.comment); setEditRating(review.rating); }}
              className="border border-[#e8d5bc] text-[#888780] text-xs px-4 py-2 rounded-lg cursor-pointer">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-[#5F5E5A] leading-relaxed">{review.comment}</p>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-3 flex-wrap">
        <button onClick={onLike}
          className={`text-xs px-3 py-1.5 rounded-full border cursor-pointer transition-colors
            ${review.liked
              ? "border-[#D85A30] text-[#D85A30] bg-[#FAECE7]"
              : "border-[#e8d5bc] text-[#888780] hover:border-[#D85A30] hover:text-[#D85A30]"}`}>
          ♥ Helpful {review.likes > 0 && `(${review.likes})`}
        </button>
        <button onClick={() => setEditing(true)}
          className="text-xs px-3 py-1.5 rounded-full border border-[#e8d5bc] text-[#888780] cursor-pointer hover:border-[#BA7517] hover:text-[#BA7517]">
          ✎ Edit
        </button>
        <button onClick={onDelete}
          className="text-xs px-3 py-1.5 rounded-full border border-[#e8d5bc] text-[#888780] cursor-pointer hover:border-[#E24B4A] hover:text-[#E24B4A]">
          ✕ Delete
        </button>
      </div>
    </div>
  );
};

export default ReviewItem;