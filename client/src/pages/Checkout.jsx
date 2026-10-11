import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const inputClass =
  "w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-strawberry/40";

export default function Checkout() {
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: user?.name || "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600">Your cart is empty.</p>
        <Link
          to="/"
          className="inline-block mt-4 bg-strawberry text-white px-5 py-2 rounded-lg hover:bg-strawberry-dark"
        >
          Browse flavors
        </Link>
      </div>
    );
  }

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const address = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v.trim()])
    );
    if (!/^\d{10}$/.test(address.phone)) {
      return setError("Enter a valid 10-digit phone number");
    }
    if (!/^\d{6}$/.test(address.pincode)) {
      return setError("Enter a valid 6-digit pincode");
    }

    setSubmitting(true);
    try {
      const { data } = await api.post("/orders", {
        items: items.map((i) => ({ product: i.product, quantity: i.quantity })),
        shippingAddress: address,
        paymentMethod: "COD",
      });
      clearCart();
      navigate(`/orders/${data._id}`, { state: { justPlaced: true } });
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-strawberry mb-6">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <form
          onSubmit={handleSubmit}
          className="md:col-span-2 bg-white rounded-xl shadow-sm p-6 space-y-4"
        >
          <h2 className="font-semibold">Delivery details</h2>

          {error && (
            <p className="rounded bg-red-100 text-red-700 px-3 py-2 text-sm">
              {error}
            </p>
          )}

          <input name="fullName" placeholder="Full name" value={form.fullName}
            onChange={handleChange} required className={inputClass} />
          <input name="phone" placeholder="Phone (10 digits)" value={form.phone}
            onChange={handleChange} required inputMode="numeric" className={inputClass} />
          <input name="address" placeholder="Address" value={form.address}
            onChange={handleChange} required className={inputClass} />
          <div className="grid grid-cols-2 gap-4">
            <input name="city" placeholder="City" value={form.city}
              onChange={handleChange} required className={inputClass} />
            <input name="pincode" placeholder="Pincode (6 digits)" value={form.pincode}
              onChange={handleChange} required inputMode="numeric" className={inputClass} />
          </div>

          <div className="rounded-lg border bg-pink-50 px-4 py-3 text-sm">
            <p className="font-medium">Payment: Cash on Delivery</p>
            <p className="text-gray-500">Pay when your order arrives.</p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-strawberry text-white py-2.5 rounded-lg font-medium hover:bg-strawberry-dark disabled:opacity-60"
          >
            {submitting ? "Placing order..." : "Place order"}
          </button>
        </form>

        <div className="bg-white rounded-xl shadow-sm p-6 h-fit">
          <h2 className="font-semibold mb-4">Order summary</h2>
          <div className="space-y-2 text-sm">
            {items.map((i) => (
              <div key={i.product} className="flex justify-between gap-2">
                <span>{i.quantity} × {i.name}</span>
                <span>₹{i.price * i.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 flex justify-between font-bold">
            <span>Total</span>
            <span>₹{subtotal}</span>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Final prices and stock are confirmed by the server when you place the order.
          </p>
        </div>
      </div>
    </div>
  );
}