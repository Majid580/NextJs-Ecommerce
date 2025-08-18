// src/app/products/page.jsx
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
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
  FaSearch,
  FaTh,
  FaBars,
  FaCheck,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { allProducts } from "@/data/allProducts";
import FadeUp from "@/components/FadeUp";
import { useDispatch } from "react-redux";
import { addItem } from "@/redux/slices/cartSlice";

export default function ProductsPage() {
  const products = allProducts;

  // UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("relevance");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"

  // Quick View modal
  const [quickView, setQuickView] = useState(null); // product or null

  // Filters
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);

  // Derived filter options
  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products]
  );
  const sizes = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.sizes || []))).sort(),
    [products]
  );
  const colors = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.colors || []))),
    [products]
  );
  const materials = useMemo(
    () => Array.from(new Set(products.map((p) => p.material))).filter(Boolean),
    [products]
  );
  const tags = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.tags || []))),
    [products]
  );

  // Filtering + sorting
  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase();

    let res = products.filter((p) => {
      if (onlyInStock && (!p.stock || p.stock <= 0)) return false;

      if (qLower) {
        const hay = [p.title, p.description, ...(p.tags || [])]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(qLower)) return false;
      }

      if (selectedCategories.length && !selectedCategories.includes(p.category))
        return false;

      if (
        selectedSizes.length &&
        !(p.sizes || []).some((s) => selectedSizes.includes(s))
      )
        return false;

      if (
        selectedColors.length &&
        !(p.colors || []).some((c) => selectedColors.includes(c))
      )
        return false;

      if (selectedMaterials.length && !selectedMaterials.includes(p.material))
        return false;

      if (
        selectedTags.length &&
        !(p.tags || []).some((t) => selectedTags.includes(t))
      )
        return false;

      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;

      return true;
    });

    if (sort === "price-asc") res = res.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") res = res.sort((a, b) => b.price - a.price);
    else if (sort === "rating")
      res = res.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    // relevance = original order

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

  // Helpers
  const toggle = (setter) => (val) =>
    setter((cur) =>
      cur.includes(val) ? cur.filter((x) => x !== val) : [...cur, val]
    );
  const toggleCategory = toggle(setSelectedCategories);
  const toggleSize = toggle(setSelectedSizes);
  const toggleColor = toggle(setSelectedColors);
  const toggleMaterial = toggle(setSelectedMaterials);
  const toggleTag = toggle(setSelectedTags);

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

  function handleMinChange(v) {
    setPriceRange(([_, max]) => [
      Math.max(0, Math.min(Number(v) || 0, max)),
      max,
    ]);
  }
  function handleMaxChange(v) {
    setPriceRange(([min, _]) => [min, Math.max(min, Number(v) || min)]);
  }

  // Close sidebar + modal on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setIsSidebarOpen(false);
        setQuickView(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock body scroll when Quick View open
  useEffect(() => {
    if (quickView) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [quickView]);

  // Active chips
  const activeChips = [
    ...selectedCategories.map((x) => ({ type: "category", value: x })),
    ...selectedSizes.map((x) => ({ type: "size", value: x })),
    ...selectedColors.map((x) => ({ type: "color", value: x })),
    ...selectedMaterials.map((x) => ({ type: "material", value: x })),
    ...selectedTags.map((x) => ({ type: "tag", value: x })),
    ...(onlyInStock ? [{ type: "stock", value: "In stock" }] : []),
    ...(q ? [{ type: "search", value: q }] : []),
    ...(priceRange[0] !== 0 || priceRange[1] !== 10000
      ? [{ type: "price", value: `₨ ${priceRange[0]}–${priceRange[1]}` }]
      : []),
  ];

  const removeChip = (chip) => {
    if (chip.type === "category")
      setSelectedCategories((s) => s.filter((v) => v !== chip.value));
    if (chip.type === "size")
      setSelectedSizes((s) => s.filter((v) => v !== chip.value));
    if (chip.type === "color")
      setSelectedColors((s) => s.filter((v) => v !== chip.value));
    if (chip.type === "material")
      setSelectedMaterials((s) => s.filter((v) => v !== chip.value));
    if (chip.type === "tag")
      setSelectedTags((s) => s.filter((v) => v !== chip.value));
    if (chip.type === "stock") setOnlyInStock(false);
    if (chip.type === "search") setQ("");
    if (chip.type === "price") setPriceRange([0, 10000]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-black p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {/* Ensure visible everywhere */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open filters"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-black/20"
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
            <div className="hidden sm:flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="w-4 h-4"
                />
                In stock
              </label>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="text-sm rounded-md border border-gray-200 px-2 py-1"
                aria-label="Sort products"
              >
                <option value="relevance">Sort: Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-2 bg-white rounded-xl shadow-sm p-1">
            <button
              className={`p-2 rounded-lg ${
                viewMode === "grid" ? "bg-gray-100" : "hover:bg-gray-100"
              }`}
              aria-label="Grid view"
              onClick={() => setViewMode("grid")}
            >
              <FaTh />
            </button>
            <button
              className={`p-2 rounded-lg ${
                viewMode === "list" ? "bg-gray-100" : "hover:bg-gray-100"
              }`}
              aria-label="List view"
              onClick={() => setViewMode("list")}
            >
              <FaBars />
            </button>
          </div>

          <button
            onClick={resetAll}
            className="ml-auto hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white shadow-sm hover:shadow-md transition text-sm"
          >
            Reset
          </button>
        </div>

        {/* Active filter chips */}
        {activeChips.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {activeChips.map((chip, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-white border border-gray-200 shadow-sm"
              >
                {chip.value}
                <button
                  onClick={() => removeChip(chip)}
                  className="p-1 rounded hover:bg-gray-100"
                  aria-label={`Remove ${chip.type}`}
                >
                  <FaTimes className="text-xs" />
                </button>
              </span>
            ))}
            <button
              onClick={resetAll}
              className="text-sm underline underline-offset-4 text-gray-600 hover:text-gray-900"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Desktop Sidebar */}
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
                sort={sort}
                setSort={setSort}
              />
            </div>
          </aside>

          {/* Main */}
          <main>
            {/* Mobile Drawer */}
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
                      sort={sort}
                      setSort={setSort}
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
              <div className="sm:hidden flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="w-4 h-4"
                  />
                  In stock
                </label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="text-sm rounded-md border border-gray-200 px-2 py-1"
                  aria-label="Sort products"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-asc">Price ↑</option>
                  <option value="price-desc">Price ↓</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Products */}
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
            ) : viewMode === "grid" ? (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                aria-live="polite"
              >
                {filtered.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    mode="grid"
                    onQuickView={() => setQuickView(p)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4" aria-live="polite">
                {filtered.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    mode="list"
                    onQuickView={() => setQuickView(p)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Floating mobile Filters button (always visible on small screens) */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open filters"
        className="fixed bottom-5 right-5 z-50 sm:hidden inline-flex items-center gap-2 px-4 py-3 rounded-full shadow-xl bg-black text-white hover:bg-gray-900 active:scale-95"
      >
        <FaFilter />
        Filters
      </button>

      {/* Quick View Modal */}
      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </div>
  );
}

/* ---------- Sidebar ---------- */

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
  sort,
  setSort,
}) {
  return (
    <div className="space-y-6">
      {/* Sort */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-800">Sort</label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="text-sm rounded-md border border-gray-200 px-2 py-1"
        >
          <option value="relevance">Relevance</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      <FacetPills
        title="Categories"
        options={categories}
        selected={selectedCategories}
        toggle={toggleCategory}
      />
      <FacetPills
        title="Sizes"
        options={sizes}
        selected={selectedSizes}
        toggle={toggleSize}
      />

      <div>
        <h4 className="font-semibold text-gray-800 mb-2">Colors</h4>
        <div className="flex gap-2 flex-wrap">
          {colors.map((c) => {
            const selected = selectedColors.includes(c);
            return (
              <button
                key={c}
                onClick={() => toggleColor(c)}
                title={c}
                className={`relative w-8 h-8 rounded-full border-2 transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-black/10 ${
                  selected ? "border-gray-900" : "border-gray-300"
                }`}
                style={{ backgroundColor: c }}
                aria-pressed={selected}
              >
                {selected && (
                  <span className="absolute -right-1 -bottom-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-900 text-white">
                    <FaCheck className="text-[10px]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <FacetPills
        title="Material"
        options={materials}
        selected={selectedMaterials}
        toggle={toggleMaterial}
      />
      <FacetPills
        title="Tags"
        options={tags}
        selected={selectedTags}
        toggle={toggleTag}
        pillPrefix="#"
      />

      <div>
        <h4 className="font-semibold text-gray-800 mb-2">Price (₨)</h4>
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
        <label className="flex items-center gap-2 text-sm text-gray-800">
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

function FacetPills({ title, options, selected, toggle, pillPrefix = "" }) {
  return (
    <div>
      <h4 className="font-semibold text-gray-800 mb-2">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => toggle(opt)}
            className={`px-3 py-1 rounded-full text-sm border transition-shadow focus:outline-none focus:ring-2 focus:ring-black/10
              ${
                selected.includes(opt)
                  ? "bg-black text-white shadow-md"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            aria-pressed={selected.includes(opt)}
          >
            {pillPrefix}
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Product Card ---------- */

function ProductCard({ product, mode = "grid", onQuickView }) {
  const dispatch = useDispatch();
  const [hovered, setHovered] = useState(false);
  const [wish, setWish] = useState(false);

  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const colors = product.colors?.length
    ? product.colors
    : ["#000000", "#FF0000", "#0000FF"];
  const sizes = product.sizes?.length ? product.sizes : [];
  const lowStock = product.stock > 0 && product.stock <= 10;

  const canAddToCart =
    product.stock > 0 &&
    (colors.length === 0 || selectedColor !== null) &&
    (sizes.length === 0 || selectedSize !== null);

  const handleAddToCart = () => {
    if (!canAddToCart) {
      if (colors.length > 0 && selectedColor === null) {
        toast.error("Please select a color first!");
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 1300);
        return;
      }
      if (sizes.length > 0 && !selectedSize) {
        toast.error("Please select a size first!");
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 1300);
        return;
      }
      toast.error("Please select all required options.");
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 1300);
      return;
    }

    setAddingToCart(true);
    dispatch(
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        stock: product.stock,
        sku: product.sku,
        images: product.images,
        size: selectedSize,
        color: selectedColor,
        quantity,
      })
    );
    toast.success(`${product.title} added to cart!`);
    setTimeout(() => setAddingToCart(false), 800);
  };

  if (mode === "list") {
    // Horizontal layout (image lowered)
    return (
      <FadeUp>
        <article
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
        >
          <div className="grid grid-cols-[160px_1fr] gap-4 p-4">
            <Link
              href={`/products/${product.slug}`}
              className="relative w-full aspect-[4/3] bg-gray-50 rounded-lg overflow-hidden pt-4 pb-2"
            >
              <Image
                src={
                  hovered && product.images[1]
                    ? product.images[1]
                    : product.images[0]
                }
                alt={product.title}
                fill
                className="object-contain px-3 pt-1 pb-3 object-[center_60%] translate-y-1 transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 40vw, (max-width: 1024px) 25vw, 200px"
              />
            </Link>

            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div>
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="text-base font-semibold text-gray-900 hover:underline line-clamp-1">
                      {product.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {product.category} • {product.material}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setWish((w) => !w)}
                    aria-label="Add to wishlist"
                    className={`p-2 rounded-full shadow transition
                      ${
                        wish
                          ? "bg-rose-500 text-white"
                          : "bg-white hover:bg-rose-500 hover:text-white"
                      }`}
                  >
                    <FaHeart />
                  </button>
                  <button
                    onClick={onQuickView}
                    className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm"
                  >
                    <FaEye className="inline mr-2" />
                    Quick view
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {product.rating && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-[11px] font-semibold border border-yellow-200">
                    <FaStar className="text-yellow-500" />
                    {Number(product.rating).toFixed(1)}
                  </span>
                )}
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    product.stock === 0
                      ? "bg-red-100 text-red-700"
                      : lowStock
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {product.stock === 0
                    ? "Out of stock"
                    : lowStock
                    ? `Only ${product.stock} left`
                    : "In stock"}
                </span>
              </div>

              {/* Minimal selectors */}
              <div className="mt-1 flex items-center justify-between">
                <p className="text-lg font-bold text-gray-900">
                  ₨ {product.price.toLocaleString()}
                </p>

                <div className="relative">
                  <button
                    onClick={onQuickView}
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm border border-gray-200 hover:bg-gray-50"
                  >
                    <FaEye />
                    Quick view
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>
      </FadeUp>
    );
  }

  // Grid layout (image lowered)
  return (
    <FadeUp>
      <motion.article
        whileHover={{ y: -3 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
      >
        {/* Media */}
        <div className="relative w-full aspect-[4/3] bg-gray-50 pt-6 pb-2 border-b border-gray-100">
          <Link
            href={`/products/${product.slug}`}
            className="block w-full h-full"
          >
            <Image
              src={
                hovered && product.images[1]
                  ? product.images[1]
                  : product.images[0]
              }
              alt={product.title}
              fill
              className="object-contain px-5 pt-2 pb-5 object-[center_60%] translate-y-1 sm:translate-y-2 transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </Link>

          {/* Badges */}
          <div className="absolute left-0 top-2 flex items-center gap-1.5 scale-70">
            {product.rating && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-[11px] font-semibold border border-yellow-200">
                <FaStar className="text-yellow-500" />
                {Number(product.rating).toFixed(1)}
              </span>
            )}
            <span
              className={`text-[11px] px-2 py-1 rounded-full ${
                product.stock === 0
                  ? "bg-red-100 text-red-700"
                  : product.stock > 0 && product.stock <= 10
                  ? "bg-amber-100 text-amber-800"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {product.stock === 0
                ? "Out of stock"
                : product.stock > 0 && product.stock <= 10
                ? `Only ${product.stock} left`
                : "In stock"}
            </span>
          </div>

          {/* Wishlist + Quick view */}
          <div className="absolute right-0 top-2 flex gap-1.5 scale-70">
            <button
              onClick={() => setWish((w) => !w)}
              aria-label="Add to wishlist"
              className={`p-2 rounded-full shadow transition
                ${
                  wish
                    ? "bg-rose-500 text-white"
                    : "bg-white hover:bg-rose-500 hover:text-white"
                }`}
            >
              <FaHeart />
            </button>
            <button
              onClick={onQuickView}
              aria-label="Quick view"
              className="p-2 rounded-full shadow bg-white hover:bg-gray-900 hover:text-white transition"
            >
              <FaEye />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-5 flex flex-col gap-4 flex-1">
          <div>
            <Link
              href={`/products/${product.slug}`}
              className="hover:underline underline-offset-4 decoration-gray-300"
            >
              <h3
                className="text-base font-semibold text-gray-900 line-clamp-1"
                title={product.title}
              >
                {product.title}
              </h3>
            </Link>
            <p className="text-xs text-gray-500 mt-1">
              {product.category} • {product.material}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">
              ₨ {product.price.toLocaleString()}
            </span>
          </div>

          {/* Minimal selectors (encourage Quick View for full details) */}
          <div className="flex items-center justify-between mt-auto">
            <Link
              href={`/products/${product.slug}`}
              className="text-sm text-gray-700 hover:text-gray-900 hover:underline underline-offset-4"
            >
              View details
            </Link>
            <button
              onClick={onQuickView}
              className="text-sm rounded-md border border-gray-200 px-3 py-1.5 hover:bg-gray-50"
            >
              Quick view
            </button>
          </div>
        </div>
      </motion.article>
    </FadeUp>
  );
}

/* ---------- Quick View Modal ---------- */

function QuickViewModal({ product, onClose }) {
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);
  const [wish, setWish] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const backdropRef = useRef(null);

  useEffect(() => {
    if (!product) return;
    setIndex(0);
    setWish(false);
    setQuantity(1);
    setSelectedSize(product.sizes?.[0] || null);
    setSelectedColor(null);
  }, [product]);

  // Keyboard navigation for carousel
  useEffect(() => {
    if (!product) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [product, index]);

  if (!product) return null;

  const images = product.images || [];
  const sizes = product.sizes || [];
  const colors = product.colors || [];
  const lowStock = product.stock > 0 && product.stock <= 10;

  function next() {
    setIndex((i) => (i + 1) % (images.length || 1));
  }
  function prev() {
    setIndex((i) => (i - 1 + (images.length || 1)) % (images.length || 1));
  }

  const canAdd =
    product.stock > 0 &&
    (sizes.length === 0 || selectedSize) &&
    (colors.length === 0 || selectedColor);

  function addToCart() {
    if (!canAdd) {
      setShowTip(true);
      setTimeout(() => setShowTip(false), 1200);
      return;
    }
    setAdding(true);
    dispatch(
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        stock: product.stock,
        sku: product.sku,
        images: product.images,
        size: selectedSize,
        color: selectedColor,
        quantity,
      })
    );
    toast.success(`${product.title} added to cart!`);
    setTimeout(() => setAdding(false), 700);
  }

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            ref={backdropRef}
            className="absolute inset-0 bg-black/50"
            onClick={(e) => {
              if (e.target === backdropRef.current) onClose();
            }}
          />
          {/* Panel */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "tween", duration: 0.22, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            className="relative w-full sm:max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                {product.rating && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-[11px] font-semibold border border-yellow-200">
                    <FaStar className="text-yellow-500" />
                    {Number(product.rating).toFixed(1)}
                  </span>
                )}
                <span
                  className={`text-[11px] px-2 py-1 rounded-full ${
                    product.stock === 0
                      ? "bg-red-100 text-red-700"
                      : lowStock
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {product.stock === 0
                    ? "Out of stock"
                    : lowStock
                    ? `Only ${product.stock} left`
                    : "In stock"}
                </span>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <FaTimes />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Gallery */}
              <div className="relative bg-gray-50">
                <div className="relative w-full aspect-[4/3] pt-4 pb-2">
                  <Image
                    src={images[index] || "/images/default.png"}
                    alt={product.title}
                    fill
                    className="object-contain px-4 pt-2 pb-4 object-[center_60%]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                {images.length > 1 && (
                  <>
                    <button
                      className="absolute top-1/2 left-2 -translate-y-1/2 p-2 rounded-full bg-white shadow hover:bg-gray-100"
                      onClick={prev}
                      aria-label="Previous image"
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      className="absolute top-1/2 right-2 -translate-y-1/2 p-2 rounded-full bg-white shadow hover:bg-gray-100"
                      onClick={next}
                      aria-label="Next image"
                    >
                      <FaChevronRight />
                    </button>
                  </>
                )}

                {images.length > 1 && (
                  <div className="p-3 flex gap-2 overflow-x-auto">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`relative h-16 w-16 rounded-md overflow-hidden border ${
                          i === index ? "border-gray-900" : "border-gray-200"
                        }`}
                        aria-label={`Image ${i + 1}`}
                      >
                        <Image
                          src={img}
                          alt={`${product.title} ${i + 1}`}
                          fill
                          className="object-contain"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <QuickViewDetails
                product={product}
                sizes={sizes}
                colors={colors}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                quantity={quantity}
                setQuantity={setQuantity}
                wish={wish}
                setWish={setWish}
                canAdd={canAdd}
                addToCart={addToCart}
                adding={adding}
                showTip={showTip}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  function addToCart() {
    if (!canAdd) {
      setShowTip(true);
      setTimeout(() => setShowTip(false), 1200);
      return;
    }
    setAdding(true);
    dispatch(
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        stock: product.stock,
        sku: product.sku,
        images: product.images,
        size: selectedSize,
        color: selectedColor,
        quantity,
      })
    );
    toast.success(`${product.title} added to cart!`);
    setTimeout(() => setAdding(false), 700);
  }
}

function QuickViewDetails({
  product,
  sizes,
  colors,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
  quantity,
  setQuantity,
  wish,
  setWish,
  canAdd,
  addToCart,
  adding,
  showTip,
}) {
  return (
    <div className="p-5 flex flex-col gap-4">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">{product.title}</h3>
        <p className="text-sm text-gray-500">
          {product.category} • {product.material}
        </p>
      </div>

      <div className="text-2xl font-bold">
        ₨ {product.price.toLocaleString()}
      </div>

      {/* Sizes */}
      {sizes.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-1">Size</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-1 text-xs rounded-full border transition
                  ${
                    selectedSize === size
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Colors */}
      {colors.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-1">Color</p>
          <div className="flex flex-wrap gap-2">
            {colors.map((c, i) => {
              const selected = selectedColor === c;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedColor(c)}
                  aria-label={`Select color ${c}`}
                  style={{ backgroundColor: c }}
                  className={`relative h-8 w-8 rounded-full border-2 transition
                    ${
                      selected
                        ? "border-gray-900 scale-110"
                        : "border-gray-300 hover:border-gray-500"
                    }`}
                >
                  {selected && (
                    <span className="absolute inset-0 rounded-full ring-2 ring-offset-[2px] ring-offset-white ring-gray-900/80" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity + Wishlist */}
      <div className="flex items-center justify-between">
        <div className="flex items-center border rounded-lg overflow-hidden">
          <button
            onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
            className="px-3 py-2 bg-gray-50 hover:bg-gray-100 transition"
            aria-label="Decrease quantity"
          >
            –
          </button>
          <span className="px-4 min-w-[2ch] text-center">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="px-3 py-2 bg-gray-50 hover:bg-gray-100 transition"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button
          onClick={() => setWish((w) => !w)}
          className={`px-3 py-2 rounded-lg border transition ${
            wish
              ? "bg-rose-500 text-white border-rose-500"
              : "border-gray-200 hover:bg-gray-50"
          }`}
        >
          <FaHeart className="inline mr-2" />
          {wish ? "Wishlisted" : "Wishlist"}
        </button>
      </div>

      {/* CTA */}
      <div className="relative">
        <button
          onClick={addToCart}
          disabled={adding || product.stock === 0}
          className="w-full flex items-center justify-center gap-2 bg-black text-white px-5 py-3 rounded-lg font-semibold hover:bg-gray-900 transition disabled:opacity-50"
        >
          <FaShoppingCart />
          {adding
            ? "Adding…"
            : product.stock === 0
            ? "Unavailable"
            : "Add to cart"}
        </button>
        <AnimatePresence>
          {showTip && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute -top-9 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-3 py-1 shadow-lg"
            >
              Please select all required options.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-sm">
        <Link
          href={`/products/${product.slug}`}
          className="text-gray-700 hover:text-gray-900 hover:underline underline-offset-4"
        >
          View full details
        </Link>
      </div>
    </div>
  );
}
