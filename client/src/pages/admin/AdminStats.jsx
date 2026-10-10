import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminStats() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/orders/stats")
      .then((res) => setStats(res.data))
      .catch(() => setError("Could not load stats"));
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!stats) return <p className="text-gray-500">Loading...</p>;

  const cards = [
    { label: "Revenue", value: `₹${stats.revenue}` },
    { label: "Orders (excluding cancelled)", value: stats.orders },
    { label: "Placed", value: stats.byStatus.Placed || 0 },
    { label: "Delivered", value: stats.byStatus.Delivered || 0 },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className="text-2xl font-bold mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mt-6">
        <h2 className="font-semibold mb-3">Top flavors</h2>
        {stats.topProducts.length === 0 ? (
          <p className="text-sm text-gray-500">No orders yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-1">Flavor</th>
                <th className="py-1">Scoops sold</th>
                <th className="py-1">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {stats.topProducts.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="py-2">{p._id}</td>
                  <td className="py-2">{p.quantity}</td>
                  <td className="py-2">₹{p.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}