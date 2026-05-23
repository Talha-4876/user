import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../config";

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [allTables, setAllTables] = useState([]);

  // Fetch products once on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/product/list`);
        if (res.data?.success && Array.isArray(res.data.products)) {
          setAllProducts(res.data.products);
        }
      } catch (err) {
        console.error("SearchContext: products fetch failed", err);
      }
    };
    fetchProducts();
  }, []);

  // Fetch tables once on mount
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/tables/status`);
        if (res.data?.success) {
          setAllTables(res.data.tables);
        }
      } catch (err) {
        console.error("SearchContext: tables fetch failed", err);
      }
    };
    fetchTables();
  }, []);

  // Compute search results
  const query = searchQuery.trim().toLowerCase();
  const productResults = query
    ? allProducts.filter(
        (p) =>
          p?.name?.toLowerCase().includes(query) ||
          p?.category?.toLowerCase().includes(query)
      )
    : [];

  const tableResults = query
    ? allTables.filter(
        (t) =>
          String(t.tableNumber).includes(query) ||
          t.status?.toLowerCase().includes(query) ||
          String(t.seats).includes(query)
      )
    : [];

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        productResults,
        tableResults,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
