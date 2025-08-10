"use client"; // ← add this at the top

import HeroSection from "@/components/HeroSection";
import Categories from "./Categories";
import TrendingThisWeek from "./TrendingthisWeek";
import DealOfTheDay from "./DealOfTheDay";
import FeaturedProducts from "./FeaturedProducts";
import useAOS from "@/hooks/useAos";

export default function Home() {
  useAOS(1000);

  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      {/* More sections will go here later */}
      <Categories />
      <TrendingThisWeek />
      <DealOfTheDay />
      <FeaturedProducts />
    </main>
  );
}
