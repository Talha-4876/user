import React from "react";

const RatingBreakdown = ({ reviews }) => {
  const total = reviews.length || 1;

  return (
    <div>
      {[5,4,3,2,1].map(star => {
        const count = reviews.filter(r => r.rating === star).length;
        const percent = (count / total) * 100;

        return (
          <div key={star} className="flex items-center gap-2">
            <span>{star}★</span>
            <div className="w-full bg-gray-200 h-2">
              <div
                className="bg-orange-400 h-2"
                style={{ width: percent + "%" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RatingBreakdown;