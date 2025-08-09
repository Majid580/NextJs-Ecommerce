"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function DealOfTheDay() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const now = new Date();
    const nextReset = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0
    );
    const diff = nextReset - now;
    return diff > 0 ? diff : 24 * 60 * 60 * 1000;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds };
  };

  const { days, hours, minutes, seconds } = formatTime(timeLeft);

  return (
    <section
      className="w-full bg-[#fdf5e6] max-w-6xl mx-auto text-black rounded-lg overflow-hidden shadow-lg my-12
      flex flex-col sm:flex-row items-stretch"
    >
      {/* Left side */}
      <div className="w-full sm:w-1/2 relative h-64 sm:h-auto">
        <div className="relative h-full">
          <Image
            src="/images/hero.png"
            alt="Deal of the Day"
            fill
            style={{ objectFit: "contain" }}
            priority
            className="rounded-l-lg"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="w-full sm:w-1/2 relative bg-white p-8 flex flex-col justify-center items-center space-y-8 overflow-hidden rounded-r-lg">
        {/* Smaller background image, size relative to container height */}
        <div className="absolute top-4 right-[-2rem] opacity-40 z-0 h-48 w-48 sm:h-64 sm:w-64 ">
          <Image
            src="/images/HurryUp.png"
            alt="Background"
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </div>

        <h2 className="text-3xl font-bold">Deals of the Days</h2>

        {/* Timer */}
        <div className="flex space-x-6 text-center font-mono text-4xl font-bold">
          <div>
            <div>{days}</div>
            <div className="text-sm font-normal text-gray-600">Days</div>
          </div>
          <div>:</div>
          <div>
            <div>{hours.toString().padStart(2, "0")}</div>
            <div className="text-sm font-normal text-gray-600">Hours</div>
          </div>
          <div>:</div>
          <div>
            <div>{minutes.toString().padStart(2, "0")}</div>
            <div className="text-sm font-normal text-gray-600">Min</div>
          </div>
          <div>:</div>
          <div>
            <div>{seconds.toString().padStart(2, "0")}</div>
            <div className="text-sm font-normal text-gray-600">Sec</div>
          </div>
        </div>

        {/* Prices */}
        <div className="flex items-center space-x-4">
          <span className="text-orange-600 text-3xl font-bold">$100</span>
          <span className="line-through text-gray-400 text-lg">$500</span>
        </div>

        {/* Shop Now Button */}
        <button className="border border-black px-10 py-3 hover:bg-black hover:text-white transition text-sm font-semibold">
          SHOP NOW
        </button>
      </div>
    </section>
  );
}
