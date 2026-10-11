import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import api from "../api/axios";
import StatusBadge from "../components/StatusBadge";
import { formatDate } from "../utils/format";

const steps = ["Placed", "Preparing", "Out for delivery", "Delivered"];

export default function OrderDetails() {
  const { id } = useParams();
  const location = useLocation();
  const justPlaced = location.state?.justPlaced;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    let ignore = false;
    api
      .get(`/orders/${id}`)
      .then((res) => {
        if (!ignore) setOrder(res.data);
      })
      .catch((err) => {
        if (!ignore) setError(err.response?.data?.message || "Could not load order");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm("Cancel this order?")) return;
    setCancelling(true);
    setError("");
    try {
      const { data } = await api.put(`/orders/${id}/cancel`);
      setOrder((prev) => ({ ...prev, status: data.status }));
    } catch (err) {
      setError(err.response?.data?.message || "Could not cancel order");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <p className="text-center text-gray-500 py-10">Loading...</p>;
  if (!order) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">{error || "Order not found"}</p>
        <Link to="/orders" className="text-strawberry hover:underline">Back to my orders</Link>
      </div>
    );
  }

  const currentStep = steps.indexOf(order.status);
  const addr = order.shippingAddress;

  return (
    <div className="max-w-3xl mx-auto">
      {/* {justPlaced && (
        <div className="mb-6 rounded-xl bg-green-100 text-green-800 px-4 py-3">
          🎉 Order placed successfully! Thank you for ordering.
        </div>
      )} */}
      {justPlaced && (
        <div className="mb-6 rounded-[2rem] bg-blush text-center py-6 px-4">
          <h2 className="font-display text-3xl font-bold text-strawberry">Thank you! 🎉</h2>
          <p className="mt-1">Your order has been placed.</p>
          <div className="relative h-12 mt-4 overflow-hidden">
            <span className="absolute top-0 text-4xl animate-ride">🛵</span>
          </div>
        </div>
      )}

      <Link to="/orders" className="text-sm text-strawberry hover:underline">
        ← My orders
      </Link>

      <div className="mt-4 bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">
            Order #{order._id.slice(-6).toUpperCase()}
          </h1>
          <StatusBadge status={order.status} />
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Placed on {formatDate(order.createdAt)}
        </p>

        {order.status !== "Cancelled" && (
          <div className="flex items-center mt-6">
            {steps.map((s, i) => (
              <div key={s} className="flex-1 flex flex-col items-center text-center">
                <div
                  className={`w-4 h-4 rounded-full ${
                    i <= currentStep ? "bg-strawberry" : "bg-gray-300"
                  }`}
                />
                <span className="text-xs mt-1 text-gray-600">{s}</span>
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="mt-4 rounded bg-red-100 text-red-700 px-3 py-2 text-sm">{error}</p>
        )}

        <div className="mt-6 divide-y">
          {order.items.map((i) => (
            <div key={i.product} className="flex justify-between py-2 text-sm">
              <span>{i.quantity} × {i.name} (₹{i.price} each)</span>
              <span>₹{i.price * i.quantity}</span>
            </div>
          ))}
        </div>

        <div className="border-t mt-2 pt-3 flex justify-between font-bold">
          <span>Total</span>
          <span>₹{order.totalPrice}</span>
        </div>

        <div className="mt-6 text-sm text-gray-700">
          <p className="font-semibold">Delivery address</p>
          <p>{addr.fullName}, {addr.phone}</p>
          <p>{addr.address}, {addr.city} - {addr.pincode}</p>
          <p className="mt-2">
            Payment: {order.paymentMethod} · {order.isPaid ? "Paid" : "Not paid yet"}
          </p>
        </div>

        {order.status === "Placed" && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="mt-6 text-sm font-medium text-red-600 border border-red-300 px-4 py-2 rounded-lg hover:bg-red-50 disabled:opacity-60"
          >
            {cancelling ? "Cancelling..." : "Cancel order"}
          </button>
        )}
      </div>
    </div>
  );
}