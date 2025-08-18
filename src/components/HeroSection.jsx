"use client";
import Image from "next/image";
import FadeUp from "./FadeUp";

export default function HeroSection() {
  return (
    <FadeUp>
      {/* Outer wrapper with soft gradient background and subtle pattern */}
      <section className="relative w-full overflow-hidden">
        {/* Decorative background blobs */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full blur-3xl opacity-30 bg-amber-300" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full blur-3xl opacity-30 bg-orange-400" />
        </div>

        {/* Subtle grid pattern */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,_rgba(0,0,0,0.05)_1px,_transparent_0)] [background-size:16px_16px]"
        />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          {/* Card */}
          <div className="relative rounded-3xl border border-amber-200/60 bg-[#fff8ea] shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden">
            {/* Elegant top accent bar */}
            <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-6 items-center p-5 sm:p-8 md:p-10">
              {/* Left: copy */}
              <div className="order-2 md:order-1">
                {/* Eyebrow */}
                <div className="mb-3 flex items-center gap-3 text-neutral-900">
                  <span className="inline-flex items-center rounded-full bg-black/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white shadow-sm ring-1 ring-black/5">
                    New Drop
                  </span>
                  <div className="h-4 w-px bg-neutral-300" />
                  <span className="text-xs sm:text-sm tracking-wide">
                    Lightning 2019
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-neutral-900">
                  <span className="bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-transparent">
                    ETNA
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="mt-3 sm:mt-4 max-w-prose text-sm sm:text-base text-neutral-700">
                  Crafted for speed and comfort. A timeless silhouette with
                  premium materials and a finish that turns heads.
                </p>

                {/* CTAs */}
                <div className="mt-5 sm:mt-7 flex flex-wrap items-center gap-3">
                  <a
                    href="#shop"
                    className="inline-flex items-center justify-center rounded-xl bg-black px-4 sm:px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/10 transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50"
                    aria-label="Shop ETNA now"
                  >
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
                  </a>
                  <a
                    href="#details"
                    className="inline-flex items-center justify-center rounded-xl border border-neutral-900/80 bg-white px-4 sm:px-5 py-2.5 text-sm font-semibold text-neutral-900 shadow-sm transition hover:bg-neutral-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/30"
                  >
                    Learn More
                  </a>
                </div>

                {/* Trust row */}
                <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-600">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    In stock & ready to ship
                  </div>
                  <div className="h-3 w-px bg-neutral-300 hidden sm:block" />
                  <div>Free returns within 30 days</div>
                </div>
              </div>

              {/* Right: image */}
              <div className="order-1 md:order-2 relative flex items-center justify-center">
                {/* Decorative ring behind image */}
                <div
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="h-56 w-56 sm:h-72 sm:w-72 md:h-80 md:w-80 rounded-full bg-gradient-to-br from-white via-amber-100 to-orange-100 blur-xl opacity-80" />
                </div>

                <div className="relative z-10">
                  <Image
                    src="/images/hero.png"
                    alt="ETNA Product"
                    width={520}
                    height={520}
                    priority
                    className="h-auto max-h-[360px] sm:max-h-[420px] md:max-h-[460px] w-auto drop-shadow-xl select-none"
                  />

                  {/* Floating tag */}
                  <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 rounded-full bg-white/90 px-3 py-1 text-[10px] sm:text-xs font-semibold text-black shadow-md ring-1 ring-black/5">
                    Bestseller
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom meta strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-amber-200/60 px-5 sm:px-8 md:px-10 py-3 text-xs text-neutral-700">
              <div className="flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Free shipping over $50
              </div>
              <div className="flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Fast 2–3 day delivery
              </div>
              <div className="flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                4.8/5 from 2k+ reviews
              </div>
            </div>
          </div>
        </div>
      </section>
    </FadeUp>
  );
}
