"use client";
import Image from "next/image";
import FadeUp from "./FadeUp";

export default function HeroSection() {
  return (
    <FadeUp>
      <section className="bg-white w-full px-3 sm:px-6 py-6">
        <div className="max-w-6xl mx-auto shadow-md rounded-lg flex items-center bg-[#fdf5e6] overflow-hidden">
          {/* Left side - text */}
          <div className="flex-1 p-4 sm:p-8 md:p-10">
            {/* Vertical line and small text */}
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <div className="w-[2px] h-5 sm:h-6 bg-black"></div>
              <span className="text-xs sm:text-sm uppercase tracking-wide text-black">
                Lightning 2019
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-black">
              ETNA
            </h1>

            {/* Shop Now button */}
            <button className="border border-black px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm hover:bg-black hover:text-white transition text-black">
              Shop Now
            </button>
          </div>

          {/* Right side - image */}
          <div className="flex-1 flex justify-center items-center p-2 sm:p-4">
            <Image
              src="/images/hero.png"
              alt="ETNA Product"
              width={350}
              height={350}
              className="object-contain max-w-full h-auto"
              priority
            />
          </div>
        </div>
      </section>
    </FadeUp>
  );
}
