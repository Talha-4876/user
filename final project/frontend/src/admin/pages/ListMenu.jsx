// frontend/src/pages/ListMenu.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MdDeleteForever } from "react-icons/md";
import { backendUrl } from "../../config";
import { useNavigate } from "react-router-dom";

const ListMenu = () => {
  const [list, setList] = useState([]);
  const token = localStorage.getItem("adminToken");
  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/product/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setList(res.data.products);
      else toast.error(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch products");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await axios.delete(`${backendUrl}/api/product/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        toast.success("Product deleted successfully");
        fetchList();
      } else toast.error(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete product");
    }
  };

  useEffect(() => { if (token) fetchList(); }, [token]);

  return (
    <div style={{ padding: "2rem", fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "#f8f7f4" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .menu-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
        .menu-table thead th {
          padding: 12px 16px;
          text-align: left;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #999;
          background: #f8f7f4;
          border-bottom: 1.5px solid #ede9e3;
        }
        .menu-table tbody tr {
          border-bottom: 1px solid #f0ede8;
          transition: background 0.12s;
        }
        .menu-table tbody tr:hover { background: #faf9f7; }
        .menu-table tbody td { padding: 12px 16px; vertical-align: middle; }

        .item-img {
          width: 56px;
          height: 56px;
          object-fit: cover;
          border-radius: 10px;
          border: 1px solid #ede9e3;
        }

        .category-chip {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 99px;
          font-size: 11.5px;
          font-weight: 500;
          background: #f5f4f1;
          color: #666;
        }

        .price-cell {
          font-family: 'DM Mono', monospace;
          font-size: 13.5px;
          font-weight: 500;
          color: #1a1a1a;
        }

        .btn-edit {
          padding: 5px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid #bfdbfe;
          background: #eff6ff;
          color: #1e40af;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.15s;
        }
        .btn-edit:hover { background: #dbeafe; transform: translateY(-1px); }

        .btn-delete {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 8px;
          border: 1px solid #fecdd3;
          background: #fff1f2;
          color: #be123c;
          cursor: pointer;
          transition: all 0.15s;
          font-size: 17px;
        }
        .btn-delete:hover { background: #ffe4e6; transform: translateY(-1px); }

        .empty-state { padding: 60px 20px; text-align: center; color: #aaa; }
        .empty-icon { font-size: 36px; margin-bottom: 10px; opacity: 0.4; }

        .page-title {
          font-size: 22px;
          font-weight: 600;
          color: #1a1a1a;
          letter-spacing: -0.03em;
          margin: 0 0 4px;
        }
        .page-sub { font-size: 13px; color: #999; margin: 0 0 1.5rem; }
      `}</style>

      {/* HEADER */}
      <p className="page-title">Menu List</p>
      <p className="page-sub">{list.length} items on the menu</p>

      {/* TABLE */}
      <div style={{
        background: "#fff",
        borderRadius: "16px",
        border: "1.5px solid #ede9e3",
        overflow: "hidden",
        overflowX: "auto",
      }}>
        <table className="menu-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan="5">
                  <div className="empty-state">
                    <div className="empty-icon">🍽️</div>
                    <p style={{ margin: 0, fontWeight: 500, color: "#888" }}>No items found</p>
                    <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#bbb" }}>Add something to the menu</p>
                  </div>
                </td>
              </tr>
            ) : list.map((item) => (
              <tr key={item._id}>
                <td>
                  <img src={item.image} alt={item.name} className="item-img" />
                </td>
                <td>
                  <p style={{ fontWeight: 600, color: "#1a1a1a", margin: 0, fontSize: "13.5px" }}>{item.name}</p>
                </td>
                <td>
                  <span className="category-chip">{item.category}</span>
                </td>
                <td className="price-cell">PKR {Math.round(item.price)}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <button className="btn-edit" onClick={() => navigate(`/admin/update/${item._id}`)}>
                      Edit
                    </button>
                    <button className="btn-delete" onClick={() => deleteProduct(item._id)}>
                      <MdDeleteForever />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListMenu;