import { Link } from "react-router-dom";
import ProductImage from "../components/ProductImage";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-5xl mb-4">🛒</p>
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <Link
          to="/"
          className="inline-block mt-4 bg-pink-600 text-white px-5 py-2 rounded-lg hover:bg-pink-700"
        >
          Browse flavors
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-pink-600 mb-6">Your Cart</h1>

      <div className="bg-white rounded-xl shadow-sm divide-y">
        {items.map((item) => (
          <div key={item.product} className="flex flex-wrap items-center gap-4 p-4">
            <div className="w-20 shrink-0 rounded-lg overflow-hidden">
              <ProductImage product={item} className="h-20" emojiSize="text-3xl" />
            </div>

            <div className="flex-1 min-w-32">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500">₹{item.price} each</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.product, item.quantity - 1)}
                className="w-8 h-8 rounded border hover:border-pink-400"
              >
                −
              </button>
              <span className="w-6 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.product, item.quantity + 1)}
                className="w-8 h-8 rounded border hover:border-pink-400"
              >
                +
              </button>
            </div>

            <p className="w-20 text-right font-semibold">
              ₹{item.price * item.quantity}
            </p>

            <button
              onClick={() => removeFromCart(item.product)}
              className="text-sm text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-xl font-bold">Total: ₹{subtotal}</p>
        <Link
          to="/checkout"
          className="bg-pink-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-pink-700"
        >
          Proceed to checkout
        </Link>
      </div>
    </div>
  );
}
