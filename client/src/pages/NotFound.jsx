import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="text-center py-16">
      <p className="text-6xl mb-4">🍨</p>
      <h1 className="text-3xl font-bold text-pink-600">Page not found</h1>
      <p className="text-gray-600 mt-2">This scoop seems to have melted away.</p>
      <Link
        to="/"
        className="inline-block mt-6 bg-pink-600 text-white px-5 py-2 rounded-lg hover:bg-pink-700"
      >
        Back to flavors
      </Link>
    </div>
  );
}