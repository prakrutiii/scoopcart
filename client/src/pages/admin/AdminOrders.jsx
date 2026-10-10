import { useEffect, useState } from "react";
import api from "../../api/axios";
import StatusBadge from "../../components/StatusBadge";
import { formatDate } from "../../utils/format";

const filters = ["All", "Placed", "Preparing", "Out for delivery", "Delivered", "Cancelled"];
const nextStatus = {
  Placed: "Preparing",
  Preparing: "Out for delivery",
  "Out for delivery": "Delivered",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [refresh, setRefresh] = useState(0);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    let ignore = false;
    const params = filter === "All" ? {} : { status: filter };
    api
      .get("/orders", { params })
      .then((res) => {
        if (!ignore) {
          setOrders(res.data);
          setError("");
        }
      })
      .catch(() => {
        if (!ignore) setError("Could not load orders");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [filter, refresh]);

  const advance = async (order) => {
    setBusyId(order._id);
    setError("");
    try {
      await api.put(`/orders/${order._id}/status`, { status: nextStatus[order.status] });
      setRefresh((r) => r + 1);
    } catch (err) {
      setError(err.response?.data?.message || "Could not update order");
    } finally {
      setBusyId(null);
    }
  };

  const cancel = async (order) => {
    if (!window.confirm("Cancel this order and return the stock?")) return;
    setBusyId(order._id);
    setError("");
    try {
      await api.put(`/orders/${order._id}/cancel`);
      setRefresh((r) => r + 1);
    } catch (err) {
      setError(err.response?.data?.message || "Could not cancel order");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border ${
              filter === f
                ? "bg-pink-600 text-white border-pink-600"
                : "bg-white text-gray-700 hover:border-pink-400"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {error && (
        <p className="mb-4 rounded bg-red-100 text-red-700 px-3 py-2 text-sm">{error}</p>
      )}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold">
                  #{order._id.slice(-6).toUpperCase()} ·{" "}
                  {order.user?.name || "Deleted user"}
                  <span className="text-sm font-normal text-gray-500">
                    {" "}({order.user?.email})
                  </span>
                </p>
                <StatusBadge status={order.status} />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {formatDate(order.createdAt)} · {order.shippingAddress.city}
              </p>
              <p className="text-sm mt-2">
                {order.items.map((i) => `${i.quantity} × ${i.name}`).join(", ")}
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <p className="font-bold">
                  ₹{order.totalPrice}{" "}
                  <span className="text-xs font-normal text-gray-500">
                    {order.paymentMethod} · {order.isPaid ? "Paid" : "Unpaid"}
                  </span>
                </p>
                <div className="flex gap-2">
                  {nextStatus[order.status] && (
                    <button
                      onClick={() => advance(order)}
                      disabled={busyId === order._id}
                      className="bg-pink-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-pink-700 disabled:opacity-60"
                    >
                      Mark as {nextStatus[order.status]}
                    </button>
                  )}
                  {order.status === "Placed" && (
                    <button
                      onClick={() => cancel(order)}
                      disabled={busyId === order._id}
                      className="text-sm px-4 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}