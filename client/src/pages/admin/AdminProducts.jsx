import { useEffect, useState } from "react";
import api from "../../api/axios";

const categories = ["Classic", "Chocolate", "Fruity", "Special"];
const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "Classic",
  stock: "",
  image: "",
  isAvailable: true,
};
const inputClass =
  "w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let ignore = false;
    api
      .get("/products", { params: { limit: 50 } })
      .then((res) => {
        if (!ignore) setProducts(res.data.products);
      })
      .catch(() => {
        if (!ignore) setError("Could not load products");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [refresh]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post("/products", payload);
      }
      resetForm();
      setRefresh((r) => r + 1);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save product");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (p) => {
    setForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      category: p.category,
      stock: String(p.stock),
      image: p.image || "",
      isAvailable: p.isAvailable,
    });
    setEditingId(p._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (p) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    setError("");
    try {
      await api.delete(`/products/${p._id}`);
      setRefresh((r) => r + 1);
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete product");
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm p-6 space-y-4"
      >
        <h2 className="font-semibold">
          {editingId ? "Edit flavor" : "Add a new flavor"}
        </h2>

        {error && (
          <p className="rounded bg-red-100 text-red-700 px-3 py-2 text-sm">{error}</p>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <input name="name" placeholder="Name" value={form.name}
            onChange={handleChange} required className={inputClass} />
          <select name="category" value={form.category}
            onChange={handleChange} className={inputClass}>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input name="price" type="number" min="0" placeholder="Price (₹)"
            value={form.price} onChange={handleChange} required className={inputClass} />
          <input name="stock" type="number" min="0" placeholder="Stock"
            value={form.stock} onChange={handleChange} required className={inputClass} />
        </div>

        <textarea name="description" placeholder="Description" value={form.description}
          onChange={handleChange} required rows={2} className={inputClass} />
        <input name="image" placeholder="Image URL (optional)" value={form.image}
          onChange={handleChange} className={inputClass} />

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isAvailable" checked={form.isAvailable}
            onChange={handleChange} />
          Available for sale
        </label>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-pink-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-pink-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : editingId ? "Update flavor" : "Add flavor"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2 rounded-lg border bg-white"
            >
              Cancel edit
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-xl shadow-sm mt-6 overflow-x-auto">
        {loading ? (
          <p className="p-4 text-gray-500">Loading...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Available</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b last:border-0">
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">₹{p.price}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3">{p.isAvailable ? "Yes" : "No"}</td>
                  <td className="p-3 whitespace-nowrap">
                    <button onClick={() => startEdit(p)}
                      className="text-pink-600 hover:underline mr-3">Edit</button>
                    <button onClick={() => handleDelete(p)}
                      className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}