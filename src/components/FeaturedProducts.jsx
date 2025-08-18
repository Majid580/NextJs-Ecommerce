// src/components/FeaturedProducts.jsx
"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaShoppingCart, FaStar } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addItem } from "@/redux/slices/cartSlice";
import toast from "react-hot-toast";
import { allProducts } from "@/data/allProducts";

export default function FeaturedProducts() {
  const featuredProducts = useMemo(
    () => allProducts.filter((x) => x.featured),
    []
  );

  // Client-only mobile detection (avoids SSR mismatch)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () =>
      setIsMobile(window.matchMedia("(max-width: 639px)").matches);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const productsToShow = useMemo(() => {
    if (!isMobile) return featuredProducts;
    const half = Math.ceil(featuredProducts.length / 2);
    return featuredProducts.slice(0, half);
  }, [isMobile, featuredProducts]);

  return (
    <section className="py-10 px-4 bg-gradient-to-b from-gray-50 to-white">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
        🌟 Featured Products
      </h2>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {productsToShow.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product }) {
  const dispatch = useDispatch();

  const [hovered, setHovered] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [wish, setWish] = useState(false);

  const colors = product.colors?.length
    ? product.colors
    : ["#000000", "#FF0000", "#0000FF"];
  const sizes = product.sizes?.length ? product.sizes : [];

  const canAddToCart =
    product.stock > 0 &&
    (colors.length === 0 || selectedColor !== null) &&
    (sizes.length === 0 || selectedSize !== null);

  const lowStock = product.stock > 0 && product.stock <= 10;

  const handleAddToCart = () => {
    if (!canAddToCart) {
      if (colors.length > 0 && selectedColor === null) {
        toast.error("Please select a color first!");
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 1400);
        return;
      }
      if (sizes.length > 0 && selectedSize === null) {
        toast.error("Please select a size first!");
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 1400);
        return;
      }
      toast.error("Please select all required options.");
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 1400);
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
    setTimeout(() => setAddingToCart(false), 900);
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="group relative w-full max-w-xs sm:max-w-none mx-auto text-black
                 bg-white border border-gray-100/80 rounded-2xl shadow-sm hover:shadow-xl
                 transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Hover glow ring */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-gray-200/70" />

      {/* Media */}
      <div className="relative w-full h-64 sm:h-72 bg-white">
        <Link href={`/products/${product.slug}`} className="block h-full">
          <Image
            src={
              hovered && product.images[1]
                ? product.images[1]
                : product.images[0]
            }
            alt={product.title}
            fill
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 33vw, 300px"
            className="object-contain p-4 duration-500 ease-out transform group-hover:scale-105"
            priority={false}
          />
        </Link>

        {/* Badges: stock + rating */}
        <div className="absolute left-3 top-3 flex items-center gap-2">
          {product.stock === 0 ? (
            <span className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide bg-gray-900 text-white rounded-full shadow">
              Sold out
            </span>
          ) : lowStock ? (
            <span className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide bg-amber-100 text-amber-800 rounded-full border border-amber-200">
              Only {product.stock} left
            </span>
          ) : (
            <span className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
              In stock
            </span>
          )}

          {product.rating && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-[11px] font-semibold border border-yellow-200">
              <FaStar className="text-yellow-500" />
              {Number(product.rating).toFixed(1)}
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={() => setWish((w) => !w)}
          type="button"
          aria-label="Add to wishlist"
          className={`absolute top-3 right-3 p-2 rounded-full shadow transition
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20
            ${
              wish
                ? "bg-rose-500 text-white"
                : "bg-white/90 hover:bg-rose-500 hover:text-white"
            }`}
        >
          <FaHeart className={`${wish ? "scale-110" : ""} transition`} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-3">
        <Link
          href={`/products/${product.slug}`}
          className="block hover:underline underline-offset-4 decoration-gray-300"
        >
          <h3 className="font-semibold text-gray-900 line-clamp-2">
            {product.title}
          </h3>
        </Link>

        {/* Price row (desktop): price + quantity + hover Add */}
        <div className="hidden md:flex items-center justify-between gap-3">
          <p className="text-lg font-bold text-gray-900">
            ₨ {Number(product.price).toLocaleString()}
          </p>

          {/* Quantity controls (always visible on desktop) */}
          <div className="flex items-center border rounded-lg overflow-hidden">
            <button
              onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
              type="button"
              className="px-3 py-2 bg-gray-50 hover:bg-gray-100 transition"
              aria-label="Decrease quantity"
            >
              –
            </button>
            <span className="px-4 min-w-[2ch] text-center">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              type="button"
              className="px-3 py-2 bg-gray-50 hover:bg-gray-100 transition"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Quick Add (desktop only, appears on hover) */}
          <button
            onClick={handleAddToCart}
            type="button"
            disabled={addingToCart || product.stock === 0}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold
                       bg-black text-white hover:bg-gray-900 transition
                       disabled:opacity-50 disabled:cursor-not-allowed
                       opacity-0 group-hover:opacity-100"
            title={product.stock === 0 ? "Out of stock" : "Add to cart"}
          >
            <FaShoppingCart />
            {addingToCart ? "Adding…" : "Add"}
          </button>
        </div>

        {/* Price row (mobile): price only (quantity & CTA appear below) */}
        <div className="flex md:hidden items-center justify-between">
          <p className="text-lg font-bold text-gray-900">
            ₨ {Number(product.price).toLocaleString()}
          </p>
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
                  type="button"
                  className={`px-2.5 py-1.5 text-xs rounded-full border transition
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20
                    ${
                      selectedSize === size
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-900 hover:text-white"
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
              {colors.map((color, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedColor(color)}
                  type="button"
                  aria-label={`Select color ${color}`}
                  className={`relative h-7 w-7 rounded-full border-2 transition
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20
                             ${
                               selectedColor === color
                                 ? "border-gray-900 scale-110"
                                 : "border-gray-300 hover:border-gray-500"
                             }`}
                  style={{ backgroundColor: color }}
                >
                  {selectedColor === color && (
                    <span className="absolute inset-0 rounded-full ring-2 ring-offset-[2px] ring-offset-white ring-gray-900/80" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity + Full-width Add (mobile only) */}
        <div className="mt-2 flex items-center gap-3 md:hidden">
          <div className="flex items-center border rounded-lg overflow-hidden">
            <button
              onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
              type="button"
              className="px-3 py-2 bg-gray-50 hover:bg-gray-100 transition"
              aria-label="Decrease quantity"
            >
              –
            </button>
            <span className="px-4 min-w-[2ch] text-center">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              type="button"
              className="px-3 py-2 bg-gray-50 hover:bg-gray-100 transition"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <div className="relative flex-1">
            <button
              onClick={handleAddToCart}
              type="button"
              className="flex items-center justify-center gap-2 bg-black text-white px-5 py-3 rounded-lg font-semibold w-full hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={addingToCart || product.stock === 0}
            >
              <FaShoppingCart />
              {addingToCart
                ? "Adding…"
                : product.stock === 0
                ? "Unavailable"
                : "Add to cart"}
            </button>

            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-3 py-1 shadow-lg"
                >
                  Please select all required options.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Secondary actions */}
        <div className="flex items-center justify-between pt-1">
          <Link
            href={`/products/${product.slug}`}
            className="text-sm text-gray-600 hover:text-gray-900 hover:underline underline-offset-4"
          >
            View details
          </Link>
          <p className="text-xs text-gray-500">SKU: {product.sku}</p>
        </div>
      </div>
    </motion.div>
  );
}
