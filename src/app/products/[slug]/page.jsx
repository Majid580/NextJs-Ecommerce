"use client";
import { allProducts } from "@/data/allProducts";
import Image from "next/image";
import { useState } from "react";
export default function ProductDetail({ params }) {
  const [hovered, setHovered] = useState(false);
  const product = allProducts.find((p) => p.slug === params.slug);

  // Handle if product is not found
  if (!product) {
    return (
      <div className="p-6 text-center text-red-500">Product not found</div>
    );
  }

  return (
    <div
      className="max-w-md mx-auto p-4"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Image
        src={hovered ? product.images[1] : product.images[0]}
        alt={product.title}
        width={500}
        height={500}
        style={{ objectFit: "contain" }}
        className="w-full h-64 object-cover rounded-lg"
      />
      <h1 className="text-2xl font-bold mt-4">{product.title}</h1>
      <p className="text-gray-600 mt-2">Price: Rs. {product.price}</p>
      <p className="mt-4 text-sm text-gray-500">
        {product.description || "No description available."}
      </p>
      <button className="mt-6 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800">
        Add to Cart
      </button>
    </div>
  );
}
