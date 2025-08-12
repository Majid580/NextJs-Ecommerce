"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHeart,
  FaShoppingCart,
  FaStar,
  FaFilter,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";
import { allProducts } from "@/data/allProducts";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  removeItem,
  increaseQuantity,
  decreaseQuantity,
  selectCartItems,
} from "@/redux/slices/cartSlice";
import toast from "react-hot-toast";
/**
 * CategoryProductsPage
 *
 * - Mobile: filter drawer slides from left (80% width)
 * - Desktop: left sticky sidebar visible
 * - Click outside or Esc closes drawer
 * - Framer Motion animations for drawer + cards + micro interactions
 *
 * NOTE: Tailwind classes are used for styling. Adjust spacing/colours to taste.
 */

export default function CategoryProductsPage({ params }) {
  // category from params (Next.js dynamic route)
  const category = (params?.category || "all").toString().toLowerCase();

  // initial product list for category
  const initialProducts = useMemo(
    () => allProducts.filter((p) => p.for.toLowerCase() === category),
    [category]
  );

  // --- Filter states
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);

  // drawer open state (mobile)
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // for focusing when drawer opens
  const firstFilterFocusRef = useRef(null);

  // --- dynamic filter options
  const sizesOptions = useMemo(() => {
    const s = new Set();
    initialProducts.forEach((p) => p.sizes?.forEach((v) => s.add(v)));
    return Array.from(s).sort();
  }, [initialProducts]);

  const colorsOptions = useMemo(() => {
    const s = new Set();
    initialProducts.forEach((p) => p.colors?.forEach((v) => s.add(v)));
    return Array.from(s);
  }, [initialProducts]);

  const materialsOptions = useMemo(() => {
    const s = new Set();
    initialProducts.forEach((p) => p.material && s.add(p.material));
    return Array.from(s);
  }, [initialProducts]);

  // --- Filtered products
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((p) => {
      const sizeMatch =
        selectedSizes.length === 0 ||
        p.sizes?.some((s) => selectedSizes.includes(s));
      const colorMatch =
        selectedColors.length === 0 ||
        p.colors?.some((c) => selectedColors.includes(c));
      const priceMatch = p.price >= priceRange[0] && p.price <= priceRange[1];
      const materialMatch =
        !selectedMaterial || p.material === selectedMaterial;
      return sizeMatch && colorMatch && priceMatch && materialMatch;
    });
  }, [
    initialProducts,
    selectedSizes,
    selectedColors,
    priceRange,
    selectedMaterial,
  ]);

  // --- Toggle handlers
  function toggleSize(size) {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((p) => p !== size) : [...prev, size]
    );
  }
  function toggleColor(color) {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((p) => p !== color) : [...prev, color]
    );
  }
  function resetFilters() {
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedMaterial("");
    setPriceRange([0, 10000]);
  }

  // --- click outside & Esc to close drawer
  const drawerRef = useRef(null);
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setIsFilterOpen(false);
    }
    function onPointerDown(e) {
      if (
        isFilterOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(e.target)
      ) {
        setIsFilterOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isFilterOpen]);

  // focus first element when drawer opens
  useEffect(() => {
    if (isFilterOpen) {
      const t = setTimeout(() => {
        firstFilterFocusRef.current?.focus();
      }, 200);
      return () => clearTimeout(t);
    }
  }, [isFilterOpen]);

  // --- Framer Motion variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const drawerVariants = {
    hidden: { x: "-110%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 260, damping: 30 },
    },
    exit: {
      x: "-110%",
      opacity: 0,
      transition: { ease: "easeInOut", duration: 0.18 },
    },
  };

  const productContainerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const productCardVariants = {
    hidden: { opacity: 0, y: 18, scale: 0.99 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.36, ease: "easeOut" },
    },
  };

  // small util for price input handlers
  function updateMinPrice(value) {
    const v = Math.max(0, Math.min(Number(value || 0), priceRange[1]));
    setPriceRange([v, priceRange[1]]);
  }
  function updateMaxPrice(value) {
    const v = Math.max(
      Number(value || 0),
      Math.max(priceRange[0], Number(value || 0))
    );
    setPriceRange([priceRange[0], v]);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      {/* Header bar (sticky) */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight capitalize">
            {category} Collection
          </h1>

          <div className="flex items-center gap-3">
            {/* Mobile filter button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              aria-expanded={isFilterOpen}
              aria-controls="filters-drawer"
              className="lg:hidden inline-flex items-center gap-2 px-3 py-2 rounded-full bg-black text-white shadow hover:opacity-95 transition"
            >
              <FaFilter />
              <span className="text-sm font-medium">Filters</span>
            </button>

            {/* Desktop small-ish filters summary */}
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {filteredProducts.length} items
              </span>
              <button
                onClick={resetFilters}
                className="text-sm px-3 py-1 rounded-full border border-gray-200 hover:bg-gray-100 transition"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* ---------- Desktop Sidebar (always visible on lg+) ---------- */}
        <aside className="hidden lg:block sticky top-24 self-start">
          <div className="bg-white rounded-2xl shadow-md p-4 w-full">
            <FilterPanel
              sizesOptions={sizesOptions}
              colorsOptions={colorsOptions}
              materialsOptions={materialsOptions}
              selectedSizes={selectedSizes}
              selectedColors={selectedColors}
              selectedMaterial={selectedMaterial}
              priceRange={priceRange}
              toggleSize={toggleSize}
              toggleColor={toggleColor}
              setSelectedMaterial={setSelectedMaterial}
              setPriceRange={setPriceRange}
              resetFilters={resetFilters}
              firstFocusRef={firstFilterFocusRef}
            />
          </div>
        </aside>

        {/* ---------- Content (Products Grid) ---------- */}
        <section>
          {/* mobile inline filter summary row */}
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <div className="text-sm text-gray-600">
              {filteredProducts.length} items
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="px-3 py-1 rounded-full border border-gray-200 text-sm flex items-center gap-2"
              >
                <FaFilter /> Filters
              </button>
              <button
                onClick={resetFilters}
                className="px-3 py-1 rounded-full border border-gray-200 text-sm"
              >
                Reset
              </button>
            </div>
          </div>

          {/* product grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-28 text-center">
              <p className="text-lg text-gray-500">
                No products match your filters.
              </p>
              <button
                onClick={resetFilters}
                className="mt-6 px-4 py-2 rounded-full bg-black text-white"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <motion.div
              variants={productContainerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {filteredProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    variants={productCardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </section>
      </main>

      {/* ---------- Mobile Drawer (AnimatePresence) ---------- */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex lg:hidden"
            initial="hidden"
            animate="visible"
            exit="hidden"
            aria-hidden={!isFilterOpen}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/40"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={() => setIsFilterOpen(false)}
            />

            {/* Drawer */}
            <motion.aside
              id="filters-drawer"
              ref={drawerRef}
              className="relative w-[80%] max-w-xs bg-white h-full shadow-2xl p-4 overflow-y-auto"
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Filters</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      resetFilters();
                      // keep drawer open to show cleared state
                    }}
                    className="text-sm px-3 py-1 rounded-full border border-gray-200 hover:bg-gray-50"
                  >
                    Clear
                  </button>

                  <button
                    onClick={() => setIsFilterOpen(false)}
                    aria-label="Close filters"
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <FilterPanel
                  sizesOptions={sizesOptions}
                  colorsOptions={colorsOptions}
                  materialsOptions={materialsOptions}
                  selectedSizes={selectedSizes}
                  selectedColors={selectedColors}
                  selectedMaterial={selectedMaterial}
                  priceRange={priceRange}
                  toggleSize={toggleSize}
                  toggleColor={toggleColor}
                  setSelectedMaterial={setSelectedMaterial}
                  setPriceRange={setPriceRange}
                  resetFilters={() => {
                    resetFilters();
                    // focus the first input after clearing
                    firstFilterFocusRef.current?.focus();
                  }}
                  firstFocusRef={firstFilterFocusRef}
                />
                {/* Apply button */}
                <div className="sticky bottom-0 left-0 right-0 bg-white/60 backdrop-blur-sm py-3 -mx-4 px-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="flex-1 py-2 rounded-full bg-black text-white font-semibold shadow"
                    >
                      Apply Filters
                    </button>
                    <button
                      onClick={() => {
                        resetFilters();
                        setIsFilterOpen(false);
                      }}
                      className="py-2 px-4 rounded-full border border-gray-200"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ===========================================================================
   FilterPanel - reusable UI block for both mobile drawer & desktop sidebar
   =========================================================================== */
function FilterPanel({
  sizesOptions = [],
  colorsOptions = [],
  materialsOptions = [],
  selectedSizes = [],
  selectedColors = [],
  selectedMaterial = "",
  priceRange = [0, 10000],
  toggleSize = () => {},
  toggleColor = () => {},
  setSelectedMaterial = () => {},
  setPriceRange = () => {},
  resetFilters = () => {},
  firstFocusRef = null,
}) {
  // micro-animation variants
  const chipVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.04 },
    active: { scale: 0.98 },
  };

  return (
    <div className="text-sm text-gray-800">
      {/* Sizes */}
      <section aria-labelledby="label-sizes" className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 id="label-sizes" className="font-semibold text-gray-900">
            Sizes
          </h4>
          <span className="text-xs text-gray-500">
            {sizesOptions.length} options
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {sizesOptions.map((size, idx) => {
            const active = selectedSizes.includes(size);
            return (
              <motion.button
                key={size}
                onClick={() => toggleSize(size)}
                initial="rest"
                whileHover="hover"
                whileTap="active"
                variants={chipVariants}
                aria-pressed={active}
                ref={idx === 0 ? firstFocusRef : undefined}
                className={`px-3 py-1 rounded-full border shadow-sm text-sm font-medium transition
                  ${
                    active
                      ? "bg-black text-white border-black shadow-lg"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
              >
                {size}
              </motion.button>
            );
          })}
        </div>
      </section>

      <hr className="my-4 border-t border-gray-100" />

      {/* Colors */}
      <section aria-labelledby="label-colors" className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 id="label-colors" className="font-semibold text-gray-900">
            Colors
          </h4>
          <span className="text-xs text-gray-500">
            {colorsOptions.length} options
          </span>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {colorsOptions.map((color) => {
            const active = selectedColors.includes(color);
            // some color strings may be names, hex codes, rgb; we trust the value for style
            return (
              <button
                key={color}
                onClick={() => toggleColor(color)}
                title={color}
                aria-pressed={active}
                className={`w-8 h-8 rounded-full border-2 transition-shadow flex items-center justify-center focus:outline-none
                  ${
                    active
                      ? "ring-2 ring-offset-2 ring-black border-black shadow-md"
                      : "border-transparent hover:border-gray-300"
                  }`}
                style={{ backgroundColor: color }}
              >
                {/* when active, show a small check */}
                {active && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    className="text-white opacity-90"
                  >
                    <path
                      fill="white"
                      d="M20.285,6.709c-0.39-0.39-1.023-0.39-1.414,0L9,16.58L5.129,12.71c-0.39-0.39-1.024-0.39-1.414,0 c-0.39,0.39-0.39,1.024,0,1.414l4.95,4.95c0.39,0.39,1.023,0.39,1.414,0l10.206-10.206C20.676,7.733,20.676,7.099,20.285,6.709z"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <hr className="my-4 border-t border-gray-100" />

      {/* Material */}
      <section aria-labelledby="label-material" className="mb-4">
        <h4 id="label-material" className="font-semibold text-gray-900 mb-2">
          Material
        </h4>
        <select
          value={selectedMaterial}
          onChange={(e) => setSelectedMaterial(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 shadow-sm focus:ring-2 focus:ring-offset-1 focus:ring-black"
        >
          <option value="">All materials</option>
          {materialsOptions.map((mat) => (
            <option value={mat} key={mat}>
              {mat}
            </option>
          ))}
        </select>
      </section>

      <hr className="my-4 border-t border-gray-100" />

      {/* Price */}
      <section aria-labelledby="label-price" className="mb-4">
        <h4 id="label-price" className="font-semibold text-gray-900 mb-2">
          Price (₨)
        </h4>

        <div className="flex items-center gap-2">
          <input
            type="number"
            value={priceRange[0]}
            min={0}
            onChange={(e) => {
              const val = Number(e.target.value || 0);
              setPriceRange([Math.min(val, priceRange[1]), priceRange[1]]);
            }}
            className="w-1/2 rounded-lg border border-gray-200 px-3 py-2 shadow-sm focus:ring-2 focus:ring-black"
            aria-label="Minimum price"
          />
          <input
            type="number"
            value={priceRange[1]}
            min={0}
            onChange={(e) => {
              const val = Number(e.target.value || 0);
              setPriceRange([priceRange[0], Math.max(val, priceRange[0])]);
            }}
            className="w-1/2 rounded-lg border border-gray-200 px-3 py-2 shadow-sm focus:ring-2 focus:ring-black"
            aria-label="Maximum price"
          />
        </div>

        <div className="mt-3 text-xs text-gray-500">
          Adjusted live — products update as you edit.
        </div>
      </section>

      <hr className="my-4 border-t border-gray-100" />

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={resetFilters}
          className="flex-1 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
        >
          Reset
        </button>
        <button className="flex-1 py-2 rounded-lg bg-black text-white shadow">
          Apply
        </button>
      </div>
    </div>
  );
}

/* ===========================================================================
   ProductCard - polished, animated product card
   =========================================================================== */
function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const colors = product.colors?.length
    ? product.colors
    : ["#000000", "#FF0000", "#0000FF"];

  const sizes = product.sizes?.length ? product.sizes : []; // Optional

  // Card hover animation variants
  const cardHover = {
    initial: { y: 0 },
    hover: {
      y: -6,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  const imageVariants = {
    rest: { scale: 1, rotate: 0 },
    hover: { scale: 1.08, rotate: 0.5, transition: { duration: 0.45 } },
  };
  const canAddToCart =
    product.stock > 0 &&
    (colors.length === 0 || selectedColor !== null) &&
    (sizes.length === 0 || selectedSize !== null);

  const handleAddToCart = () => {
    if (!canAddToCart) {
      if (colors.length > 0 && selectedColor === null) {
        toast.error("Please select a color first!");
        return;
      }
      if (sizes.length > 0 && selectedSize === null) {
        toast.error("Please select a size first!");
        return;
      }
      toast.error("Please select all required options.");
      return;
    } else {
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
      setTimeout(() => setAddingToCart(false), 1000);
    }
  };
  const dispatch = useDispatch();
  return (
    <motion.article
      layout
      initial="initial"
      whileHover="hover"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      variants={cardHover}
      className="group bg-white rounded-2xl shadow-md overflow-hidden flex flex-col relative"
      role="article"
      aria-labelledby={`product-${product.id}`}
    >
      {/* Image area with layered overlay */}
      <div className="relative w-full h-64 bg-gradient-to-b from-white to-gray-50 flex items-center justify-center overflow-hidden">
        <motion.div
          variants={imageVariants}
          initial="rest"
          animate={hovered ? "hover" : "rest"}
          className="relative w-full h-full flex items-center justify-center"
        >
          <Link href={`/products/${product.slug}`} className="absolute inset-0">
            {/* Image fill */}
            <Image
              src={product.images?.[0]}
              alt={product.title}
              fill
              className="object-contain p-4"
              sizes="(max-width: 640px) 100vw, 50vw"
              priority
            />
          </Link>
        </motion.div>

        {/* Floating rating badge */}
        <div className="absolute top-3 left-3 bg-yellow-400 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow">
          <FaStar className="inline mr-1" />{" "}
          {product.rating?.toFixed?.(1) ?? "—"}
        </div>

        {/* Action buttons (appear on hover) */}
        <div
          className={`absolute right-3 top-3 flex flex-col gap-2 transition-opacity ${
            hovered ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <button
            aria-label="Add to wishlist"
            className="p-2 bg-white rounded-full shadow hover:bg-red-600 hover:text-white transition"
          >
            <FaHeart />
          </button>
        </div>
      </div>

      {/* Content block */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <h3
          id={`product-${product.id}`}
          className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2"
        >
          {product.title}
        </h3>

        <div className="flex items-center justify-between">
          <div className="text-lg font-extrabold text-gray-900">
            ₨ {Number(product.price).toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">
            SKU: {product.sku ?? product.id}
          </div>
        </div>

        {/* Sizes */}
        <div className="flex gap-2 flex-wrap">
          {product.sizes?.map((size) => {
            const active = selectedSize === size;
            return (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-1 text-xs rounded-full border shadow-sm transition 
                  ${
                    active
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                aria-pressed={active}
              >
                {size}
              </button>
            );
          })}
        </div>
        {/* Color Selector */}
        {colors.length > 0 && (
          <div className="mb-8">
            <p className="mb-2 font-semibold">Select Color:</p>
            <div className="flex space-x-4">
              {colors.map((color, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedColor(color)}
                  aria-label={`Select color ${color}`}
                  style={{ backgroundColor: color }}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === color
                      ? "border-gray-800 scale-120"
                      : "border-gray-400 hover:border-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
        {/* Quantity + Add to Cart */}
        <div className="mt-auto flex items-center justify-between gap-3">
          <div className="flex items-center rounded-full border overflow-hidden">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-2 py-1 hover:bg-gray-100 transition"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <div className="px-2 py-1 font-medium">{quantity}</div>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="px-3 py-1 hover:bg-gray-100 transition"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Add To Cart */}
          <div className="relative max-w-xs">
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-3 bg-gray-900 text-white px-6 py-3 rounded-md font-semibold w-full hover:bg-gray-800 disabled:opacity-50"
            >
              <FaShoppingCart />
              {addingToCart ? "Adding..." : "Add"}
            </button>

            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-600 text-white text-sm rounded px-3 py-1 shadow-md"
                >
                  Please select all required options.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* subtle bottom gradient for depth */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent" />
    </motion.article>
  );
}
