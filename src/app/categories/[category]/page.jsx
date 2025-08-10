"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaHeart, FaShoppingCart, FaStar } from "react-icons/fa";
import FadeUp from "@/components/FadeUp";
import { allProducts } from "@/data/allProducts";

export default function CategoryProductsPage({ params }) {
  const category = params.category.toLowerCase();

  // Initial products filtered by "for" field (like "women", "kids")
  const initialProducts = allProducts.filter(
    (p) => p.for.toLowerCase() === category
  );

  // Filter state
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedMaterial, setSelectedMaterial] = useState("");

  // Extract filter options dynamically
  const sizesOptions = useMemo(() => {
    const sizes = new Set();
    initialProducts.forEach((p) => p.sizes.forEach((s) => sizes.add(s)));
    return Array.from(sizes).sort();
  }, [initialProducts]);

  const colorsOptions = useMemo(() => {
    const colors = new Set();
    initialProducts.forEach((p) => p.colors.forEach((c) => colors.add(c)));
    return Array.from(colors);
  }, [initialProducts]);

  const materialsOptions = useMemo(() => {
    const mats = new Set();
    initialProducts.forEach((p) => mats.add(p.material));
    return Array.from(mats);
  }, [initialProducts]);

  // Filter products based on selected filters
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((p) => {
      const sizeMatch =
        selectedSizes.length === 0 ||
        p.sizes.some((s) => selectedSizes.includes(s));
      const colorMatch =
        selectedColors.length === 0 ||
        p.colors.some((c) => selectedColors.includes(c));
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

  // Toggle handlers for multi-select filters
  function toggleSize(size) {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  }

  function toggleColor(color) {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  }

  return (
    <FadeUp>
      <section className="min-h-screen py-6 px-3 bg-gradient-to-b from-gray-100 to-white max-w-full">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 px-4 text-center capitalize tracking-wide">
          {category} Collection
        </h2>

        {/* Grid Container with 2 columns on small screens */}
        <div className="grid grid-cols-[160px_1fr] gap-4 sm:grid-cols-[220px_1fr] max-w-7xl mx-auto min-h-[80vh]">
          {/* Filters Sidebar */}
          <aside
            className="bg-white rounded-xl shadow-lg p-4
                       overflow-y-auto max-h-[75vh]
                       sticky top-4 left-0
                       w-[150px] sm:w-[220px]
                       text-sm sm:text-base
                       scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            aria-label="Product Filters"
          >
            <h3 className="text-lg font-semibold mb-5 border-b pb-2 text-gray-800">
              Filters
            </h3>

            {/* Sizes */}
            <div className="mb-5">
              <h4 className="font-semibold text-gray-700 mb-3">Sizes</h4>
              <div className="flex flex-wrap gap-2">
                {sizesOptions.map((size) => (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`cursor-pointer px-2 py-1 rounded-full border text-xs font-medium transition
                      ${
                        selectedSizes.includes(size)
                          ? "bg-black text-white border-black shadow-md"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    aria-pressed={selectedSizes.includes(size)}
                    aria-label={`Filter size ${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="mb-5">
              <h4 className="font-semibold text-gray-700 mb-3">Colors</h4>
              <div className="flex flex-wrap gap-2">
                {colorsOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => toggleColor(color)}
                    title={color}
                    aria-label={`Filter by color ${color}`}
                    style={{ backgroundColor: color }}
                    className={`w-6 h-6 rounded-full border-2 transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black
                      ${
                        selectedColors.includes(color)
                          ? "border-black shadow-lg"
                          : "border-transparent hover:border-gray-400"
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Material */}
            <div className="mb-5">
              <h4 className="font-semibold text-gray-700 mb-3">Material</h4>
              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-2 py-1 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-black text-sm"
                aria-label="Filter by material"
              >
                <option value="">All</option>
                {materialsOptions.map((mat) => (
                  <option key={mat} value={mat}>
                    {mat}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">
                Price Range (₨)
              </h4>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={0}
                  max={priceRange[1]}
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([
                      Math.min(+e.target.value || 0, priceRange[1]),
                      priceRange[1],
                    ])
                  }
                  className="w-1/2 rounded-md border border-gray-300 px-2 py-1 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-black text-sm"
                  placeholder="Min"
                  aria-label="Minimum price"
                />
                <input
                  type="number"
                  min={priceRange[0]}
                  max={10000}
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([
                      priceRange[0],
                      Math.max(+e.target.value || 0, priceRange[0]),
                    ])
                  }
                  className="w-1/2 rounded-md border border-gray-300 px-2 py-1 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-black text-sm"
                  placeholder="Max"
                  aria-label="Maximum price"
                />
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="overflow-auto">
            {filteredProducts.length === 0 ? (
              <p className="text-center text-gray-500 text-base mt-16">
                No products found with the selected filters.
              </p>
            ) : (
              <div
                className="grid gap-4
                           grid-cols-1
                           sm:grid-cols-2
                           md:grid-cols-3
                           lg:grid-cols-4"
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </section>
    </FadeUp>
  );
}

function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");
  const [quantity, setQuantity] = useState(1);

  return (
    <article
      className="group relative bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image + Icons */}
      <div className="relative w-full h-52 sm:h-60 md:h-64 bg-white flex items-center justify-center overflow-hidden rounded-t-2xl">
        <Link
          href={`/products/${product.slug}`}
          className="w-full h-full block relative"
        >
          <Image
            src={
              hovered && product.images.length > 1
                ? product.images[1]
                : product.images[0]
            }
            alt={product.title}
            fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            priority
          />
        </Link>

        <button
          aria-label="Add to favorites"
          className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow hover:bg-red-600 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
        >
          <FaHeart className="text-base sm:text-lg" />
        </button>

        <div className="absolute top-3 left-3 bg-yellow-400 text-white text-xs sm:text-sm font-bold px-2 py-0.5 rounded-full shadow flex items-center space-x-1 select-none">
          <FaStar className="inline" /> <span>{product.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-5 flex flex-col flex-grow">
        <h3
          title={product.title}
          className="font-semibold text-gray-900 text-base sm:text-lg truncate mb-1"
        >
          {product.title}
        </h3>
        <p className="text-lg sm:text-xl font-extrabold text-gray-900 mb-3">
          ₨ {product.price.toLocaleString()}
        </p>

        {/* Sizes */}
        <div className="flex gap-2 flex-wrap mb-3 sm:mb-4">
          {product.sizes?.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`cursor-pointer px-3 py-1 rounded-full border text-xs sm:text-sm font-medium transition ${
                selectedSize === size
                  ? "bg-black text-white border-black shadow-md"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
              aria-pressed={selectedSize === size}
            >
              {size}
            </button>
          ))}
        </div>

        {/* Quantity + Add to Cart */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center border rounded-full overflow-hidden shadow-sm">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 py-1 hover:bg-gray-200 transition"
              aria-label="Decrease quantity"
            >
              –
            </button>
            <span className="px-4 py-1 font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="px-3 py-1 hover:bg-gray-200 transition"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full hover:bg-gray-900 transition shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            aria-label={`Add ${quantity} ${product.title} to cart`}
          >
            <FaShoppingCart className="text-sm sm:text-base" /> Add
          </button>
        </div>
      </div>
    </article>
  );
}
