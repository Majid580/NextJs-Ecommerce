"use client";
import { allProducts } from "@/data/allProducts";
import Image from "next/image";
import { useState } from "react";
import { FaFacebook, FaInstagram, FaShoppingCart } from "react-icons/fa";

export default function ProductDetail({ params }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const product = allProducts.find((p) => p.slug === params.slug);
  if (!product) {
    return (
      <div className="p-6 text-center text-red-500">Product not found</div>
    );
  }

  const isInStock = product.stock > 1;

  return (
    <div className="max-w-6xl mx-auto text-black p-4">
      {/* Flex for desktop, stacked for mobile */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left side - Image + Thumbnails */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div className="w-full rounded-lg overflow-hidden shadow-lg bg-white p-2">
            <Image
              src={product.images[selectedImage]}
              alt={product.title}
              width={600}
              height={600}
              className="w-full h-auto object-contain"
            />
          </div>
          {/* Thumbnails */}
          <div className="flex gap-2 mt-4">
            {product.images.map((img, idx) => (
              <div
                key={idx}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 cursor-pointer transition 
                  ${
                    selectedImage === idx ? "border-black" : "border-gray-200"
                  }`}
                onClick={() => setSelectedImage(idx)}
              >
                <Image
                  src={img}
                  alt={`${product.title} thumbnail ${idx + 1}`}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full hover:opacity-80"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Product Info */}
        <div className="w-full md:w-1/2 space-y-4">
          {/* Stock badge */}
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 text-sm font-semibold rounded-full ${
                isInStock ? "bg-green-500 text-white" : "bg-red-500 text-white"
              }`}
            >
              {isInStock ? "In Stock" : "Out of Stock"}
            </span>
            <span className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-full">
              {product.stock} Available
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold">{product.title}</h1>

          {/* Socials */}
          <div className="flex gap-4 text-gray-600">
            <FaFacebook className="text-2xl hover:text-blue-600 cursor-pointer" />
            <FaInstagram className="text-2xl hover:text-pink-500 cursor-pointer" />
          </div>

          {/* Price */}
          <p className="text-2xl font-bold text-black">Rs. {product.price}</p>

          {/* Quantity controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
            >
              -
            </button>
            <span className="text-lg font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
            >
              +
            </button>
          </div>

          {/* Add to cart button */}
          <button className="flex items-center justify-center gap-2 w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition">
            <FaShoppingCart />
            Add to Cart
          </button>

          {/* Tabs */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            {/* Tab buttons */}
            <div className="flex md:flex-col gap-2">
              {["description", "details", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-semibold capitalize transition ${
                    activeTab === tab
                      ? "bg-black text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 bg-white p-4 rounded-lg shadow-md text-sm text-gray-700">
              {activeTab === "description" && (
                <p>{product.description || "No description available."}</p>
              )}
              {activeTab === "details" && <p>Product details go here...</p>}
              {activeTab === "reviews" && <p>No reviews yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
