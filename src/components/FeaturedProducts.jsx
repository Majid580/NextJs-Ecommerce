"use client";

import { useState } from "react";
import Image from "next/image";
import { FaHeart, FaShoppingCart, FaStar } from "react-icons/fa";
import { allProducts } from "@/data/allProducts";
import Link from "next/link";

export default function FeaturedProducts() {
  const featuredProducts = allProducts.filter((x) => x.featured);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const productsToShow = isMobile
    ? featuredProducts.slice(0, Math.ceil(featuredProducts.length / 2))
    : featuredProducts;

  return (
    <section className="py-10 px-4 bg-gradient-to-b from-gray-50 to-white">
      <h2
        className="text-2xl font-bold text-center mb-8 text-gray-800"
        data-aos="fade-up"
      >
        🌟 Featured Products
      </h2>

      <div
        className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto"
        data-aos="fade-up"
      >
        {productsToShow.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);

  return (
    <div
      className="group relative bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Product Image */}

      <div className="relative h-72 w-full bg-white flex items-center justify-center">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={hovered ? product.images[1] : product.images[0]}
            alt={product.title}
            fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        {/* Favorite Icon */}
        <button className="absolute top-3 right-3 bg-white/80 p-2 rounded-full shadow hover:bg-red-500 hover:text-white transition">
          <FaHeart />
        </button>

        {/* Rating Badge */}
        <div className="absolute top-3 left-3 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
          <FaStar className="inline mr-1" /> {product.rating}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 truncate">
          {product.title}
        </h3>
        <p className="text-lg font-bold text-gray-900 mt-1">
          ₨ {product.price.toLocaleString()}
        </p>

        {/* Size Options */}
        <div className="flex gap-2 mt-3">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-2 py-1 text-xs border rounded-full transition ${
                selectedSize === size
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        {/* Quantity + Cart */}
        <div className="flex items-center text-black justify-between mt-4">
          <div className="flex items-center border rounded-full overflow-hidden">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 py-1 hover:bg-gray-200"
            >
              -
            </button>
            <span className="px-3 py-1">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="px-3 py-1 hover:bg-gray-200"
            >
              +
            </button>
          </div>

          <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full hover:bg-gray-900 transition">
            <FaShoppingCart /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
