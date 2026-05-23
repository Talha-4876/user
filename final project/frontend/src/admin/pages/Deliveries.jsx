import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../../config";

const Deliveries = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  const fetchDeliveries = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/delivery/all`);
      if (res.data.success) setData(res.data.deliveries);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => { fetchDeliveries(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      const res = await axios.delete(`${backendUrl}/api/delivery/delete/${id}`);
      if (res.data.success) setData(prev => prev.filter(item => item._id !== id));
    } catch (err) { console.log(err); }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Pending" ? "Delivered" : "Pending";
    try {
      const res = await axios.put(`${backendUrl}/api/delivery/status/${id}`, { status: newStatus });
      if (res.data.success)
        setData(prev => prev.map(item => item._id === id ? { ...item, status: newStatus } : item));
    } catch (err) { console.log(err); }
  };

  const filteredData = data.filter(item =>
    item.name?.toLowerCase().includes(search.toLowerCase()) &&
    (cityFilter ? item.city === cityFilter : true)
  );

  const cities = [...new Set(data.map(item => item.city))];

  return (
    <div style={{ padding: "2rem", fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "#f8f7f4" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .del-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
        .del-table thead th {
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
        .del-table tbody tr { border-bottom: 1px solid #f0ede8; transition: background 0.12s; }
        .del-table tbody tr:hover { background: #faf9f7; }
        .del-table tbody td { padding: 13px 16px; vertical-align: middle; }

        .search-input {
          padding: 8px 14px;
          border-radius: 10px;
          border: 1.5px solid #e2e0db;
          background: #fff;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          color: #333;
          outline: none;
          transition: border 0.15s;
          width: 200px;
        }
        .search-input:focus { border-color: #bbb; }
        .search-input::placeholder { color: #bbb; }

        .city-select {
          padding: 8px 14px;
          border-radius: 10px;
          border: 1.5px solid #e2e0db;
          background: #fff;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          color: #555;
          outline: none;
          cursor: pointer;
          transition: border 0.15s;
        }
        .city-select:focus { border-color: #bbb; }

        .status-btn {
          padding: 4px 12px;
          border-radius: 99px;
          font-size: 11.5px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          font-family: 'DM Sans', sans-serif;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          transition: all 0.15s;
          letter-spacing: 0.01em;
        }
        .status-pending { background: #fff7ed; color: #c2410c; }
        .status-pending:hover { background: #ffedd5; }
        .status-delivered { background: #dcfce7; color: #15803d; }
        .status-delivered:hover { background: #bbf7d0; }

        .dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
        .dot-pending { background: #f97316; }
        .dot-delivered { background: #22c55e; }

        .btn-delete {
          padding: 5px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid #fecdd3;
          background: #fff1f2;
          color: #be123c;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.15s;
        }
        .btn-delete:hover { background: #ffe4e6; transform: translateY(-1px); }

        .pay-chip {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 99px;
          font-size: 11.5px;
          font-weight: 500;
          background: #f5f4f1;
          color: #666;
          text-transform: capitalize;
        }

        .amount-cell {
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          font-weight: 500;
          color: #1a1a1a;
        }

        .city-tag {
          display: inline-block;
          padding: 2px 9px;
          border-radius: 6px;
          font-size: 11.5px;
          background: #eff6ff;
          color: #1d4ed8;
          font-weight: 500;
        }

        .empty-state { padding: 60px 20px; text-align: center; }
        .refresh-btn {
          padding: 8px 14px;
          border-radius: 10px;
          border: 1.5px solid #e2e0db;
          background: #fff;
          color: #555;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.15s;
        }
        .refresh-btn:hover { border-color: #bbb; color: #222; }
      `}</style>

      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
        <div>
          <p style={{ fontSize: "22px", fontWeight: 600, color: "#1a1a1a", letterSpacing: "-0.03em", margin: 0 }}>Delivery Orders</p>
          <p style={{ fontSize: "13px", color: "#999", margin: "3px 0 0" }}>{filteredData.length} orders found</p>
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          <input
            className="search-input"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="city-select"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            <option value="">All Cities</option>
            {cities.map((c, i) => <option key={i} value={c}>{c}</option>)}
          </select>
          <button className="refresh-btn" onClick={fetchDeliveries}>↻ Refresh</button>
        </div>
      </div>

      {/* TABLE */}
      <div style={{
        background: "#fff",
        borderRadius: "16px",
        border: "1.5px solid #ede9e3",
        overflow: "hidden",
        overflowX: "auto",
      }}>
        <table className="del-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Phone</th>
              <th>City</th>
              <th>Address</th>
              <th>Payment</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="8">
                  <div className="empty-state">
                    <div style={{ fontSize: "34px", opacity: 0.35, marginBottom: "10px" }}>🚚</div>
                    <p style={{ margin: 0, fontWeight: 500, color: "#888" }}>No orders found</p>
                    <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#bbb" }}>Try adjusting your search or filter</p>
                  </div>
                </td>
              </tr>
            ) : filteredData.map(item => (
              <tr key={item._id}>
                <td>
                  <p style={{ fontWeight: 600, color: "#1a1a1a", margin: 0, fontSize: "13.5px" }}>{item.name}</p>
                </td>
                <td>
                  <p style={{ color: "#666", margin: 0, fontSize: "13px" }}>{item.phone}</p>
                </td>
                <td>
                  <span className="city-tag">{item.city}</span>
                </td>
                <td>
                  <p style={{ color: "#777", margin: 0, fontSize: "12.5px", maxWidth: "180px" }}>{item.street}</p>
                </td>
                <td>
                  <span className="pay-chip">{item.paymentMethod}</span>
                </td>
                <td className="amount-cell">
                  Rs {(item.totalAmount / 0.0057).toFixed(0)}
                </td>
                <td>
                  <button
                    className={`status-btn ${item.status === "Pending" ? "status-pending" : "status-delivered"}`}
                    onClick={() => toggleStatus(item._id, item.status)}
                  >
                    <span className={`dot ${item.status === "Pending" ? "dot-pending" : "dot-delivered"}`}></span>
                    {item.status}
                  </button>
                </td>
                <td>
                  <button className="btn-delete" onClick={() => handleDelete(item._id)}>
                    ✕ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Deliveries;