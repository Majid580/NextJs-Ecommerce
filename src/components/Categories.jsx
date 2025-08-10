"use client";
import Image from "next/image";
export default function Categories() {
  return (
    <section className="bg-white w-full px-3 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Women Category */}
        <div className="relative group rounded-lg overflow-hidden shadow-md">
          <Image
            src="/images/women.png"
            alt="Women Category"
            width={600}
            height={400}
            className="object-contain w-full h-64 sm:h-80 md:h-96 transition-transform duration-500 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
            <h2 className="text-2xl sm:text-3xl font-bold">Women</h2>
            <button className="mt-3 border border-white px-4 py-2 text-sm hover:bg-white hover:text-black transition">
              Shop Now
            </button>
          </div>
        </div>

        {/* Kids Category */}
        <div className="relative group rounded-lg overflow-hidden shadow-md">
          <Image
            src="/images/kids.png"
            alt="Kids Category"
            width={600}
            height={400}
            className="object-contain w-full h-64 sm:h-80 md:h-96 transition-transform duration-500 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
            <h2 className="text-2xl sm:text-3xl font-bold">Kids</h2>
            <button className="mt-3 border border-white px-4 py-2 text-sm hover:bg-white hover:text-black transition">
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
