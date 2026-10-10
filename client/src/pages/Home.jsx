import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

const categories = ["All", "Classic", "Chocolate", "Fruity", "Special"];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // Wait until the user stops typing before searching
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Load products whenever a filter changes
  useEffect(() => {
    let ignore = false;
    const params = { sort, page, limit: 8 };
    if (debouncedSearch) params.search = debouncedSearch;
    if (category !== "All") params.category = category;

    api
      .get("/products", { params })
      .then((res) => {
        if (ignore) return;
        setProducts(res.data.products);
        setPages(res.data.pages);
        setError("");
      })
      .catch(() => {
        if (!ignore) setError("Could not load products. Is the server running?");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [debouncedSearch, category, sort, page]);

  const changeCategory = (c) => {
    setCategory(c);
    setPage(1);
  };

  const changeSort = (value) => {
    setSort(value);
    setPage(1);
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-pink-600">Our Flavors 🍦</h1>
        <p className="text-gray-600 mt-1">Pick your favorite scoop</p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-4">
        <input
          type="text"
          placeholder="Search flavors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-72 border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
        <select
          value={sort}
          onChange={(e) => changeSort(e.target.value)}
          className="border rounded-lg px-3 py-2 bg-white"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
          <option value="rating">Top rated</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => changeCategory(c)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border ${
              category === c
                ? "bg-pink-600 text-white border-pink-600"
                : "bg-white text-gray-700 hover:border-pink-400"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {error && (
        <p className="mb-4 rounded bg-red-100 text-red-700 px-3 py-2 text-sm">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-center text-gray-500 py-10">Loading flavors...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No flavors found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border bg-white disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {pages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === pages}
            className="px-4 py-2 rounded-lg border bg-white disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}