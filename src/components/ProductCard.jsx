"use client";

import { useState } from "react";
import Image from "next/image";
import { FaHeart, FaStar, FaShoppingCart } from "react-icons/fa";
import { IoIosHeartEmpty } from "react-icons/io";
import { CiStar } from "react-icons/ci";
export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);

  const toggleHover = () => setHovered(!hovered);
  const increaseQuantity = () => setQuantity((q) => q + 1);
  const decreaseQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  return (
    <div className="rounded-md p-3 shadow-lg hover:shadow-2xl transition w-full max-w-xs mx-auto bg-white">
      <div
        className="relative cursor-pointer overflow-hidden rounded-md"
        onMouseEnter={toggleHover}
        onMouseLeave={toggleHover}
      >
        {/* Images sliding effect */}
        <Image
          src={hovered ? product.images[1] : product.images[0]}
          alt={product.title}
          width={300}
          height={350}
          className="w-full h-[350px] object-cover rounded-md transition-transform duration-500"
          priority
        />

        {/* Heart & Review icons */}
        <div className="absolute top-2 right-2 flex space-x-2 bg-white bg-opacity-90 rounded-md p-1 shadow">
          <button
            aria-label="Add to favorites"
            className="text-red-600 hover:text-red-800"
          >
            <IoIosHeartEmpty size={20} />
          </button>
          <button
            aria-label="Quick review"
            className="text-yellow-500 hover:text-yellow-600"
          >
            <CiStar size={20} />
          </button>
        </div>

        {/* Size options */}
        <div className="absolute bottom-2 left-2 flex space-x-2 bg-white bg-opacity-90 rounded-md p-1 shadow">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-2 py-1 border rounded text-xs font-medium ${
                selectedSize === size
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-gray-300"
              } hover:bg-black hover:text-white transition`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <h3 className="font-bold mt-3 text-lg truncate text-gray-900">
        {product.title}
      </h3>

      {/* Price */}
      <p className="text-gray-700 mt-1">₨ {product.price.toLocaleString()}</p>

      {/* Quantity & Add to Cart */}
      <div className="flex items-center justify-between mt-3 text-black space-x-2">
        <div className="flex items-center border rounded max-w-[110px]">
          <button
            onClick={decreaseQuantity}
            className="px-3 py-1  hover:bg-gray-200 transition"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="px-3 py-1 text-center w-8">{quantity}</span>
          <button
            onClick={increaseQuantity}
            className="px-3 py-1 hover:bg-gray-200 transition"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button
          type="button"
          className="flex items-center space-x-1 bg-black text-white px-3 py-2 rounded hover:bg-gray-900 transition text-sm"
        >
          <FaShoppingCart />
          <span>Add to cart</span>
        </button>
      </div>
    </div>
  );
}
