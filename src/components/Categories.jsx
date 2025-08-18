"use client";
import Image from "next/image";
import FadeUp from "./FadeUp";
import Link from "next/link";
import { motion } from "framer-motion";

/**
 * Refined, mobile-first Categories section
 * - Clean cards with soft borders and shadows (no gradient borders)
 * - Images use object-contain with padding (no cropping/zooming)
 * - Overlay text and CTA button styled beautifully
 */
export default function Categories() {
  const categories = [
    {
      key: "women",
      label: "Women",
      href: "/categories/women",
      img: "/images/women.png",
      alt: "Women Category",
    },
    {
      key: "kids",
      label: "Kids",
      href: "/categories/kids",
      img: "/images/kids.png",
      alt: "Kids Category",
    },
  ];

  return (
    <FadeUp>
      <section className="relative w-full px-4 sm:px-6 py-10 sm:py-14">
        {/* Background accents */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-amber-200/30 blur-2xl" />
          <div className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-orange-200/30 blur-2xl" />
        </div>

        <div className="mx-auto max-w-6xl">
          {/* Section header */}
          <div className="mb-6 sm:mb-8 flex items-end justify-between">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
              Shop by Category
            </h2>
            <span className="hidden sm:block text-sm text-neutral-600">
              Handpicked styles you’ll love
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 md:gap-8">
            {categories.map((cat) => (
              <Link
                key={cat.key}
                href={cat.href}
                aria-label={`Shop ${cat.label}`}
              >
                <motion.article
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.99 }}
                  className="group relative rounded-2xl overflow-hidden bg-white border border-neutral-200 shadow-md hover:shadow-lg transition-shadow"
                >
                  {/* Image wrapper */}
                  <div className="relative w-full aspect-[4/3] flex items-center justify-center bg-neutral-50">
                    <Image
                      src={cat.img}
                      alt={cat.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                      priority={false}
                      className="object-contain p-6 sm:p-8 select-none transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    {/* Subtle overlay for legibility */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                  </div>

                  {/* Overlay content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <h3 className="text-white text-2xl sm:text-3xl md:text-4xl font-extrabold drop-shadow">
                      {cat.label}
                    </h3>
                    <span className="mt-1 text-white/90 text-xs sm:text-sm">
                      Explore new arrivals
                    </span>

                    <div className="mt-3 sm:mt-4">
                      <span className="inline-flex items-center justify-center rounded-lg bg-white px-4 sm:px-5 py-2 text-sm font-semibold text-neutral-900 shadow hover:scale-105 transition-transform">
                        Shop Now
                        <svg
                          className="ml-2 h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                        >
                          <path d="M5 12h14" />
                          <path d="M12 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </FadeUp>
  );
}
