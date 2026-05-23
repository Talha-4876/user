import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../config";
import { CartContext } from "../context/CartContext";
import ReviewForm from "../components/ReviewForm";
import ReviewItem from "../components/ReviewItem";
import RatingBreakdown from "../components/RatingBreakdown";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, removeFromCart, getQuantity } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [added, setAdded] = useState(false);
  const [showMiniCart, setShowMiniCart] = useState(false);
  const [animatedTotal, setAnimatedTotal] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/product/${id}`);
        setProduct(res.data?.product || null);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/reviews/product/${id}`);
        setReviews(res.data?.reviews || []);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchReviews();
  }, [id]);

  const qty = product ? getQuantity(product._id) : 0;

  const increaseQty = () => {
    if (!product) return;
    addToCart({ ...product, price: product.originalPrice || product.price });
  };

  const decreaseQty = () => {
    if (!product) return;
    removeFromCart(product._id);
  };

  // ✅ FIXED: qty > 0 ho toh sirf flash, dobara add nahi
  const handleAddToCart = () => {
    if (!product) return;

    if (qty === 0) {
      addToCart({ ...product, price: product.originalPrice || product.price });
    }

    setAdded(true);
    setShowMiniCart(true);
    setTimeout(() => {
      setAdded(false);
      setShowMiniCart(false);
    }, 2000);
  };

  const originalPrice = product?.originalPrice || product?.price || 0;
  const discount = product?.discountPercent || product?.offer || 0;
  const price = discount
    ? Math.round(originalPrice - (originalPrice * discount) / 100)
    : originalPrice;

  const subtotal = price * qty;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  useEffect(() => {
    let start = animatedTotal;
    const animate = () => {
      start += (total - start) * 0.2;
      setAnimatedTotal(start);
      if (Math.abs(total - start) > 0.5) requestAnimationFrame(animate);
      else setAnimatedTotal(total);
    };
    animate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  const handleAddReview = async (data) => {
    try {
      const res = await axios.post(`${backendUrl}/api/reviews/${id}`, data);
      if (res.data?.review) setReviews((prev) => [res.data.review, ...prev]);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleLike = async (reviewId) => {
    try {
      const res = await axios.patch(`${backendUrl}/api/reviews/${reviewId}/like`);
      setReviews((prev) =>
        prev.map((r) => (r._id === reviewId ? res.data.review : r))
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(`${backendUrl}/api/reviews/${reviewId}`);
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (err) {
      console.error(err.message);
    }
  };

  if (!product) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#fdf6ee] p-6">
      <div className="max-w-5xl mx-auto">

        {/* PRODUCT */}
        <div className="bg-white border rounded-2xl grid md:grid-cols-2 overflow-hidden mb-6">
          <div className="relative">
            <img
              src={product.image}
              className="w-full h-full object-cover"
              alt={product.name}
            />
            {discount > 0 && (
              <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                {discount}% OFF
              </span>
            )}
          </div>

          <div className="p-6 flex flex-col gap-3">
            <h1 className="text-2xl">{product.name}</h1>
            <p className="text-gray-600">{product.description}</p>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-orange-500 font-extrabold text-xl">
                PKR {price.toLocaleString()}
              </span>
              {discount > 0 && (
                <>
                  <span className="text-gray-400 text-sm line-through">
                    PKR {originalPrice.toLocaleString()}
                  </span>
                  <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                    Save PKR {(originalPrice - price).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* QTY CONTROL */}
            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={decreaseQty}
                className="w-9 h-9 bg-gray-200 rounded-full hover:bg-red-200 text-lg font-bold transition flex items-center justify-center"
              >
                −
              </button>
              <span className="font-semibold text-lg min-w-[24px] text-center">
                {qty}
              </span>
              <button
                onClick={increaseQty}
                className="w-9 h-9 bg-orange-500 text-white rounded-full hover:bg-orange-600 text-lg font-bold transition flex items-center justify-center"
              >
                +
              </button>
            </div>

            {/* ✅ ADD TO CART — hamesha visible, sirf pehli baar add karta hai */}
            <button
              onClick={handleAddToCart}
              className={`mt-3 px-4 py-2 text-white rounded-xl transition ${
                added ? "bg-green-600" : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              {added ? "Added ✔" : "Add to Cart"}
            </button>
          </div>
        </div>

        {/* BILL */}
        <div className="bg-white border rounded-xl p-5 mb-6">
          <h2 className="font-semibold mb-3">Bill Summary</h2>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Price per item</span>
            <span>PKR {price.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Qty</span>
            <span>{qty}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>PKR {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Tax (10%)</span>
            <span>PKR {tax.toFixed(2)}</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-orange-500">PKR {animatedTotal.toFixed(2)}</span>
          </div>
          {qty === 0 && (
            <p className="text-gray-400 text-xs text-center mt-2">
              Add items to see bill calculation
            </p>
          )}
        </div>

        {/* REVIEWS */}
        <h2 className="text-lg mb-2">Reviews ({reviews.length})</h2>
        <RatingBreakdown reviews={reviews} />
        <div className="space-y-3 mt-4">
          {reviews.map((r) => (
            <ReviewItem
              key={r._id}
              review={r}
              onLike={() => handleLike(r._id)}
              onDelete={() => handleDelete(r._id)}
            />
          ))}
        </div>
        <div className="mt-6">
          <ReviewForm onSubmit={handleAddReview} />
        </div>
      </div>

      {/* MINI CART */}
      {showMiniCart && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg">
          🛒 Added to cart ({qty} items)
        </div>
      )}
    </div>
  );
};

export default ProductDetail;