"use client";

import { useState } from "react";
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
    <div className="rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 w-full max-w-xs mx-auto bg-white border border-gray-100">
      {/* Product Image */}
      <div
        className="relative cursor-pointer overflow-hidden rounded-lg group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Link href={`/products/${product.slug}`}>
          <Image
            src={hovered ? product.images[1] : product.images[0]}
            alt={product.title}
            width={300}
            height={350}
            className="w-full h-[350px] object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-500"
            priority
          />
        </Link>

        {/* Floating Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            aria-label="Add to favorites"
            className="p-2 bg-white rounded-full shadow-md hover:scale-105 transition"
          >
            <IoIosHeartEmpty size={18} className="text-red-500" />
          </button>
          <button
            aria-label="Quick review"
            className="p-2 bg-white rounded-full shadow-md hover:scale-105 transition"
          >
            <CiStar size={18} className="text-yellow-500" />
          </button>
        </div>

        {/* Size Options */}
        {sizes.length > 0 && (
          <div className="absolute bottom-3 left-3 flex gap-2 bg-white bg-opacity-90 rounded-lg p-1 shadow-md">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-2 py-1 text-xs rounded-md font-medium transition ${
                  selectedSize === size
                    ? "bg-black text-white"
                    : "bg-white text-gray-800 border border-gray-300 hover:bg-black hover:text-white"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Details */}
      <h3 className="font-semibold mt-3 text-lg truncate text-gray-900">
        {product.title}
      </h3>
      <p className="text-gray-700 mt-1 font-medium">
        ₨ {product.price.toLocaleString()}
      </p>

      {/* Color Selector */}
      {colors.length > 0 && (
        <div className="mt-3">
          <p className="text-sm font-medium mb-1">Select Color:</p>
          <div className="flex gap-2">
            {colors.map((color, i) => (
              <button
                key={i}
                onClick={() => setSelectedColor(color)}
                style={{ backgroundColor: color }}
                className={`w-7 h-7 rounded-full border-2 transition ${
                  selectedColor === color
                    ? "border-gray-800 scale-110"
                    : "border-gray-300 hover:border-gray-500"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quantity + Add to Cart */}
      <div className="mt-4 flex items-center gap-3">
        {/* Quantity */}
        <div className="flex items-center border rounded-lg overflow-hidden">
          <button
            onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition hover:cursor-pointer"
          >
            -
          </button>
          <span className="px-4">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition hover:cursor-pointer"
          >
            +
          </button>
        </div>

        {/* Add to Cart Button */}
        <div className="relative flex-1">
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2 bg-black text-white px-5 py-3 rounded-lg font-semibold w-full hover:bg-gray-800 transition disabled:opacity-50"
          >
            <FaShoppingCart />
            {addingToCart ? "Adding..." : "Add"}
          </button>

          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="absolute -top-10 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs rounded px-3 py-1 shadow-lg"
              >
                Please select all required options.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
