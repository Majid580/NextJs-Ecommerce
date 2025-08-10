"use client";
import FadeUp from "@/components/FadeUp";
import { allProducts } from "@/data/allProducts";
import Image from "next/image";
import { useState } from "react";
import { FaShoppingCart, FaFacebookF, FaInstagram } from "react-icons/fa";

export default function ProductDetail({ params }) {
  const [hovered, setHovered] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const product = allProducts.find((p) => p.slug === params.slug);

  if (!product) {
    return (
      <div className="p-6 text-center text-red-500">Product not found</div>
    );
  }

  const colors = ["#000000", "#FF0000", "#0000FF"]; // Example colors
  const tabs = {
    description: product.description || "No description available.",
    details: product.details || "No product details available.",
    reviews: product.reviews?.length
      ? product.reviews.join("\n")
      : "No reviews yet.",
  };
  return (
    <FadeUp>
      <div className="max-w-6xl mx-auto text-black p-4" data-aos="fade-up">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Side: Image + Thumbnails */}
          <div className="w-full md:w-1/2">
            {/* Main Image */}
            <div className=" rounded-lg overflow-hidden relative">
              <Image
                src={product.images[selectedImage]}
                alt={product.title}
                width={500}
                height={500}
                className="w-full h-auto object-contain bg-white p-2"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 mt-3 justify-center md:justify-start">
              {product.images.map((img, idx) => (
                <Image
                  key={idx}
                  src={img}
                  alt={`Thumbnail ${idx}`}
                  width={70}
                  height={70}
                  className={`cursor-pointer rounded-md border-2 transition ${
                    selectedImage === idx
                      ? "border-black"
                      : "border-transparent hover:border-gray-400"
                  }`}
                  onClick={() => setSelectedImage(idx)}
                />
              ))}
            </div>
          </div>

          {/* Right Side: Product Info */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            {/* Stock Badge */}
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${
                  product.stock > 1 ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {product.stock > 1 ? "In Stock" : "Out of Stock"}
              </span>
              <span className="text-gray-500 text-sm">
                Total Stock: {product.stock}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold">{product.title}</h1>

            {/* Social Icons */}
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                <FaInstagram />
              </a>
            </div>

            {/* Price */}
            <p className="text-xl font-bold">Rs. {product.price}</p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>

            {/* Color Selection */}
            <div>
              <p className="mb-2 font-semibold">Select Color:</p>
              <div className="flex gap-2">
                {colors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(color)}
                    style={{ backgroundColor: color }}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === color ? "border-black" : "border"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Add to Cart */}
            <button className="flex items-center justify-center gap-2 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition">
              <FaShoppingCart /> Add to Cart
            </button>

            {/* Tabs */}
            <div className="flex flex-col md:flex-row gap-4 mt-6">
              <div className="flex flex-col gap-2 md:w-1/3">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`py-2 rounded ${
                    activeTab === "description"
                      ? "bg-black text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab("details")}
                  className={`py-2 rounded ${
                    activeTab === "details"
                      ? "bg-black text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  Product Details
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`py-2 rounded ${
                    activeTab === "reviews"
                      ? "bg-black text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  Reviews
                </button>
              </div>
              <div className="md:w-2/3 bg-gray-50 p-4 rounded shadow whitespace-pre-line">
                <p>{tabs[activeTab]}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FadeUp>
  );
}
