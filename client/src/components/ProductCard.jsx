// import { Link } from "react-router-dom";
// import ProductImage from "./ProductImage";
// import { useCart } from "../context/CartContext";

// export default function ProductCard({ product }) {
//   const { addToCart, items } = useCart();
//   const soldOut = !product.isAvailable || product.stock === 0;
//   const inCart = items.find((i) => i.product === product._id);
//   const atMax = inCart && inCart.quantity >= Math.min(product.stock, 20);

//   return (
//     <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
//       <Link to={`/product/${product._id}`}>
//         <ProductImage product={product} className="h-40" emojiSize="text-6xl" />
//       </Link>

//       <div className="p-4 flex flex-col flex-1">
//         <span className="text-xs font-medium text-strawberry">{product.category}</span>
//         <Link
//           to={`/product/${product._id}`}
//           className="font-semibold mt-1 hover:text-strawberry"
//         >
//           {product.name}
//         </Link>
//         <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>

//         <div className="mt-auto pt-4 flex items-center justify-between">
//           <span className="text-lg font-bold">₹{product.price}</span>
//           {soldOut ? (
//             <span className="text-xs font-medium bg-gray-200 text-gray-600 px-2 py-1 rounded">
//               Sold out
//             </span>
//           ) : product.stock <= 5 ? (
//             <span className="text-xs font-medium text-orange-600">
//               Only {product.stock} left
//             </span>
//           ) : null}
//         </div>

//         <button
//           onClick={() => addToCart(product)}
//           disabled={soldOut || atMax}
//           className="mt-3 w-full bg-strawberry text-white py-2 rounded-lg text-sm font-medium hover:bg-strawberry-dark disabled:opacity-40 disabled:cursor-not-allowed"
//         >
//           {soldOut ? "Sold out" : atMax ? "Max in cart" : "Add to cart"}
//         </button>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { Link } from "react-router-dom";
import ProductImage from "./ProductImage";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart, items } = useCart();
  const [popped, setPopped] = useState(false);
  const soldOut = !product.isAvailable || product.stock === 0;
  const inCart = items.find((i) => i.product === product._id);
  const atMax = inCart && inCart.quantity >= Math.min(product.stock, 20);

  const handleAdd = () => {
    addToCart(product);
    setPopped(true);
  };

  return (
    <div className="bg-white rounded-[2rem] p-5 text-center shadow-sm hover:shadow-lg transition-shadow flex flex-col items-center h-full">
      <Link
        to={`/product/${product._id}`}
        className="block rounded-full bg-blush p-2 hover-wobble"
      >
        <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden">
          <ProductImage product={product} className="h-32 md:h-36" emojiSize="text-6xl" />
        </div>
      </Link>

      <span className="mt-4 text-xs font-bold uppercase tracking-wide text-strawberry">
        {product.category}
      </span>
      <Link
        to={`/product/${product._id}`}
        className="font-display text-xl font-semibold mt-1 hover:text-strawberry"
      >
        {product.name}
      </Link>
      <p className="text-sm text-choco/70 mt-1 line-clamp-2">{product.description}</p>

      <div className="mt-auto w-full pt-3">
        <div className="flex items-center justify-center gap-2">
          <span className="font-display text-xl font-bold">₹{product.price}</span>
          {soldOut ? (
            <span className="text-xs font-semibold bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
              Sold out
            </span>
          ) : product.stock <= 5 ? (
            <span className="text-xs font-semibold text-orange-600">
              Only {product.stock} left
            </span>
          ) : null}
        </div>

        <button
          onClick={handleAdd}
          onAnimationEnd={() => setPopped(false)}
          disabled={soldOut || atMax}
          className={`mt-3 w-full rounded-full bg-strawberry text-white font-display font-semibold py-2 hover:bg-strawberry-dark disabled:opacity-40 disabled:cursor-not-allowed ${
            popped ? "animate-pop" : ""
          }`}
        >
          {soldOut ? "Sold out" : atMax ? "Max in cart" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}