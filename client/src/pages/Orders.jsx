import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import StatusBadge from "../components/StatusBadge";
import { formatDate } from "../utils/format";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    api
      .get("/orders/myorders")
      .then((res) => {
        if (!ignore) setOrders(res.data);
      })
      .catch(() => {
        if (!ignore) setError("Could not load your orders");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  if (loading) return <p className="text-center text-gray-500 py-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-strawberry mb-6">My Orders</h1>

      {error && (
        <p className="mb-4 rounded bg-red-100 text-red-700 px-3 py-2 text-sm">{error}</p>
      )}

      {orders.length === 0 && !error ? (
        <div className="text-center py-12">
          <p className="text-gray-600">You haven't placed any orders yet.</p>
          <Link to="/" className="text-strawberry hover:underline">Browse flavors</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="block bg-white rounded-xl shadow-sm p-4 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold">Order #{order._id.slice(-6).toUpperCase()}</p>
                <StatusBadge status={order.status} />
              </div>
              <p className="text-sm text-gray-500 mt-1">{formatDate(order.createdAt)}</p>
              <p className="text-sm mt-2 text-gray-700">
                {order.items.map((i) => `${i.quantity} × ${i.name}`).join(", ")}
              </p>
              <p className="mt-2 font-bold">₹{order.totalPrice}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}