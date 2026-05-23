import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../../config";

const AdminTable = () => {
  const [reservation, setReservation] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchReservation = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/api/reservations/all`);
      if (res.data.success) {
        setReservation(res.data.reservations || []);
      } else {
        toast.error("No reservations found");
      }
    } catch (err) {
      toast.error("Failed to fetch reservations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReservation(); }, []);

  useEffect(() => {
    let data = [...reservation];
    if (filter === "paid") data = data.filter((r) => r.isPaid);
    if (filter === "pending") data = data.filter((r) => !r.isPaid);
    if (filter === "active") data = data.filter((r) => r.status === "active");
    if (filter === "completed") data = data.filter((r) => r.status === "completed");
    if (search.trim()) data = data.filter((r) => r?.user?.name?.toLowerCase().includes(search.toLowerCase()));
    setFilteredData(data);
  }, [reservation, filter, search]);

  const markAsPaid = async (id) => {
    try {
      const res = await axios.put(`${backendUrl}/api/reservations/paid/${id}`);
      if (res.data.success) { toast.success("Marked as Paid"); fetchReservation(); }
    } catch { toast.error("Failed"); }
  };

  const markAsCompleted = async (id) => {
    try {
      const res = await axios.put(`${backendUrl}/api/reservations/complete/${id}`);
      if (res.data.success) { toast.success("Reservation Completed"); fetchReservation(); }
    } catch { toast.error("Failed"); }
  };

  const deleteRes = async (id) => {
    if (!window.confirm("Delete this reservation?")) return;
    try {
      const res = await axios.delete(`${backendUrl}/api/reservations/delete/${id}`);
      if (res.data.success) { toast.success("Deleted"); fetchReservation(); }
    } catch { toast.error("Delete failed"); }
  };

  const filters = ["all", "active", "completed", "paid", "pending"];
  const filterCount = (f) => {
    if (f === "all") return reservation.length;
    if (f === "paid") return reservation.filter((r) => r.isPaid).length;
    if (f === "pending") return reservation.filter((r) => !r.isPaid).length;
    return reservation.filter((r) => r.status === f).length;
  };

  const paidRevenue = reservation.filter((r) => r.isPaid).reduce((s, r) => s + (r.totalAmount || 0), 0);

  return (
    <div style={{ padding: "25px", background: "#f8f8f8", minHeight: "100vh" }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h1 style={{ fontSize: "28px", marginBottom: "5px" }}>Reservations</h1>
          <p style={{ color: "#666" }}>{reservation.length} total bookings</p>
        </div>
        <button onClick={fetchReservation} style={{ padding: "10px 18px", border: "none", background: "black", color: "white", borderRadius: "8px", cursor: "pointer" }}>
          Refresh
        </button>
      </div>

      {/* STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "20px" }}>
        {[
          { label: "Total", value: reservation.length, sub: "all bookings" },
          { label: "Active", value: reservation.filter(r => r.status === "active").length, sub: "in progress" },
          { label: "Revenue", value: `Rs. ${paidRevenue.toLocaleString()}`, sub: "collected" },
          { label: "Pending", value: reservation.filter(r => !r.isPaid).length, sub: "unpaid" },
        ].map((s) => (
          <div key={s.label} style={{ background: "white", borderRadius: "12px", padding: "16px 18px", border: "1px solid #eee" }}>
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#999", marginBottom: "6px", fontWeight: 600 }}>{s.label}</p>
            <p style={{ fontSize: "26px", fontWeight: 700, color: "#111", lineHeight: 1, marginBottom: "4px" }}>{s.value}</p>
            <p style={{ fontSize: "12px", color: "#aaa" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* SEARCH */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "12px", width: "100%", maxWidth: "350px", borderRadius: "10px", border: "1px solid #ddd", outline: "none", fontSize: "14px" }}
        />
      </div>

      {/* FILTERS */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "10px 16px", borderRadius: "30px",
              border: filter === f ? "1px solid black" : "1px solid #ddd",
              background: filter === f ? "black" : "white",
              color: filter === f ? "white" : "black",
              cursor: "pointer", fontWeight: "600", fontSize: "13px",
            }}
          >
            {f} ({filterCount(f)})
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div style={{ background: "white", borderRadius: "15px", overflowX: "auto", border: "1px solid #eee" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#fafafa" }}>
            <tr>
              {["Customer", "Date", "Table", "Payment", "Amount", "Status", "Actions"].map((h) => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: "center", padding: "40px" }}>Loading...</td></tr>
            ) : filteredData.length > 0 ? filteredData.map((r) => (
              <tr key={r._id}>
                <td style={tdStyle}>
                  <p style={{ margin: 0, fontWeight: "600" }}>{r?.user?.name || "No Name"}</p>
                  <small style={{ color: "#666" }}>{r?.user?.email}</small>
                </td>
                <td style={tdStyle}>
                  <p style={{ margin: 0 }}>{r?.date || "No Date"}</p>
                  <small style={{ color: "#666" }}>{r?.time || ""}</small>
                </td>
                <td style={tdStyle}>Table #{r?.tableNumber || "N/A"}</td>
                <td style={tdStyle}>{r?.paymentMethod || "COD"}</td>
                <td style={tdStyle}>Rs. {(r?.totalAmount || 0).toLocaleString()}</td>
                <td style={tdStyle}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    <span style={{ color: r.isPaid ? "green" : "orange", fontWeight: "600" }}>
                      {r.isPaid ? "Paid" : "Pending"}
                    </span>
                    <span style={{ color: r.status === "completed" ? "gray" : "blue", fontWeight: "600" }}>
                      {r.status || "active"}
                    </span>
                  </div>
                </td>
                <td style={tdStyle}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {!r.isPaid && <button onClick={() => markAsPaid(r._id)} style={payBtn}>Mark Paid</button>}
                    {r.status !== "completed" && <button onClick={() => markAsCompleted(r._id)} style={completeBtn}>Complete</button>}
                    <button onClick={() => deleteRes(r._id)} style={deleteBtn}>Delete</button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="7" style={{ textAlign: "center", padding: "50px", color: "#999" }}>No reservations found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const thStyle = { padding: "15px", textAlign: "left", borderBottom: "1px solid #eee", fontSize: "14px" };
const tdStyle = { padding: "15px", borderBottom: "1px solid #f2f2f2" };
const payBtn = { padding: "8px", border: "none", borderRadius: "8px", background: "#dcfce7", cursor: "pointer" };
const completeBtn = { padding: "8px", border: "none", borderRadius: "8px", background: "#dbeafe", cursor: "pointer" };
const deleteBtn = { padding: "8px", border: "none", borderRadius: "8px", background: "#fee2e2", cursor: "pointer" };

export default AdminTable;