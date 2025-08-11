"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHeart,
  FaShoppingCart,
  FaStar,
  FaFilter,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaSortAmountDown,
} from "react-icons/fa";
import { allProducts } from "@/data/allProducts";
import FadeUp from "@/components/FadeUp";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  removeItem,
  increaseQuantity,
  decreaseQuantity,
  selectCartItems,
} from "@/redux/slices/cartSlice";
export default function ProductsPage() {
  // Full product list (allProducts should be in src/data/allProducts.js)
  const products = allProducts;

  // UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [q, setQ] = useState("");

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sort, setSort] = useState("relevance");
  const [onlyInStock, setOnlyInStock] = useState(false);

  // Derived filter options
  const categories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category))).sort();
  }, [products]);

  const sizes = useMemo(() => {
    return Array.from(new Set(products.flatMap((p) => p.sizes || []))).sort();
  }, [products]);

  const colors = useMemo(() => {
    return Array.from(new Set(products.flatMap((p) => p.colors || [])));
  }, [products]);

  const materials = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.material))).filter(Boolean);
  }, [products]);

  const tags = useMemo(() => {
    return Array.from(new Set(products.flatMap((p) => p.tags || [])));
  }, [products]);

  // Filtering logic
  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase();

    let res = products.filter((p) => {
      if (onlyInStock && (!p.stock || p.stock <= 0)) return false;

      // Search
      if (qLower) {
        const hay = (
          p.title +
          " " +
          (p.description || "") +
          " " +
          (p.tags || []).join(" ")
        ).toLowerCase();
        if (!hay.includes(qLower)) return false;
      }

      // Category
      if (selectedCategories.length && !selectedCategories.includes(p.category))
        return false;

      // Sizes
      if (
        selectedSizes.length &&
        !(p.sizes || []).some((s) => selectedSizes.includes(s))
      )
        return false;

      // Colors
      if (
        selectedColors.length &&
        !(p.colors || []).some((c) => selectedColors.includes(c))
      )
        return false;

      // Materials
      if (selectedMaterials.length && !selectedMaterials.includes(p.material))
        return false;

      // Tags
      if (
        selectedTags.length &&
        !(p.tags || []).some((t) => selectedTags.includes(t))
      )
        return false;

      // Price
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;

      return true;
    });

    // Sorting
    if (sort === "price-asc") res = res.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") res = res.sort((a, b) => b.price - a.price);
    else if (sort === "rating") res = res.sort((a, b) => b.rating - a.rating);
    // relevance keeps original order

    return res;
  }, [
    products,
    q,
    selectedCategories,
    selectedSizes,
    selectedColors,
    selectedMaterials,
    selectedTags,
    priceRange,
    sort,
    onlyInStock,
  ]);

  // Helpers: toggle multi-selects
  function toggle(arrSetter, prev) {
    return (val) => {
      arrSetter((cur) =>
        cur.includes(val) ? cur.filter((x) => x !== val) : [...cur, val]
      );
    };
  }

  const toggleCategory = toggle(setSelectedCategories, selectedCategories);
  const toggleSize = toggle(setSelectedSizes, selectedSizes);
  const toggleColor = toggle(setSelectedColors, selectedColors);
  const toggleMaterial = toggle(setSelectedMaterials, selectedMaterials);
  const toggleTag = toggle(setSelectedTags, selectedTags);

  // Reset filters
  function resetAll() {
    setQ("");
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedMaterials([]);
    setSelectedTags([]);
    setPriceRange([0, 10000]);
    setOnlyInStock(false);
    setSort("relevance");
  }

  // Price slider helpers (simple inputs)
  function handleMinChange(v) {
    setPriceRange(([_, max]) => [
      Math.max(0, Math.min(Number(v) || 0, max)),
      max,
    ]);
  }
  function handleMaxChange(v) {
    setPriceRange(([min, _]) => [min, Math.max(min, Number(v) || min)]);
  }

  // Accessibility: close sidebar on Escape
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setIsSidebarOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b text-black from-white to-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with search + controls */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open filters"
            className="inline-flex items-center gap-2 p-2 rounded-xl bg-white shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            <FaFilter />
            <span className="hidden sm:inline">Filters</span>
          </button>

          <div className="flex items-center flex-1 bg-white rounded-xl shadow-sm px-3 py-2 gap-2">
            <FaSearch className="text-gray-400" />
            <input
              placeholder="Search products, tags, description..."
              className="flex-1 bg-transparent outline-none text-sm sm:text-base"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Search products"
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="ml-2 text-sm rounded-md border border-gray-200 px-2 py-1"
              aria-label="Sort products"
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          <button
            onClick={() => resetAll()}
            className="ml-auto hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white shadow-sm hover:shadow-md transition text-sm"
          >
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Desktop Sidebar (always visible on lg) */}
          <aside className="hidden lg:block sticky top-6 self-start">
            <div className="bg-white rounded-2xl p-5 shadow-md w-80">
              <SidebarContent
                categories={categories}
                sizes={sizes}
                colors={colors}
                materials={materials}
                tags={tags}
                selectedCategories={selectedCategories}
                selectedSizes={selectedSizes}
                selectedColors={selectedColors}
                selectedMaterials={selectedMaterials}
                selectedTags={selectedTags}
                toggleCategory={toggleCategory}
                toggleSize={toggleSize}
                toggleColor={toggleColor}
                toggleMaterial={toggleMaterial}
                toggleTag={toggleTag}
                priceRange={priceRange}
                handleMinChange={handleMinChange}
                handleMaxChange={handleMaxChange}
                onlyInStock={onlyInStock}
                setOnlyInStock={setOnlyInStock}
                resetAll={resetAll}
              />
            </div>
          </aside>

          {/* Main content */}
          <main>
            {/* Mobile: Animated Sidebar Drawer */}
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40 lg:hidden"
                >
                  <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="absolute inset-0 bg-black/30"
                    aria-hidden
                  />

                  <motion.div
                    initial={{ x: -320 }}
                    animate={{ x: 0 }}
                    exit={{ x: -320 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl p-5 overflow-auto"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Filters</h3>
                      <button
                        aria-label="Close filters"
                        onClick={() => setIsSidebarOpen(false)}
                        className="p-2 rounded-md hover:bg-gray-100"
                      >
                        <FaTimes />
                      </button>
                    </div>

                    <SidebarContent
                      categories={categories}
                      sizes={sizes}
                      colors={colors}
                      materials={materials}
                      tags={tags}
                      selectedCategories={selectedCategories}
                      selectedSizes={selectedSizes}
                      selectedColors={selectedColors}
                      selectedMaterials={selectedMaterials}
                      selectedTags={selectedTags}
                      toggleCategory={toggleCategory}
                      toggleSize={toggleSize}
                      toggleColor={toggleColor}
                      toggleMaterial={toggleMaterial}
                      toggleTag={toggleTag}
                      priceRange={priceRange}
                      handleMinChange={handleMinChange}
                      handleMaxChange={handleMaxChange}
                      onlyInStock={onlyInStock}
                      setOnlyInStock={setOnlyInStock}
                      resetAll={() => {
                        resetAll();
                        setIsSidebarOpen(false);
                      }}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Grid header */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filtered.length}</span>{" "}
                products
              </p>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-sm text-gray-500">
                  View
                </span>
                <div className="bg-white rounded-full p-1 shadow-sm flex items-center gap-1">
                  <button
                    className="p-2 rounded-md hover:bg-gray-100"
                    aria-label="List view"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    className="p-2 rounded-md hover:bg-gray-100"
                    aria-label="Grid view"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            </div>

            {/* Products grid */}
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 shadow text-center">
                <p className="text-gray-600 mb-3">
                  No products match your filters.
                </p>
                <button
                  onClick={resetAll}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                aria-live="polite"
              >
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function SidebarContent({
  categories,
  sizes,
  colors,
  materials,
  tags,
  selectedCategories,
  selectedSizes,
  selectedColors,
  selectedMaterials,
  selectedTags,
  toggleCategory,
  toggleSize,
  toggleColor,
  toggleMaterial,
  toggleTag,
  priceRange,
  handleMinChange,
  handleMaxChange,
  onlyInStock,
  setOnlyInStock,
  resetAll,
}) {
  return (
    <div className="space-y-5">
      <div>
        <h4 className="font-semibold text-gray-700 mb-2">Categories</h4>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => toggleCategory(c)}
              className={`px-3 py-1 rounded-full text-sm border transition-shadow ${
                selectedCategories.includes(c)
                  ? "bg-black text-white shadow-md"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
              aria-pressed={selectedCategories.includes(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-700 mb-2">Sizes</h4>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => toggleSize(s)}
              className={`px-3 py-1 rounded-full text-sm border transition ${
                selectedSizes.includes(s)
                  ? "bg-black text-white shadow-md"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
              aria-pressed={selectedSizes.includes(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-700 mb-2">Colors</h4>
        <div className="flex gap-2 flex-wrap">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => toggleColor(c)}
              title={c}
              className={`w-8 h-8 rounded-full border-2 transition-transform transform hover:scale-105 focus:outline-none`}
              style={{ backgroundColor: c }}
              aria-pressed={selectedColors.includes(c)}
            />
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-700 mb-2">Material</h4>
        <div className="flex flex-wrap gap-2">
          {materials.map((m) => (
            <button
              key={m}
              onClick={() => toggleMaterial(m)}
              className={`px-3 py-1 rounded-full text-sm border transition ${
                selectedMaterials.includes(m)
                  ? "bg-black text-white shadow-md"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
              aria-pressed={selectedMaterials.includes(m)}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-700 mb-2">Tags</h4>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => toggleTag(t)}
              className={`px-2 py-1 rounded-md text-sm border transition ${
                selectedTags.includes(t)
                  ? "bg-black text-white shadow-md"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              #{t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-700 mb-2">Price (₨)</h4>
        <div className="flex gap-2">
          <input
            type="number"
            min={0}
            value={priceRange[0]}
            onChange={(e) => handleMinChange(e.target.value)}
            className="w-1/2 rounded-md border border-gray-200 px-2 py-1 text-sm"
            aria-label="Minimum price"
          />
          <input
            type="number"
            min={0}
            value={priceRange[1]}
            onChange={(e) => handleMaxChange(e.target.value)}
            className="w-1/2 rounded-md border border-gray-200 px-2 py-1 text-sm"
            aria-label="Maximum price"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={onlyInStock}
            onChange={(e) => setOnlyInStock(e.target.checked)}
            className="w-4 h-4"
          />
          Only show in-stock
        </label>

        <button onClick={resetAll} className="text-sm underline">
          Reset
        </button>
      </div>
    </div>
  );
}

function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const mainImg = product.images?.[0] || "/images/placeholder.png";
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const dispatch = useDispatch();
  return (
    <FadeUp>
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col"
      >
        <div className="relative w-full aspect-[4/3] bg-gray-50 flex items-center justify-center">
          <Link
            href={`/products/${product.slug}`}
            className="w-full h-full block relative"
          >
            <Image
              src={hovered ? product.images[1] : product.images[0]}
              alt={product.title}
              fill
              className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority
            />
          </Link>

          <div className="absolute left-3 top-3 bg-white/90 px-2 py-1 rounded-full shadow flex items-center gap-2">
            <FaStar className="text-yellow-400" />
            <span className="text-sm font-semibold">
              {product.rating?.toFixed(1)}
            </span>
          </div>

          <button className="absolute right-3 top-3 bg-white/90 p-2 rounded-full shadow hover:bg-red-600 hover:text-white transition">
            <FaHeart />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-3 flex-1">
          <div>
            <h3
              className="text-sm sm:text-base font-semibold text-gray-900 truncate"
              title={product.title}
            >
              {product.title}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {product.category} • {product.material}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-lg font-extrabold">
              ₨ {product.price.toLocaleString()}
            </div>
            <div
              className={`text-xs px-2 py-1 rounded-full ${
                product.stock > 0
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-2 py-1 text-xs border rounded-full transition ${
                  selectedSize === size
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          <div className="flex items-center text-black justify-between mt-4">
            <div className="flex items-center border rounded-full overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-2 py-1 hover:bg-gray-200"
              >
                -
              </button>
              <span className="px-3 py-1">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-2 py-1 hover:bg-gray-200"
              >
                +
              </button>
            </div>

            <button
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full hover:bg-gray-900 transition"
              onClick={() => {
                dispatch(addItem(product));
                toast.success(`${product.title} added to cart!`);
              }}
            >
              <FaShoppingCart /> Add
            </button>
          </div>
        </div>
      </article>
    </FadeUp>
  );
}
