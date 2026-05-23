import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../../config";
import { toast } from "react-hot-toast";
import { Trash2, PlusCircle, ImagePlus, UtensilsCrossed, MapPin, Tag, Users, Layers, Sofa, DollarSign, Star } from "lucide-react";

const AddTable = () => {
  const [form, setForm] = useState({
    tableNumber: "",
    seats: "",
    label: "",
    location: "",
    type: "",
    furniture: "",
    description: "",
    image: null,
    price: "",
    features: "",
  });

  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchTables = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/tables/all`);
      if (res.data.success) setTables(res.data.tables);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchTables(); }, []);

  const handleAdd = async () => {
    if (!form.tableNumber || !form.seats) return toast.error("Table number aur seats zaroori hain");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("tableNumber", form.tableNumber);
      formData.append("seats", form.seats);
      formData.append("label", form.label);
      formData.append("location", form.location);
      formData.append("type", form.type);
      formData.append("furniture", form.furniture);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("features", JSON.stringify(form.features.split(",").map(f => f.trim())));
      if (form.image) formData.append("image", form.image);

      const res = await axios.post(`${backendUrl}/api/tables/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Table add ho gaya!");
        setForm({ tableNumber: "", seats: "", label: "", location: "", type: "", furniture: "", description: "", image: null, price: "", features: "" });
        fetchTables();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Table add nahi hua");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`${backendUrl}/api/tables/delete/${id}`);
      toast.success("Delete ho gaya");
      fetchTables();
    } catch (err) {
      toast.error("Delete nahi hua");
    } finally {
      setDeletingId(null);
    }
  };

  const seatColor = (seats) => {
    if (seats <= 2) return { bg: "#eff6ff", color: "#1d4ed8", dot: "#3b82f6" };
    if (seats <= 4) return { bg: "#f0fdf4", color: "#15803d", dot: "#22c55e" };
    if (seats <= 6) return { bg: "#fff7ed", color: "#c2410c", dot: "#f97316" };
    return { bg: "#fdf4ff", color: "#7e22ce", dot: "#a855f7" };
  };

  const Field = ({ label, icon: Icon, children }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af" }}>
        {Icon && <Icon size={11} />}
        {label}
      </label>
      {children}
    </div>
  );

  const inputStyle = {
    width: "100%",
    padding: "10px 13px",
    borderRadius: "10px",
    border: "1.5px solid #f0ece6",
    background: "#fdfcfb",
    fontSize: "13.5px",
    color: "#1c1917",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    transition: "border-color 0.15s, box-shadow 0.15s",
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #faf9f7 0%, #f5f3ee 100%)", padding: "2.5rem", fontFamily: "'Outfit', 'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
        .tbl-inp:focus { border-color: #c4a97d !important; box-shadow: 0 0 0 3px rgba(196,169,125,0.12) !important; }
        .tbl-inp::placeholder { color: #c4bfb8; }
        .add-btn:hover:not(:disabled) { background: #2c2419 !important; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,0,0,0.18) !important; }
        .add-btn:active:not(:disabled) { transform: translateY(0); }
        .table-card:hover { border-color: #e5d9c8 !important; box-shadow: 0 4px 16px rgba(0,0,0,0.06) !important; }
        .del-btn:hover { background: #fff1f2 !important; border-color: #fda4af !important; transform: scale(1.05); }
        .image-upload-area:hover { border-color: #c4a97d !important; background: #faf7f3 !important; }
      `}</style>

      {/* HEADER */}
      <div style={{ maxWidth: "1180px", marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#1c1917", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <UtensilsCrossed size={17} color="#f5f0e8" />
          </div>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 700, color: "#1c1917", letterSpacing: "-0.02em" }}>Manage Tables</h1>
        </div>
        <p style={{ margin: "0 0 0 48px", fontSize: "13.5px", color: "#a8a29e" }}>Restaurant tables add aur manage karein</p>
      </div>

      <div style={{ maxWidth: "1180px", display: "grid", gridTemplateColumns: "420px 1fr", gap: "24px", alignItems: "start" }}>

        {/* ── LEFT: ADD FORM ── */}
        <div style={{ background: "#fff", border: "1.5px solid #f0ece6", borderRadius: "20px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>

          {/* Form header */}
          <div style={{ padding: "20px 22px 18px", borderBottom: "1px solid #f5f1eb", background: "#fdfcfa" }}>
            <p style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: "#1c1917" }}>Naya Table</p>
            <p style={{ margin: "2px 0 0", fontSize: "12.5px", color: "#a8a29e" }}>* zaroori fields hain</p>
          </div>

          <div style={{ padding: "22px", display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Table Number + Seats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <Field label="Table No *" icon={Tag}>
                <input type="number" className="tbl-inp" style={inputStyle} placeholder="01" value={form.tableNumber}
                  onChange={e => setForm({ ...form, tableNumber: e.target.value })} />
              </Field>
              <Field label="Seats *" icon={Users}>
                <input type="number" className="tbl-inp" style={inputStyle} placeholder="4" value={form.seats}
                  onChange={e => setForm({ ...form, seats: e.target.value })} />
              </Field>
            </div>

            {/* Label + Location */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <Field label="Label" icon={Tag}>
                <input className="tbl-inp" style={inputStyle} placeholder="VIP / Window" value={form.label}
                  onChange={e => setForm({ ...form, label: e.target.value })} />
              </Field>
              <Field label="Location" icon={MapPin}>
                <input className="tbl-inp" style={inputStyle} placeholder="Window Side" value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })} />
              </Field>
            </div>

            {/* Type + Furniture */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <Field label="Type" icon={Layers}>
                <input className="tbl-inp" style={inputStyle} placeholder="Luxury" value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })} />
              </Field>
              <Field label="Furniture" icon={Sofa}>
                <input className="tbl-inp" style={inputStyle} placeholder="Sofa" value={form.furniture}
                  onChange={e => setForm({ ...form, furniture: e.target.value })} />
              </Field>
            </div>

            {/* Price */}
            <Field label="Price (PKR)" icon={DollarSign}>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", fontSize: "13px", color: "#a8a29e", fontWeight: 500 }}>₨</span>
                <input type="number" className="tbl-inp" style={{ ...inputStyle, paddingLeft: "28px" }} placeholder="2,000" value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })} />
              </div>
            </Field>

            {/* Image Upload */}
            <Field label="Table Image" icon={ImagePlus}>
              <label className="image-upload-area" style={{ border: "1.5px dashed #e7e2da", borderRadius: "14px", padding: form.image ? "0" : "22px 16px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "8px", cursor: "pointer", background: "#fdfcfa", transition: "all 0.15s", overflow: "hidden" }}>
                {form.image ? (
                  <div style={{ position: "relative", width: "100%" }}>
                    <img src={URL.createObjectURL(form.image)} alt="preview" style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "12px", display: "block" }} />
                    <div style={{ position: "absolute", bottom: "10px", right: "10px", background: "rgba(0,0,0,0.55)", borderRadius: "8px", padding: "5px 10px", fontSize: "11px", color: "#fff", backdropFilter: "blur(4px)" }}>
                      Change karein
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#f5f1eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <ImagePlus size={20} color="#c4a97d" />
                    </div>
                    <p style={{ margin: 0, fontSize: "12.5px", color: "#a8a29e", textAlign: "center" }}>Click karke image upload karein</p>
                    <p style={{ margin: 0, fontSize: "11px", color: "#c4bfb8" }}>PNG, JPG, WEBP</p>
                  </>
                )}
                <input type="file" accept="image/*" style={{ display: "none" }}
                  onChange={e => { console.log("SELECTED FILE:", e.target.files[0]); setForm({ ...form, image: e.target.files[0] }); }} />
              </label>
            </Field>

            {/* Features */}
            <Field label="Features" icon={Star}>
              <input className="tbl-inp" style={inputStyle} placeholder="AC, Romantic, Candle Light" value={form.features}
                onChange={e => setForm({ ...form, features: e.target.value })} />
              <p style={{ margin: "3px 0 0", fontSize: "11px", color: "#c4bfb8" }}>Comma se alag karein</p>
            </Field>

            {/* Description */}
            <Field label="Description">
              <textarea className="tbl-inp" rows={3} style={{ ...inputStyle, resize: "vertical", lineHeight: "1.55" }} placeholder="Is table ke baare mein kuch likhein..." value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })} />
            </Field>

            {/* Submit */}
            <button className="add-btn" onClick={handleAdd} disabled={loading}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "13px", borderRadius: "12px", border: "none", background: "#1c1917", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, transition: "all 0.2s", marginTop: "4px", fontFamily: "inherit", letterSpacing: "0.01em" }}>
              <PlusCircle size={16} />
              {loading ? "Add ho raha hai..." : "Table Add Karein"}
            </button>

          </div>
        </div>

        {/* ── RIGHT: TABLES LIST ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

          {/* List header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "#1c1917" }}>Existing Tables</p>
              <p style={{ margin: "2px 0 0", fontSize: "12.5px", color: "#a8a29e" }}>{tables.length} table{tables.length !== 1 ? "s" : ""} registered</p>
            </div>
            {tables.length > 0 && (
              <div style={{ background: "#f5f1eb", borderRadius: "8px", padding: "5px 12px", fontSize: "12px", fontWeight: 600, color: "#78716c" }}>
                Total: {tables.length}
              </div>
            )}
          </div>

          {tables.length === 0 ? (
            <div style={{ background: "#fff", border: "1.5px dashed #e7e2da", borderRadius: "16px", padding: "48px 24px", textAlign: "center" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "#f5f1eb", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <UtensilsCrossed size={22} color="#c4a97d" />
              </div>
              <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: "#78716c" }}>Koi table nahi mila</p>
              <p style={{ margin: "4px 0 0", fontSize: "12.5px", color: "#a8a29e" }}>Pehla table left form se add karein</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {tables.map((table) => {
                const sc = seatColor(table.seats);
                return (
                  <div key={table._id} className="table-card" style={{ background: "#fff", border: "1.5px solid #f0ece6", borderRadius: "16px", padding: "14px 18px", display: "flex", alignItems: "center", gap: "14px", transition: "all 0.2s" }}>

                    {/* Table image or number badge */}
                    {table.image ? (
                      <img src={table.image} alt={`Table ${table.tableNumber}`} style={{ width: "52px", height: "52px", objectFit: "cover", borderRadius: "11px", flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: "52px", height: "52px", borderRadius: "11px", background: "#1c1917", color: "#f5f0e8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: "9px", fontWeight: 500, opacity: 0.6, letterSpacing: "0.05em" }}>TBL</span>
                        <span style={{ fontSize: "17px", fontWeight: 700, lineHeight: 1.1 }}>{table.tableNumber}</span>
                      </div>
                    )}

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "14px", fontWeight: 600, color: "#1c1917" }}>Table {table.tableNumber}</span>
                        {table.label && (
                          <span style={{ padding: "2px 8px", borderRadius: "6px", fontSize: "10.5px", fontWeight: 600, background: "#fff7ed", color: "#c2410c", letterSpacing: "0.03em" }}>
                            {table.label}
                          </span>
                        )}
                        {table.type && (
                          <span style={{ padding: "2px 8px", borderRadius: "6px", fontSize: "10.5px", fontWeight: 500, background: "#f5f3ff", color: "#6d28d9" }}>
                            {table.type}
                          </span>
                        )}
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                        {/* Seats badge */}
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "3px 10px", borderRadius: "99px", fontSize: "11.5px", fontWeight: 600, background: sc.bg, color: sc.color }}>
                          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: sc.dot }}></span>
                          {table.seats} seats
                        </span>

                        {table.location && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", fontSize: "11.5px", color: "#a8a29e" }}>
                            <MapPin size={10} />
                            {table.location}
                          </span>
                        )}

                        {table.price && (
                          <span style={{ fontSize: "11.5px", color: "#78716c", fontWeight: 500 }}>
                            ₨{Number(table.price).toLocaleString()}
                          </span>
                        )}
                      </div>

                      {table.features && table.features.length > 0 && table.features[0] !== "" && (
                        <div style={{ display: "flex", gap: "5px", marginTop: "7px", flexWrap: "wrap" }}>
                          {table.features.slice(0, 3).map((f, i) => (
                            <span key={i} style={{ padding: "2px 7px", borderRadius: "5px", fontSize: "10px", fontWeight: 500, background: "#f5f1eb", color: "#78716c" }}>{f}</span>
                          ))}
                          {table.features.length > 3 && (
                            <span style={{ padding: "2px 7px", borderRadius: "5px", fontSize: "10px", color: "#a8a29e" }}>+{table.features.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Delete button */}
                    <button className="del-btn" onClick={() => handleDelete(table._id)} disabled={deletingId === table._id}
                      style={{ width: "34px", height: "34px", borderRadius: "10px", border: "1.5px solid #fecdd3", background: "#fff", color: "#be123c", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all 0.15s", opacity: deletingId === table._id ? 0.5 : 1 }}>
                      <Trash2 size={14} />
                    </button>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AddTable;
