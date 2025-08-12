"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaShoppingCart, FaFacebookF, FaInstagram } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { allProducts } from "@/data/allProducts";
import { useDispatch } from "react-redux";
import { addItem } from "@/redux/slices/cartSlice";
import toast from "react-hot-toast";

export default function ProductDetail({ params }) {
  const product = allProducts.find((p) => p.slug === params.slug);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null); // NEW for sizes
  const [activeTab, setActiveTab] = useState("description");
  const [addingToCart, setAddingToCart] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setSelectedColor(null);
    setSelectedSize(null);
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

  const sizes = product.sizes?.length ? product.sizes : []; // Optional

  const tabs = {
    description: product.description || "No description available.",
    details: product.details || "No product details available.",
    reviews: product.reviews?.length
      ? product.reviews.join("\n\n")
      : "No reviews yet.",
  };

  // Validation: Must have stock, color (if available), and size (if available)
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
          <div className="flex flex-wrap gap-1 mt-4 justify-start">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                aria-label={`Select image ${i + 1}`}
                className={`w-20 h-20 rounded-md border transition ${
                  selectedImage === i
                    ? "border-gray-800 scale-110"
                    : "border-transparent hover:border-gray-400"
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${i + 1}`}
                  width={40}
                  height={60}
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
                className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
              >
                -
              </button>
              <span className="text-lg font-medium">{quantity}</span>
              <button
                onClick={() =>
                  setQuantity((q) => Math.min(product.stock, q + 1))
                }
                disabled={quantity >= product.stock}
                className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
              >
                +
              </button>
            </div>

            {/* Size Selector (if available) */}
            {sizes.length > 0 && (
              <div className="mb-8">
                <p className="mb-2 font-semibold">Select Size:</p>
                <div className="flex space-x-2">
                  {sizes.map((size, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1 rounded border ${
                        selectedSize === size
                          ? "border-gray-800"
                          : "border-gray-300 hover:border-gray-500"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

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

            {/* Add To Cart */}
            <div className="relative max-w-xs">
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-3 bg-gray-900 text-white px-6 py-3 rounded-md font-semibold w-full hover:bg-gray-800 disabled:opacity-50"
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
                    className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-600 text-white text-sm rounded px-3 py-1 shadow-md"
                  >
                    Please select all required options.
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
      <nav className="flex border-b border-gray-300">
        {tabKeys.map((key) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 py-3 text-center font-semibold ${
                isActive
                  ? "border-b-2 border-gray-900 text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
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
