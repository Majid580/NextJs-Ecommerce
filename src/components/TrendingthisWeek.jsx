"use client";

import { allProducts } from "@/data/allProducts";
import ProductCard from "./ProductCard";
export default function TrendingThisWeek() {
  const trendingProducts = allProducts.filter((x) => x.trending);
  return (
    <section className="max-w-6xl mx-auto text-black px-4 sm:px-6 py-8 sm:py-12">
      <div className="text-center mb-8 sm:mb-12 px-2 " data-aos="fade-up">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">
          Trending This Week
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto text-sm sm:text-base">
          Find a bright idea to suit your taste with our great selection of
          products.
        </p>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
        data-aos="fade-up"
      >
        {trendingProducts.map((product, index) => (
          <div
            key={product.id}
            className={`${
              index >= trendingProducts.length / 2 ? "hidden sm:block" : ""
            }`}
          >
            <ProductCard product={product} />
          </div>
        ))}
        {/* Show All Products Button */}
        <div className="col-span-full flex justify-center mt-6">
          <button
            type="button"
            className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition"
          >
            Show All Products
          </button>
        </div>
      </div>
    </section>
  );
}
