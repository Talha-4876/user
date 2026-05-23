import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { backendUrl } from "../../config";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");

  /* ================= FETCH ================= */
  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${backendUrl}/api/reviews`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReviews(res.data?.reviews || []);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  /* ================= DELETE ================= */
  const deleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      const res = await axios.delete(
        `${backendUrl}/api/reviews/${id}`
      );

      if (res.data?.success) {
        setReviews((prev) =>
          prev.filter((r) => r._id !== id)
        );
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  /* ================= FILTER ================= */
  const filtered = reviews.filter((r) => {
    return (
      r.name?.toLowerCase().includes(search.toLowerCase()) &&
      (ratingFilter ? r.rating === Number(ratingFilter) : true)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-4">
        ⭐ Admin Reviews
      </h1>

      {/* FILTERS */}
      <div className="flex gap-2 mb-6">

        <input
          className="border p-2 rounded"
          placeholder="Search name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="5">5★</option>
          <option value="4">4★</option>
          <option value="3">3★</option>
          <option value="2">2★</option>
          <option value="1">1★</option>
        </select>

      </div>

      {/* REVIEWS */}
      <div className="grid md:grid-cols-2 gap-4">

        {filtered.map((r) => (
          <div
            key={r._id}
            className="bg-white p-5 rounded-xl shadow"
          >

            <div className="flex justify-between">

              <div>
                <h2 className="font-bold">
                  {r.name || "No Name"}
                </h2>

                <p className="text-xs text-gray-500">
                  {dayjs(r.createdAt).format("DD MMM YYYY")}
                </p>
              </div>

              <button
                onClick={() => deleteReview(r._id)}
                className="text-red-500"
              >
                Delete
              </button>

            </div>

            {/* STARS */}
            <div className="text-yellow-400 mt-2">
              {"★".repeat(r.rating || 0) +
                "☆".repeat(5 - (r.rating || 0))}
            </div>

            <p className="mt-2">
              {r.comment || "No Comment"}
            </p>

            <p className="text-xs text-gray-400 mt-2">
              ❤️ {r.likes || 0}
            </p>

          </div>
        ))}

      </div>

      {/* EMPTY STATE */}
      {filtered.length === 0 && (
        <p className="text-center mt-10 text-gray-500">
          No reviews found 😔
        </p>
      )}

    </div>
  );
};

export default AdminReviews;