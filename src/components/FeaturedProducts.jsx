"use client";

import { useState } from "react";
import Image from "next/image";
import { FaHeart, FaShoppingCart, FaStar } from "react-icons/fa";
import { allProducts } from "@/data/allProducts";
import Link from "next/link";
import FadeUp from "./FadeUp";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  removeItem,
  increaseQuantity,
  decreaseQuantity,
  selectCartItems,
} from "@/redux/slices/cartSlice";
import toast from "react-hot-toast";
export default function FeaturedProducts() {
  const featuredProducts = allProducts.filter((x) => x.featured);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const productsToShow = isMobile
    ? featuredProducts.slice(0, Math.ceil(featuredProducts.length / 2))
    : featuredProducts;

  return (
    <FadeUp>
      <section className="py-10 px-4 bg-gradient-to-b from-gray-50 to-white">
        <FadeUp>
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
            🌟 Featured Products
          </h2>
        </FadeUp>
        <FadeUp>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {productsToShow.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </FadeUp>
      </section>
    </FadeUp>
  );
}

function ProductCard({ product }) {
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
    <div
      className="group relative bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 w-full max-w-xs mx-auto text-black"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Product Image */}
      <div className="relative h-64 w-full bg-white flex items-center justify-center">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={
              hovered && product.images[1]
                ? product.images[1]
                : product.images[0]
            }
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Favorite Icon */}
        <button
          className="absolute top-3 right-3 bg-white/80 p-2 rounded-full shadow hover:bg-red-500 hover:text-white transition"
          aria-label="Add to wishlist"
        >
          <FaHeart />
        </button>

        {/* Rating Badge */}
        {product.rating && (
          <div className="absolute top-3 left-3 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
            <FaStar className="inline mr-1" /> {product.rating}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col gap-3">
        <h3 className="font-semibold text-gray-800 truncate">
          {product.title}
        </h3>
        <p className="text-lg font-bold text-gray-900">
          ₨ {product.price.toLocaleString()}
        </p>

        {/* Size Options */}
        {product.sizes?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-1 text-xs border rounded-full transition ${
                  selectedSize === size
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
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
    </div>
  );
}
