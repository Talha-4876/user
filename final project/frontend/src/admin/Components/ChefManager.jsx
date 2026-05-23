import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const BASE_URL = "http://localhost:3200";
const API = `${BASE_URL}/api/chefs`;

const getToken = () => localStorage.getItem("adminToken");

const authFetch = (url, options = {}) =>
  fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(options.headers || {}),
    },
  });

const emptyForm = {
  name: "", specialty: "",
  facebook: "", instagram: "", twitter: "",
};
const ChefManager = () => {
  const [chefs, setChefs]     = useState([]);
  const [form, setForm]       = useState(emptyForm);
  const [imgFile, setImgFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editId, setEditId]   = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchChefs = async () => {
    try {
      const res = await fetch(API);
      setChefs(await res.json());
    } catch {
      toast.error("Chefs load nahi hue");
    }
  };

  useEffect(() => { fetchChefs(); }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.specialty) {
      toast.warning("Naam aur Specialty zaroori hain");
      return;
    }
    if (!editId && !imgFile) {
      toast.warning("Image select karo");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name",        form.name);
      formData.append("specialty",   form.specialty);
      
      formData.append("facebook",    form.facebook);
      formData.append("instagram",   form.instagram);
      formData.append("twitter",     form.twitter);
      if (imgFile) formData.append("img", imgFile);

      const url    = editId ? `${API}/${editId}` : API;
      const method = editId ? "PUT" : "POST";

      const res = await authFetch(url, { method, body: formData });
      if (!res.ok) throw new Error();

      toast.success(editId ? "Chef updated ✅" : "Chef added ✅");
      setForm(emptyForm);
      setImgFile(null);
      setPreview(null);
      setEditId(null);
      fetchChefs();
    } catch {
      toast.error("something went wrong");
    } finally {
      setLoading(false);
    }
  };

 const handleEdit = (chef) => {
  setForm({
    name:        chef.name,
    specialty:   chef.specialty,
    facebook:    chef.facebook,
    instagram:   chef.instagram,
    twitter:     chef.twitter,
  });
  setPreview(chef.img?.startsWith("http") ? chef.img : `${BASE_URL}/uploads/${chef.img}`);
  setImgFile(null);
  setEditId(chef._id);
  window.scrollTo({ top: 0, behavior: "smooth" });
};
  const handleDelete = async (id) => {
    if (!window.confirm("Is chef ko delete karna chahte hain?")) return;
    try {
      await authFetch(`${API}/${id}`, { method: "DELETE" });
      toast.success("Chef delete ho gaya");
      fetchChefs();
    } catch {
      toast.error("Delete nahi hua");
    }
  };

  const imgSrc = (img) =>
    img?.startsWith("http") ? img : `${BASE_URL}/uploads/${img}`;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {editId ? "✏️ Chef Edit Karein" : "➕ Naya Chef Add Karein"}
      </h2>

      {/* Form */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Image Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Chef ki Photo
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-orange-300 overflow-hidden flex items-center justify-center bg-orange-50 flex-shrink-0">
                {preview
                  ? <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  : <span className="text-orange-300 text-3xl">👤</span>
                }
              </div>
              <div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-orange-100 file:text-orange-600 hover:file:bg-orange-200 cursor-pointer"
                />
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — max 5MB</p>
                {editId && (
                  <p className="text-xs text-blue-400 mt-1">
                    Naya image select karo ya khali choro (purana rahega)
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Name */}
          <input
            placeholder="Chef ka naam *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          {/* Specialty */}
          <input
            placeholder="Specialty (e.g. BBQ, Italian) *"
            value={form.specialty}
            onChange={(e) => setForm({ ...form, specialty: e.target.value })}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

        
          {/* Social Links */}
          {[
            { key: "facebook",  placeholder: "Facebook URL (optional)" },
            { key: "instagram", placeholder: "Instagram URL (optional)" },
            { key: "twitter",   placeholder: "Twitter URL (optional)" },
          ].map(({ key, placeholder }) => (
            <input
              key={key}
              placeholder={placeholder}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          ))}

          {/* Buttons */}
          <div className="md:col-span-2 flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-60"
            >
              {loading ? "Saving..." : editId ? "Update Chef" : "Add Chef"}
            </button>
            {editId && (
              <button
                onClick={() => {
                  setForm(emptyForm);
                  setImgFile(null);
                  setPreview(null);
                  setEditId(null);
                }}
                className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Chef List */}
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Sab Chefs ({chefs.length})
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {chefs.map((chef) => (
          <div key={chef._id} className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
            <img
              src={imgSrc(chef.img)}
              alt={chef.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-orange-400 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 truncate">{chef.name}</p>
              <p className="text-orange-500 text-sm truncate">{chef.specialty}</p>
              
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button onClick={() => handleEdit(chef)}
                className="text-blue-500 hover:text-blue-700 text-sm font-medium">
                Edit
              </button>
              <button onClick={() => handleDelete(chef._id)}
                className="text-red-500 hover:text-red-700 text-sm font-medium">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChefManager;