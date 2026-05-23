import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { backendUrl } from "../config";

const Product = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({ name: "", phone: "" });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/product/${id}`);
        if (res.data.success) setProduct(res.data.product);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!userDetails.name || !userDetails.phone) {
      alert("Please fill your name and phone number first");
      return;
    }
    addToCart(product, userDetails);
    setShowForm(false);
    alert("Added to cart!");
  };

  if (loading) return <div className="pt-32 text-center">Loading...</div>;
  if (!product) return <div className="pt-32 text-center">Product not found</div>;

  return (
    <div className="min-h-screen pt-32 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
        <img src={product.image} alt={product.name} className="w-full h-96 object-cover rounded-2xl" />
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <span className="inline-block bg-orange-100 text-orange-600 font-bold text-2xl px-4 py-2 rounded-full shadow-md">
            Rs. {product.price}
          </span>

          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 mt-6 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition"
            >
              Add to Cart
            </button>
          ) : (
            <div className="flex flex-col gap-3 mt-4">
              <input
                type="text"
                placeholder="Your Name"
                value={userDetails.name}
                onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={userDetails.phone}
                onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
                className="border p-2 rounded"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;

