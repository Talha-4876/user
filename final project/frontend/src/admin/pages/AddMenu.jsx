import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import upload_image from "../assets/upload1.jpeg";
import { backendUrl } from "../../config";

const AddMenu = () => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Fast Food");
  const [loading, setLoading] = useState(false);

  const categories = ["Fast Food","Desi Food","Nashta","Lunch","Dinner","Cold Drinks","Coffee"];
  const token = localStorage.getItem("adminToken");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return toast.error("You must be logged in as admin!");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", parseFloat(price));
      formData.append("category", category);
      if (image) formData.append("image", image);

      const res = await axios.post(`${backendUrl}/api/product/add`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Product added successfully!");
        setName(""); setDescription(""); setPrice(""); setCategory("Fast Food"); setImage(null);
      } else toast.error(res.data.message);
    } catch (err) {
      console.error("Add product error:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7f4", display: "flex", alignItems: "center", justifyContent: "center", padding: "2.5rem 1rem", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .add-input, .add-textarea, .add-select {
          width: 100%;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1.5px solid #e2e0db;
          background: #fff;
          font-size: 13.5px;
          font-family: 'DM Sans', sans-serif;
          color: #1a1a1a;
          outline: none;
          transition: border 0.15s;
          box-sizing: border-box;
        }
        .add-input:focus, .add-textarea:focus, .add-select:focus { border-color: #aaa; }
        .add-input::placeholder, .add-textarea::placeholder { color: #bbb; }
        .add-textarea { resize: none; line-height: 1.6; }
        .add-select { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px; }

        .field-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: #999;
          margin-bottom: 6px;
        }

        .upload-zone {
          width: 100%;
          border: 1.5px dashed #ddd;
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
          background: #fafaf9;
          gap: 8px;
        }
        .upload-zone:hover { border-color: #bbb; background: #f5f4f1; }

        .submit-btn {
          width: 100%;
          padding: 11px;
          border-radius: 10px;
          border: none;
          background: #1a1a1a;
          color: #fff;
          font-size: 14px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.15s;
          letter-spacing: 0.01em;
        }
        .submit-btn:hover:not(:disabled) { background: #333; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .price-wrap { position: relative; }
        .price-prefix {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 12px;
          font-weight: 500;
          color: #aaa;
          font-family: 'DM Mono', monospace;
          pointer-events: none;
        }
        .price-input { padding-left: 46px !important; font-family: 'DM Mono', monospace !important; }
      `}</style>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          width: "100%",
          maxWidth: "480px",
          borderRadius: "20px",
          border: "1.5px solid #ede9e3",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}
      >
        {/* TITLE */}
        <div style={{ marginBottom: "0.25rem" }}>
          <p style={{ fontSize: "20px", fontWeight: 600, color: "#1a1a1a", letterSpacing: "-0.03em", margin: 0 }}>Add Menu Item</p>
          <p style={{ fontSize: "13px", color: "#aaa", margin: "3px 0 0" }}>Fill in the details below to add a new dish</p>
        </div>

        {/* IMAGE UPLOAD */}
        <div>
          <label className="field-label">Item Image</label>
          <label htmlFor="image" className="upload-zone">
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                style={{ width: "90px", height: "90px", objectFit: "cover", borderRadius: "10px", border: "1px solid #ede9e3" }}
              />
            ) : (
              <>
                <img
                  src={upload_image}
                  alt="upload"
                  style={{ width: "52px", height: "52px", objectFit: "cover", borderRadius: "8px", opacity: 0.5 }}
                />
                <p style={{ margin: 0, fontSize: "12.5px", color: "#bbb", fontWeight: 500 }}>Click to upload image</p>
              </>
            )}
          </label>
          <input type="file" id="image" hidden accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        </div>

        {/* NAME */}
        <div>
          <label className="field-label">Product Name</label>
          <input
            type="text"
            className="add-input"
            placeholder="e.g. Chicken Burger"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="field-label">Description</label>
          <textarea
            className="add-textarea"
            placeholder="Brief description of the item..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
          />
        </div>

        {/* CATEGORY + PRICE */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div>
            <label className="field-label">Category</label>
            <select className="add-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Price</label>
            <div className="price-wrap">
              <span className="price-prefix">PKR</span>
              <input
                type="number"
                className="add-input price-input"
                placeholder="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div style={{ borderTop: "1px solid #f0ede8" }} />

        {/* SUBMIT */}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Adding item..." : "Add to Menu"}
        </button>
      </form>
    </div>
  );
};

export default AddMenu;