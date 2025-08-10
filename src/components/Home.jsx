import HeroSection from "@/components/HeroSection";
import Categories from "./Categories";
import TrendingThisWeek from "./TrendingthisWeek";
import DealOfTheDay from "./DealOfTheDay";
import FeaturedProducts from "./FeaturedProducts";

export default function Home() {
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
