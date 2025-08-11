"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaShoppingCart, FaFacebookF, FaInstagram } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { allProducts } from "@/data/allProducts";

export default function ProductDetail({ params }) {
  const product = allProducts.find((p) => p.slug === params.slug);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [addingToCart, setAddingToCart] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    setSelectedColor(null);
    setSelectedImage(0);
    setQuantity(1);
    setActiveTab("description");
    setAddingToCart(false);
  }, [product]);

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
  const tabs = {
    description: product.description || "No description available.",
    details: product.details || "No product details available.",
    reviews: product.reviews?.length
      ? product.reviews.join("\n\n")
      : "No reviews yet.",
  };

  const canAddToCart =
    product.stock > 0 && (colors.length === 0 || selectedColor !== null);

  function handleAddToCart() {
    if (!canAddToCart) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2500);
      return;
    }
    setAddingToCart(true);
    setTimeout(() => setAddingToCart(false), 2500);
  }

  return (
    <main className="max-w-5xl mx-auto p-4 sm:p-8 font-sans min-h-screen text-gray-900">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Left: Images */}
        <section className="md:w-1/2">
          <div className="rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm">
            <Image
              src={product.images[selectedImage]}
              alt={`${product.title} image`}
              width={500}
              height={500}
              className="object-contain w-full h-auto bg-white p-4"
            />
          </div>
          <div className="flex flex-wrap gap-3 mt-4 justify-start">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                aria-label={`Select image ${i + 1}`}
                className={`w-20 h-20 rounded-md  focus:outline-none transition ${
                  selectedImage === i
                    ? "scale-130"
                    : "scale-100   border-transparent hover:shadow-orange-400"
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${i + 1}`}
                  width={80}
                  height={80}
                  className="object-contain rounded-md"
                  unoptimized
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </section>

        {/* Right: Info */}
        <section className="md:w-1/2 flex flex-col justify-between">
          <article>
            {/* Stock Badge and Info */}
            <div className="flex items-center gap-4 mb-3">
              <span
                className={`inline-block rounded-full px-3 py-1 text-sm font-semibold text-white ${
                  product.stock > 1 ? "bg-green-600" : "bg-red-600"
                }`}
                aria-live="polite"
              >
                {product.stock > 1 ? "In Stock" : "Out of Stock"}
              </span>
              <span className="text-gray-600 text-sm select-text">
                Stock left: {product.stock}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-semibold mb-5">{product.title}</h1>

            {/* Social Icons */}
            <div className="flex space-x-4 text-gray-600 mb-8">
              <a
                href="#"
                aria-label="Share on Facebook"
                className="hover:text-gray-900 transition"
              >
                <FaFacebookF size={20} />
              </a>
              <a
                href="#"
                aria-label="Share on Instagram"
                className="hover:text-gray-900 transition"
              >
                <FaInstagram size={20} />
              </a>
            </div>

            {/* Price */}
            <p className="text-2xl font-bold mb-6">
              Rs. {product.price.toLocaleString()}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6 max-w-xs">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                -
              </button>
              <span
                className="text-lg font-medium select-text"
                aria-live="polite"
              >
                {quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity((q) => Math.min(product.stock, q + 1))
                }
                disabled={quantity >= product.stock}
                aria-label="Increase quantity"
                className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                +
              </button>
            </div>

            {/* Color Selector */}
            <div className="mb-8">
              <p className="mb-2 font-semibold">Select Color:</p>
              <div className="flex space-x-4">
                {colors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Select color ${color}`}
                    style={{ backgroundColor: color }}
                    className={`w-8 h-8 rounded-full border-2 transition focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-800 ${
                      selectedColor === color
                        ? "border-gray-800"
                        : "border-transparent hover:border-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Add To Cart */}
            <div className="relative max-w-xs">
              <button
                onClick={handleAddToCart}
                disabled={!canAddToCart || addingToCart}
                aria-disabled={!canAddToCart || addingToCart}
                className="flex items-center justify-center gap-3 bg-gray-900 text-white px-6 py-3 rounded-md font-semibold w-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <FaShoppingCart />
                {addingToCart ? "Adding..." : "Add to Cart"}
              </button>

              <AnimatePresence>
                {showTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-600 text-white text-sm rounded px-3 py-1 shadow-md select-none"
                    role="alert"
                  >
                    Please select a color and ensure stock is available.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </article>

          {/* Tabs */}
          <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        </section>
      </div>
    </main>
  );
}

function Tabs({ tabs, activeTab, setActiveTab }) {
  const tabKeys = Object.keys(tabs);

  return (
    <section className="mt-10">
      <nav
        className="flex border-b border-gray-300"
        role="tablist"
        aria-label="Product information tabs"
      >
        {tabKeys.map((key) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              aria-selected={isActive}
              role="tab"
              tabIndex={isActive ? 0 : -1}
              className={`flex-1 py-3 text-center font-semibold cursor-pointer transition-colors ${
                isActive
                  ? "border-b-2 border-gray-900 text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              type="button"
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          );
        })}
      </nav>

      {/* No fade animation on tab content change */}
      <div
        role="tabpanel"
        aria-live="polite"
        className="bg-gray-50 p-6 rounded-md mt-6 text-gray-700 whitespace-pre-wrap min-h-[120px]"
      >
        {tabs[activeTab]}
      </div>
    </section>
  );
}
