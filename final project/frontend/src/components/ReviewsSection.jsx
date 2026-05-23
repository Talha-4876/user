import React from "react";
import ReviewItem from "./ReviewItem";

const ReviewsSection = ({ reviews }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>

      {reviews.length === 0 ? (
        <p>No reviews yet</p>
      ) : (
        reviews.map((r) => (
          <ReviewItem key={r._id} review={r} />
        ))
      )}
    </div>
  );
};

export default ReviewsSection;