const styles = {
  Placed: "bg-blue-100 text-blue-700",
  Preparing: "bg-yellow-100 text-yellow-700",
  "Out for delivery": "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`text-xs font-medium px-2 py-1 rounded-full ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}