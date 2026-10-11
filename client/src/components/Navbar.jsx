// import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { useCart } from "../context/CartContext";

// export default function Navbar() {
//   const { user, loading, logout } = useAuth();
//   const { itemCount } = useCart();

//   return (
//     <header className="bg-white shadow-sm">
//       <nav className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-y-2">
//         <Link to="/" className="text-2xl font-bold text-strawberry">
//           ScoopCart 🍦
//         </Link>

//         <div className="flex flex-wrap items-center gap-4">
//           <Link to="/cart" className="relative text-sm font-medium hover:text-strawberry">
//             🛒 Cart
//             {itemCount > 0 && (
//               <span className="absolute -top-2 -right-4 bg-strawberry text-white text-xs rounded-full px-1.5">
//                 {itemCount}
//               </span>
//             )}
//           </Link>

//           {loading ? null : user ? (
//             <>
//               {user.role === "admin" && (
//                 <Link to="/admin" className="text-sm font-medium hover:text-strawberry">
//                   Admin
//                 </Link>
//               )}
//               <Link to="/orders" className="text-sm font-medium hover:text-strawberry">
//                 My Orders
//               </Link>
//               <span className="text-sm text-gray-600">Hi, {user.name}</span>
//               <button
//                 onClick={logout}
//                 className="text-sm font-medium text-strawberry hover:underline"
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <>
//               <Link to="/login" className="text-sm font-medium hover:text-strawberry">
//                 Login
//               </Link>
//               <Link
//                 to="/register"
//                 className="text-sm font-medium bg-strawberry text-white px-4 py-2 rounded-lg hover:bg-strawberry-dark"
//               >
//                 Sign up
//               </Link>
//             </>
//           )}
//         </div>
//       </nav>
//     </header>
//   );
// }

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import DripBorder from "./DripBorder";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const { itemCount } = useCart();
  const linkClass = "text-sm font-semibold hover:underline underline-offset-4";

  return (
    <>
      <header className="bg-strawberry text-white">
        <nav className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-y-2">
          <Link
            to="/"
            className="inline-block font-display text-3xl font-bold tracking-wide hover-wobble"
          >
            ScoopCart 🍦
          </Link>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/cart"
              className="relative rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold hover:bg-white/30"
            >
              🛒 Cart
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-sky text-choco text-xs font-bold rounded-full px-1.5 py-0.5">
                  {itemCount}
                </span>
              )}
            </Link>

            {loading ? null : user ? (
              <>
                {user.role === "admin" && (
                  <Link to="/admin" className={linkClass}>Admin</Link>
                )}
                <Link to="/orders" className={linkClass}>My Orders</Link>
                <span className="text-sm text-white/90">Hi, {user.name}</span>
                <button
                  onClick={logout}
                  className="rounded-full bg-sky text-choco text-sm font-semibold px-4 py-1.5 hover:scale-105 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={linkClass}>Login</Link>
                <Link
                  to="/register"
                  className="rounded-full bg-sky text-choco text-sm font-semibold px-4 py-1.5 hover:scale-105 transition"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <DripBorder className="text-strawberry" />
    </>
  );
}