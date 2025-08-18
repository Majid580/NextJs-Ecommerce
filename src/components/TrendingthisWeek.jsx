"use client";

import { useMemo, useState, useEffect } from "react";
import { allProducts } from "@/data/allProducts";
import ProductCard from "./ProductCard";
import FadeUp from "./FadeUp";
import Link from "next/link";

/**
 * TrendingThisWeek (mobile-first, polished)
 * - Clean header with subtitle
 * - Smarter responsive grid
 * - Mobile: initially show a concise set with "Show more" expand
 * - Desktop: show all products
 * - Accessible empty state when no trending items
 */
export default function TrendingThisWeek() {
  const trendingProducts = useMemo(
    () => allProducts.filter((x) => x?.trending),
    []
  );

  // Mobile expand/collapse for long lists
  const [showAllMobile, setShowAllMobile] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Decide how many items to render on small screens
  const mobileVisibleCount = 4; // show 4 on phones by default
  const visibleProducts = useMemo(() => {
    if (isDesktop || showAllMobile) return trendingProducts;
    return trendingProducts.slice(0, mobileVisibleCount);
  }, [isDesktop, showAllMobile, trendingProducts]);

  return (
    <section className="max-w-6xl mx-auto text-black px-4 sm:px-6 py-8 sm:py-12">
      <FadeUp>
        <div className="text-center mb-8 sm:mb-12 px-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Trending This Week
          </h2>
          <p className="text-neutral-600 max-w-xl mx-auto text-sm sm:text-base">
            Find a bright idea to suit your taste with our curated selection of
            products.
          </p>
        </div>
      </FadeUp>

      {trendingProducts.length === 0 ? (
        <div
          role="status"
          className="text-center text-neutral-600 bg-neutral-50 border border-neutral-200 rounded-xl py-10"
        >
          No trending products right now. Check back soon!
        </div>
      ) : (
        <FadeUp>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {visibleProducts.map((product) => (
              <FadeUp key={product.id}>
                <ProductCard product={product} />
              </FadeUp>
            ))}

            {/* Action row */}
            <div className="col-span-full mt-2 sm:mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              {/* Mobile: toggle more/less */}
              {!isDesktop && trendingProducts.length > mobileVisibleCount && (
                <button
                  type="button"
                  onClick={() => setShowAllMobile((v) => !v)}
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 shadow-sm hover:bg-neutral-100"
                >
                  {showAllMobile
                    ? "Show less"
                    : `Show more (${
                        trendingProducts.length - mobileVisibleCount
                      })`}
                </button>
              )}

              {/* Link to full catalog */}
              <Link
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white shadow hover:brightness-110"
              >
                View all products
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
              </Link>
            </div>
          </div>
        </FadeUp>
      )}
    </section>
  );
}
