import React, { useEffect, useState, useContext, useMemo } from "react";
import axios from "axios";
import { backendUrl } from "../config";
import ProductCard from "./ProductCard";
import { CartContext } from "../context/CartContext";
import { SearchContext } from "../context/SearchContext";

const categories = [
  { id: 1, title: "All", slug: "all" },
  { id: 2, title: "Fast Food", slug: "fast food" },
  { id: 3, title: "Desi Food", slug: "desi food" },
  { id: 4, title: "Breakfast", slug: "breakfast" },
  { id: 5, title: "Lunch", slug: "lunch" },
  { id: 6, title: "Dinner", slug: "dinner" },
  { id: 7, title: "Coffee", slug: "coffee" },
  { id: 8, title: "Cold Drinks", slug: "cold drinks" },
  { id: 9, title: "Juices", slug: "juices" },
];

const Menu = () => {
  const { addToCart, removeFromCart, getQuantity } = useContext(CartContext);
  const { searchQuery } = useContext(SearchContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/product/list`);
        if (res.data?.success && Array.isArray(res.data.products)) {
          setProducts(res.data.products);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (!p) return false;
      const category = p.category?.toLowerCase?.() || "";
      const name = p.name?.toLowerCase?.() || "";
      const search = searchQuery?.toLowerCase?.() || "";
      const matchesCategory =
        selectedCategory === "all" || category === selectedCategory;
      const matchesSearch =
        !search || name.includes(search) || category.includes(search);
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const visibleProducts = showAll
    ? filteredProducts
    : filteredProducts.slice(0, 8);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading Menu...</div>;
  }

  return (
    <section className="py-12 px-6 bg-gray-50 scroll-mt-24" id="menu">

      {/* CATEGORY BUTTONS */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setSelectedCategory(cat.slug); setShowAll(false); }}
            className={`w-24 h-24 flex items-center justify-center rounded-full font-semibold text-sm transition-all duration-300 shadow-md ${
              selectedCategory === cat.slug
                ? "bg-orange-400 text-white scale-110 shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-orange-400 hover:text-white hover:scale-105 cursor-pointer"
            }`}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {/* PRODUCTS GRID */}
      {filteredProducts.length === 0 ? (
        <div className="text-center text-gray-500 py-20">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {visibleProducts.map((item) => (
            <ProductCard
              key={item._id}
              product={item}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              getQuantity={getQuantity}
            />
          ))}
        </div>
      )}

      {/* VIEW MORE / VIEW LESS BUTTON */}
      {filteredProducts.length > 8 && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-medium transition flex items-center gap-2"
          >
            {showAll ? (
              <>
                View Less
                <span className="text-lg leading-none">↑</span>
              </>
            ) : (
              <>
                View More
                <span className="text-lg leading-none">↓</span>
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
};

export default Menu;