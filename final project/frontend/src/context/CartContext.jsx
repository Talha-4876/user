import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  // ================= LOAD FROM LOCALSTORAGE =================
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cart");

      if (stored) {
        const parsed = JSON.parse(stored);
        setCartItems(Array.isArray(parsed) ? parsed : []);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.warn("Cart parse error:", err);
      setCartItems([]);
    }

    // ================= USER TOKEN =================
    const token = localStorage.getItem("userToken");

    if (token) {
      try {
        const base64Payload = token.split(".")[1];
        if (base64Payload) {
          const payload = JSON.parse(atob(base64Payload));
          setUser(payload);
        }
      } catch (err) {
        console.warn("Invalid token");
        setUser(null);
      }
    }
  }, []);

  // ================= SAVE CART =================
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cartItems || []));
    } catch (err) {
      console.warn("Save cart error:", err);
    }
  }, [cartItems]);

  // ================= ADD =================
  const addToCart = (product) => {
    if (!product || !product._id) return;

    setCartItems((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];

      const existing = safePrev.find((item) => item._id === product._id);

      if (existing) {
        return safePrev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: (item.quantity || 0) + 1 }
            : item
        );
      }

      return [...safePrev, { ...product, quantity: 1 }];
    });
  };

  // ================= REMOVE =================
  const removeFromCart = (id) => {
    if (!id) return;

    setCartItems((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];

      return safePrev
        .map((item) =>
          item._id === id
            ? { ...item, quantity: (item.quantity || 0) - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);
    });
  };

  // ================= CLEAR =================
  const clearCart = () => setCartItems([]);

  // ================= GET QTY =================
  const getQuantity = (id) => {
    if (!id) return 0;

    const safeCart = Array.isArray(cartItems) ? cartItems : [];
    const item = safeCart.find((i) => i._id === id);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: Array.isArray(cartItems) ? cartItems : [],
        setCartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getQuantity,
        user,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;