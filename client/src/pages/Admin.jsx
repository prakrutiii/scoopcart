import { useState } from "react";
import AdminStats from "./admin/AdminStats";
import AdminProducts from "./admin/AdminProducts";
import AdminOrders from "./admin/AdminOrders";

const tabs = ["Overview", "Products", "Orders"];

export default function Admin() {
  const [tab, setTab] = useState("Overview");

  return (
    <div>
      <h1 className="text-2xl font-bold text-strawberry mb-4">Admin Panel</h1>

      <div className="flex gap-2 mb-6 border-b">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium -mb-px border-b-2 ${
              tab === t
                ? "border-strawberry text-strawberry"
                : "border-transparent text-gray-600 hover:text-strawberry"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && <AdminStats />}
      {tab === "Products" && <AdminProducts />}
      {tab === "Orders" && <AdminOrders />}
    </div>
  );
}