"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { FaShoppingCart } from "react-icons/fa";
import { IoIosHeartEmpty } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { CiStar } from "react-icons/ci";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addItem } from "@/redux/slices/cartSlice";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const dispatch = useDispatch();

  const colors = product.colors?.length
    ? product.colors
    : ["#000000", "#FF0000", "#0000FF"];
  const sizes = product.sizes?.length ? product.sizes : [];
  const imgCount = product.images?.length || 0;

  const canAddToCart =
    product.stock > 0 &&
    (colors.length === 0 || selectedColor !== null) &&
    (sizes.length === 0 || selectedSize !== null);

  const currentImageSrc = useMemo(() => {
    if (!imgCount) return "/placeholder.png";
    const base = product.images[selectedImage] || product.images[0];
    if (!hovered || imgCount < 2) return base;
    const next = product.images[(selectedImage + 1) % imgCount];
    return next || base;
  }, [hovered, selectedImage, imgCount, product.images]);

  const lowStock = product.stock > 0 && product.stock <= 10;

  const handleAddToCart = () => {
    if (!canAddToCart) {
      if (colors.length > 0 && selectedColor === null) {
        toast.error("Please select a color first!");
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 1600);
        return;
      }
      if (sizes.length > 0 && selectedSize === null) {
        toast.error("Please select a size first!");
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 1600);
        return;
      }
      toast.error("Please select all required options.");
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 1600);
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
    <motion.div
      whileHover={{ y: -2 }}
      className="group relative w-full max-w-sm mx-auto rounded-2xl bg-white border border-gray-100/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Glow border on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-gray-200/70 group-hover:shadow-[0_0_0_1px_rgba(0,0,0,0.03)]"></div>

      {/* Product media */}
      <div className="relative">
        {/* Badges */}
        <div className="absolute left-3 top-3 z-10 flex gap-2">
          {product.stock === 0 && (
            <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide bg-gray-900 text-white rounded-full shadow">
              Sold out
            </span>
          )}
          {lowStock && (
            <span className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide bg-amber-100 text-amber-800 rounded-full border border-amber-200">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Floating action buttons */}
        <div className="absolute right-3 top-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            aria-label="Add to favorites"
            className="p-2 bg-white rounded-full shadow-md hover:scale-105 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20"
          >
            <IoIosHeartEmpty size={18} className="text-rose-500" />
          </button>
          <button
            aria-label="Quick review"
            className="p-2 bg-white rounded-full shadow-md hover:scale-105 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20"
          >
            <CiStar size={18} className="text-yellow-500" />
          </button>
        </div>

        {/* Image */}
        <Link href={`/products/${product.slug}`} className="block">
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <Image
              src={currentImageSrc}
              alt={product.title}
              fill
              sizes="(max-width: 480px) 90vw, (max-width: 768px) 50vw, 300px"
              className="object-cover will-change-transform duration-500 ease-out transform group-hover:scale-105"
              priority
            />
          </div>
        </Link>

        {/* Thumbnail strip */}
        {imgCount > 1 && (
          <div className="px-3 pt-2 pb-1">
            <div className="flex gap-2 overflow-x-auto scrollbar-none">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative shrink-0 h-12 w-10 rounded-lg overflow-hidden border transition ${
                    selectedImage === idx
                      ? "border-gray-900"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  aria-label={`Select image ${idx + 1}`}
                >
                  <Image
                    src={img}
                    alt={product.title + " thumbnail"}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4">
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="font-semibold text-base sm:text-lg text-gray-900 line-clamp-2 hover:underline underline-offset-4 decoration-gray-300">
            {product.title}
          </h3>
        </Link>

        <div className="mt-1 flex items-center justify-between">
          <p className="text-gray-900 font-semibold text-lg">
            ₨ {Number(product.price).toLocaleString()}
          </p>
        </div>

        {/* Color selector */}
        {colors.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-medium mb-1">Color</p>
            <div className="flex flex-wrap gap-2">
              {colors.map((color, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedColor(color)}
                  className={`relative h-7 w-7 rounded-full border-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20 ${
                    selectedColor === color
                      ? "border-gray-900"
                      : "border-gray-300 hover:border-gray-500"
                  }`}
                  aria-label={`Select color ${color}`}
                  style={{ backgroundColor: color }}
                >
                  {selectedColor === color && (
                    <span className="absolute inset-0 rounded-full ring-2 ring-offset-[2px] ring-offset-white ring-gray-900/80"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Size selector */}
        {sizes.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-medium mb-1">Size</p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-2.5 py-1.5 text-xs rounded-md font-medium transition border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20 ${
                    selectedSize === size
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-800 border-gray-300 hover:bg-gray-900 hover:text-white"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stock indicator */}
        <div className="mt-3">
          {product.stock > 0 ? (
            <div className="flex items-center gap-3">
              <div className="relative h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-gray-900"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(6, (product.stock / 50) * 100)
                    )}%`,
                  }}
                />
              </div>
              <span className="text-xs text-gray-600 whitespace-nowrap">
                {lowStock
                  ? `Only ${product.stock} left`
                  : `${product.stock}+ in stock`}
              </span>
            </div>
          ) : (
            <span className="text-sm text-gray-500">Currently unavailable</span>
          )}
        </div>

        {/* Quantity + Add to cart */}
        <div className="mt-4 flex items-center gap-3">
          {/* Quantity */}
          <div className="flex items-center border rounded-lg overflow-hidden">
            <button
              onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
              className="px-3 py-2 bg-gray-50 hover:bg-gray-100 transition hover:cursor-pointer select-none"
              aria-label="Decrease quantity"
            >
              –
            </button>
            <span className="px-4 min-w-[2ch] text-center">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="px-3 py-2 bg-gray-50 hover:bg-gray-100 transition hover:cursor-pointer select-none"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Add button */}
          <div className="relative flex-1">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-lg font-semibold w-full hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20"
            >
              {addingToCart ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-[2px] border-white/50 border-t-white" />
                  Adding…
                </span>
              ) : (
                <>
                  <FaShoppingCart />
                  Add
                </>
              )}
            </motion.button>

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
      </div>
    </motion.div>
  );
}
