import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-pink-600">
          ScoopCart 🍦
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative text-sm font-medium hover:text-pink-600">
            🛒 Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-4 bg-pink-600 text-white text-xs rounded-full px-1.5">
                {itemCount}
              </span>
            )}
          </Link>

          {loading ? null : user ? (
            <>
              <span className="text-sm text-gray-600">Hi, {user.name}</span>
              <button
                onClick={logout}
                className="text-sm font-medium text-pink-600 hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium hover:text-pink-600">
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}