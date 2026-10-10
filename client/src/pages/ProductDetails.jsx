import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import ProductImage from "../components/ProductImage";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let ignore = false;
    api
      .get(`/products/${id}`)
      .then((res) => {
        if (!ignore) setProduct(res.data);
      })
      .catch(() => {
        if (!ignore) setError("Product not found");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) return <p className="text-center text-gray-500 py-10">Loading...</p>;
  if (error || !product)
    return (
      <div className="text-center py-10">
        <p className="text-red-600">{error || "Product not found"}</p>
        <Link to="/" className="text-pink-600 hover:underline">Back to flavors</Link>
      </div>
    );

  const soldOut = !product.isAvailable || product.stock === 0;
  const maxQty = Math.min(product.stock, 20);

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/" className="text-sm text-pink-600 hover:underline">
        ← Back to flavors
      </Link>

      <div className="mt-4 bg-white rounded-xl shadow-sm overflow-hidden md:flex">
        <div className="md:w-1/2">
          <ProductImage product={product} className="h-64 md:h-full" emojiSize="text-8xl" />
        </div>

        <div className="p-6 md:w-1/2 flex flex-col">
          <span className="text-xs font-medium text-pink-600">{product.category}</span>
          <h1 className="text-2xl font-bold mt-1">{product.name}</h1>
          <p className="text-gray-600 mt-3">{product.description}</p>
          <p className="text-3xl font-bold mt-4">₹{product.price}</p>

          {soldOut ? (
            <p className="mt-4 text-sm font-medium text-gray-500">Currently sold out</p>
          ) : (
            <>
              <p className="mt-2 text-sm text-gray-500">{product.stock} in stock</p>

              <div className="mt-4 flex items-center gap-3">
                <label className="text-sm font-medium">Quantity</label>
                <select
                  value={qty}
                  onChange={(e) => {
                    setQty(Number(e.target.value));
                    setAdded(false);
                  }}
                  className="border rounded-lg px-3 py-1.5 bg-white"
                >
                  {Array.from({ length: maxQty }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAdd}
                className="mt-6 bg-pink-600 text-white py-2.5 rounded-lg font-medium hover:bg-pink-700"
              >
                Add to cart
              </button>

              {added && (
                <p className="mt-3 text-sm text-green-700">
                  Added to cart ✓{" "}
                  <Link to="/cart" className="underline">View cart</Link>
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}