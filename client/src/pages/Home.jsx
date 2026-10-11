// import { useEffect, useState } from "react";
// import api from "../api/axios";
// import ProductCard from "../components/ProductCard";

// const categories = ["All", "Classic", "Chocolate", "Fruity", "Special"];

// export default function Home() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [search, setSearch] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [category, setCategory] = useState("All");
//   const [sort, setSort] = useState("newest");
//   const [page, setPage] = useState(1);
//   const [pages, setPages] = useState(1);

//   // Wait until the user stops typing before searching
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(search);
//       setPage(1);
//     }, 400);
//     return () => clearTimeout(timer);
//   }, [search]);

//   // Load products whenever a filter changes
//   useEffect(() => {
//     let ignore = false;
//     const params = { sort, page, limit: 8 };
//     if (debouncedSearch) params.search = debouncedSearch;
//     if (category !== "All") params.category = category;

//     api
//       .get("/products", { params })
//       .then((res) => {
//         if (ignore) return;
//         setProducts(res.data.products);
//         setPages(res.data.pages);
//         setError("");
//       })
//       .catch(() => {
//         if (!ignore) setError("Could not load products. Is the server running?");
//       })
//       .finally(() => {
//         if (!ignore) setLoading(false);
//       });

//     return () => {
//       ignore = true;
//     };
//   }, [debouncedSearch, category, sort, page]);

//   const changeCategory = (c) => {
//     setCategory(c);
//     setPage(1);
//   };

//   const changeSort = (value) => {
//     setSort(value);
//     setPage(1);
//   };

//   return (
//     <div>
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold text-strawberry">Our Flavors 🍦</h1>
//         <p className="text-gray-600 mt-1">Pick your favorite scoop</p>
//       </div>

//       <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-4">
//         <input
//           type="text"
//           placeholder="Search flavors..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-full md:w-72 border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-strawberry/40"
//         />
//         <select
//           value={sort}
//           onChange={(e) => changeSort(e.target.value)}
//           className="border rounded-lg px-3 py-2 bg-white"
//         >
//           <option value="newest">Newest</option>
//           <option value="price_asc">Price: low to high</option>
//           <option value="price_desc">Price: high to low</option>
//           <option value="rating">Top rated</option>
//         </select>
//       </div>

//       <div className="flex flex-wrap gap-2 mb-6">
//         {categories.map((c) => (
//           <button
//             key={c}
//             onClick={() => changeCategory(c)}
//             className={`px-4 py-1.5 rounded-full text-sm font-medium border ${
//               category === c
//                 ? "bg-strawberry text-white border-strawberry"
//                 : "bg-white text-gray-700 hover:border-strawberry"
//             }`}
//           >
//             {c}
//           </button>
//         ))}
//       </div>

//       {error && (
//         <p className="mb-4 rounded bg-red-100 text-red-700 px-3 py-2 text-sm">
//           {error}
//         </p>
//       )}

//       {loading ? (
//         <p className="text-center text-gray-500 py-10">Loading flavors...</p>
//       ) : products.length === 0 ? (
//         <p className="text-center text-gray-500 py-10">No flavors found.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {products.map((p) => (
//             <ProductCard key={p._id} product={p} />
//           ))}
//         </div>
//       )}

//       {pages > 1 && (
//         <div className="flex items-center justify-center gap-4 mt-8">
//           <button
//             onClick={() => setPage(page - 1)}
//             disabled={page === 1}
//             className="px-4 py-2 rounded-lg border bg-white disabled:opacity-40"
//           >
//             Previous
//           </button>
//           <span className="text-sm text-gray-600">
//             Page {page} of {pages}
//           </span>
//           <button
//             onClick={() => setPage(page + 1)}
//             disabled={page === pages}
//             className="px-4 py-2 rounded-lg border bg-white disabled:opacity-40"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

const categories = ["All", "Classic", "Chocolate", "Fruity", "Special"];
const fieldClass =
  "border-2 border-blush rounded-full px-4 py-2 bg-white focus:outline-none focus:border-strawberry";

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

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
      <section className="relative overflow-hidden rounded-[2.5rem] bg-strawberry text-white px-6 py-10 md:px-14 md:py-14 mb-12">
        <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 right-1/3 w-64 h-64 rounded-full bg-blush/20" />

        <div className="relative grid md:grid-cols-2 items-center gap-6">
          <div>
            <p className="font-script text-xl text-blush">Made with love, served with joy!</p>
            <h1 className="font-display text-6xl md:text-8xl font-bold leading-none mt-2">
              SCOOP
              <br />
              CART
            </h1>
            <p className="mt-4 max-w-md text-white/90">
              Creamy, dreamy ice cream delivered to your door. Pick your flavors,
              we'll scoop the rest.
            </p>
            <a
              href="#flavors"
              className="inline-block mt-6 rounded-full bg-sky text-choco font-display font-semibold px-7 py-3 hover:scale-105 transition"
            >
              Order now 🛒
            </a>
          </div>

          <div className="flex justify-center">
            <span
              className="text-[9rem] md:text-[13rem] leading-none animate-float select-none"
              role="img"
              aria-label="ice cream cone"
            >
              🍦
            </span>
          </div>
        </div>
      </section>

      <div id="flavors" className="scroll-mt-6">
        <div className="text-center mb-8">
          <h2 className="font-display text-4xl font-bold text-strawberry">
            Choose your favorite
          </h2>
          <p className="font-script text-xl text-choco/70 mt-1">Pick your favorite scoop</p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-4">
          <input
            type="text"
            placeholder="Search flavors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full md:w-72 ${fieldClass}`}
          />
          <select
            value={sort}
            onChange={(e) => changeSort(e.target.value)}
            className={fieldClass}
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => changeCategory(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border-2 ${
                category === c
                  ? "bg-strawberry text-white border-strawberry"
                  : "bg-white text-choco border-blush hover:border-strawberry"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {error && (
          <p className="mb-4 rounded-xl bg-red-100 text-red-700 px-3 py-2 text-sm">{error}</p>
        )}

        {loading ? (
          <p className="text-center text-choco/60 py-10">Scooping flavors...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-choco/60 py-10">No flavors found.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}

        {pages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-5 py-2 rounded-full border-2 border-blush bg-white font-semibold disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm text-choco/70">
              Page {page} of {pages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === pages}
              className="px-5 py-2 rounded-full border-2 border-blush bg-white font-semibold disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}