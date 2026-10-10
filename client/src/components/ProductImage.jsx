const emojiByCategory = {
  Classic: "🍦",
  Chocolate: "🍫",
  Fruity: "🍓",
  Special: "✨",
};

const bgByCategory = {
  Classic: "bg-amber-100",
  Chocolate: "bg-orange-200",
  Fruity: "bg-pink-100",
  Special: "bg-purple-100",
};

export default function ProductImage({ product, className = "h-40", emojiSize = "text-6xl" }) {
  if (product.image) {
    return (
      <img
        src={product.image}
        alt={product.name}
        className={`${className} w-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`${className} w-full flex items-center justify-center ${emojiSize} ${
        bgByCategory[product.category] || "bg-gray-100"
      }`}
    >
      {emojiByCategory[product.category] || "🍨"}
    </div>
  );
}