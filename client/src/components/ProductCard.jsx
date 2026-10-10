import { Link } from "react-router-dom";
import ProductImage from "./ProductImage";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart, items } = useCart();
  const soldOut = !product.isAvailable || product.stock === 0;
  const inCart = items.find((i) => i.product === product._id);
  const atMax = inCart && inCart.quantity >= Math.min(product.stock, 20);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
      <Link to={`/product/${product._id}`}>
        <ProductImage product={product} className="h-40" emojiSize="text-6xl" />
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs font-medium text-pink-600">{product.category}</span>
        <Link
          to={`/product/${product._id}`}
          className="font-semibold mt-1 hover:text-pink-600"
        >
          {product.name}
        </Link>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-lg font-bold">₹{product.price}</span>
          {soldOut ? (
            <span className="text-xs font-medium bg-gray-200 text-gray-600 px-2 py-1 rounded">
              Sold out
            </span>
          ) : product.stock <= 5 ? (
            <span className="text-xs font-medium text-orange-600">
              Only {product.stock} left
            </span>
          ) : null}
        </div>

        <button
          onClick={() => addToCart(product)}
          disabled={soldOut || atMax}
          className="mt-3 w-full bg-pink-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-pink-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {soldOut ? "Sold out" : atMax ? "Max in cart" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}