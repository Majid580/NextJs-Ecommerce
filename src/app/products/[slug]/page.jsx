// src/app/products/[slug]/page.jsx (or wherever this lives)
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaShoppingCart,
  FaFacebookF,
  FaInstagram,
  FaShareAlt,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaStar,
  FaTruck,
  FaUndo,
} from "react-icons/fa";
import { allProducts } from "@/data/allProducts";
import { useDispatch } from "react-redux";
import { addItem } from "@/redux/slices/cartSlice";

export default function ProductDetail({ params }) {
  const product = allProducts.find((p) => p.slug === params.slug);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [addingToCart, setAddingToCart] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [wish, setWish] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const galleryRef = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    setSelectedColor(null);
    setSelectedSize(null);
    setSelectedImage(0);
    setQuantity(1);
    setActiveTab("description");
    setAddingToCart(false);
    setWish(false);
  }, [product]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
      const onKey = (e) => {
        if (e.key === "ArrowRight") handleNextImage();
        if (e.key === "ArrowLeft") handlePrevImage();
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
  }, [selectedImage, product]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-red-600 font-medium bg-gray-50">
        Product not found
      </div>
    );
  }

  const colors = product.colors?.length
    ? product.colors
    : ["#000000", "#FF0000", "#0000FF"];
  const sizes = product.sizes?.length ? product.sizes : [];

  const tabs = {
    description: product.description || "No description available.",
    details: product.details || "No product details available.",
    reviews: product.reviews?.length
      ? product.reviews.join("\n\n")
      : "No reviews yet.",
  };

  const canAddToCart =
    product.stock > 0 &&
    (colors.length === 0 || selectedColor !== null) &&
    (sizes.length === 0 || selectedSize !== null);

  function handleAddToCart() {
    if (!canAddToCart) {
      if (colors.length > 0 && selectedColor === null) {
        toast.error("Please select a color first!");
      } else if (sizes.length > 0 && selectedSize === null) {
        toast.error("Please select a size first!");
      } else {
        toast.error("Please select all required options.");
      }
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 1100);
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
  }

  function handlePrevImage() {
    if (!product?.images?.length) return;
    setSelectedImage(
      (i) => (i - 1 + product.images.length) % product.images.length
    );
  }
  function handleNextImage() {
    if (!product?.images?.length) return;
    setSelectedImage((i) => (i + 1) % product.images.length);
  }

  async function handleShare() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.title,
          text: "Check out this product",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard");
      }
    } catch {
      // ignore cancel
    }
  }

  const lowStock = product.stock > 0 && product.stock <= 10;

  return (
    <main className="max-w-6xl mx-auto p-4 sm:p-8 font-sans min-h-screen text-gray-900">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-600 mb-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:underline">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium truncate">
          {product.title}
        </span>
      </nav>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Left: Gallery */}
        <section className="md:w-1/2">
          <div className="relative rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
            {/* Lowered image via padding + object-position tweak */}
            <div className="relative w-full aspect-[4/3] pt-6 pb-2 bg-white">
              <Image
                src={product.images[selectedImage]}
                alt={`${product.title} image ${selectedImage + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain px-4 pt-2 pb-4 object-[center_60%] transition-transform duration-300"
                priority
              />
            </div>

            {product.images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={handleNextImage}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow"
                >
                  <FaChevronRight />
                </button>
              </>
            )}
          </div>

          {product.images.length > 1 && (
            <div
              ref={galleryRef}
              className="flex flex-wrap gap-2 mt-4 justify-start"
            >
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  aria-label={`Select image ${i + 1}`}
                  className={`relative w-20 h-20 rounded-md overflow-hidden border transition
                    ${
                      selectedImage === i
                        ? "border-gray-900 ring-1 ring-gray-900/10"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    fill
                    sizes="80px"
                    className="object-contain bg-white"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Right: Buy box */}
        <section className="md:w-1/2 flex flex-col justify-between">
          <article>
            {/* Stock & rating */}
            <div className="flex items-center gap-3 mb-3">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold
                  ${
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
              {product.rating && (
                <span className="inline-flex items-center gap-1 text-xs text-gray-800">
                  <FaStar className="text-yellow-400" />
                  {Number(product.rating).toFixed(1)}
                </span>
              )}
              <button
                onClick={() => setWish((w) => !w)}
                className={`ml-auto rounded-full p-2 border transition ${
                  wish
                    ? "bg-rose-500 text-white border-rose-500"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
                aria-label="Wishlist"
                title={wish ? "Wishlisted" : "Add to wishlist"}
              >
                <FaHeart />
              </button>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-semibold mb-3 leading-tight">
              {product.title}
            </h1>
            <p className="text-sm text-gray-600 mb-6">
              {product.category} • {product.material}
            </p>

            {/* Price */}
            <div className="flex items-end gap-3 mb-6">
              <p className="text-3xl font-bold tracking-tight">
                Rs. {product.price.toLocaleString()}
              </p>
              {product.compareAtPrice && (
                <span className="text-sm text-gray-500 line-through">
                  Rs. {Number(product.compareAtPrice).toLocaleString()}
                </span>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6 max-w-xs">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                aria-label="Decrease quantity"
              >
                –
              </button>
              <span className="text-lg font-medium min-w-[2ch] text-center">
                {quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity((q) => Math.min(product.stock, q + 1))
                }
                disabled={quantity >= product.stock}
                className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            {/* Size */}
            {sizes.length > 0 && (
              <div className="mb-6">
                <p className="mb-2 font-semibold">Select Size:</p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 text-sm rounded-full border transition
                        ${
                          selectedSize === size
                            ? "bg-gray-900 text-white border-gray-900"
                            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color */}
            {colors.length > 0 && (
              <div className="mb-8">
                <p className="mb-2 font-semibold">Select Color:</p>
                <div className="flex flex-wrap gap-3">
                  {colors.map((color, i) => {
                    const active = selectedColor === color;
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedColor(color)}
                        aria-label={`Select color ${color}`}
                        style={{ backgroundColor: color }}
                        className={`h-8 w-8 rounded-full border-2 transition
                          ${
                            active
                              ? "border-gray-900 scale-110"
                              : "border-gray-400 hover:border-gray-600"
                          }`}
                        title={color}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add To Cart */}
            <div className="relative max-w-sm">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full inline-flex items-center justify-center gap-3 bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-900 disabled:opacity-50 shadow"
              >
                <FaShoppingCart />
                {addingToCart
                  ? "Adding..."
                  : product.stock === 0
                  ? "Unavailable"
                  : "Add to Cart"}
              </button>

              <AnimatePresence>
                {showTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.22 }}
                    className="absolute -top-11 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-3 py-1 shadow-md"
                  >
                    Please select all required options.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Trust row */}
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <FaTruck /> Free delivery over Rs. 2,000
              </div>
              <div className="flex items-center gap-2">
                <FaUndo /> 7-day easy returns
              </div>
            </div>

            {/* Share / Social */}
            <div className="mt-6 flex items-center gap-3 text-gray-600">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-50"
                aria-label="Share product"
              >
                <FaShareAlt /> Share
              </button>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  shareUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Facebook"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 hover:bg-gray-900 hover:text-white"
                title="Share on Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href={`https://www.instagram.com/`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 hover:bg-gray-900 hover:text-white"
                title="Instagram"
              >
                <FaInstagram />
              </a>
            </div>
          </article>

          <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        </section>
      </div>

      {/* Sticky mobile add to cart bar */}
      {product.stock > 0 && (
        <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-white/95 backdrop-blur border-t border-gray-200 p-3 z-40">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
            <div className="text-base font-semibold">
              Rs. {product.price.toLocaleString()}
            </div>
            <button
              onClick={handleAddToCart}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-black text-white px-4 py-3 rounded-lg font-semibold hover:bg-gray-900"
            >
              <FaShoppingCart /> Add to Cart
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

/* ---------------- Tabs ---------------- */

function Tabs({ tabs, activeTab, setActiveTab }) {
  const tabKeys = Object.keys(tabs);
  return (
    <section className="mt-10">
      <nav className="flex border-b border-gray-200 overflow-x-auto">
        {tabKeys.map((key) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-5 py-3 text-sm sm:text-base font-semibold -mb-px border-b-2 transition
                ${
                  isActive
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          );
        })}
      </nav>
      <div className="bg-gray-50 p-6 rounded-md mt-6 text-gray-700 whitespace-pre-wrap min-h-[120px]">
        {tabs[activeTab]}
      </div>
    </section>
  );
}
