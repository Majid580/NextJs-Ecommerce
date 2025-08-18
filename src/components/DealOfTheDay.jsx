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

  // ✅ Here we destructure the values
  const { days, hours, minutes, seconds } = formatTime(timeLeft);

  return (
    <section
      className="
        relative mx-auto my-12 w-full max-w-6xl
        overflow-hidden rounded-2xl shadow-lg
        bg-[#fdf5e6] grid grid-cols-1 sm:grid-cols-2
      "
    >
      {/* Left side (product image area) */}
      <div className="relative w-full aspect-[4/3] sm:aspect-auto sm:min-h-[360px] md:min-h-[420px] bg-white">
        <Image
          src="/images/hero.png"
          alt="Deal of the Day"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
          className="object-contain p-4"
          priority
        />
      </div>

      {/* Right side (content with decorative bg) */}
      <div
        className="
          relative flex flex-col items-center justify-center
          space-y-8 p-6 sm:p-8
          bg-white rounded-r-2xl
          overflow-hidden
          bg-no-repeat
          [background-position:center]
          sm:[background-position:right_center]
          [background-size:110px_auto]
          sm:[background-size:150px_auto]
          md:[background-size:200px_auto]
          lg:[background-size:260px_auto]
          xl:[background-size:320px_auto]
        "
        style={{ backgroundImage: "url(/images/HurryUp.png)" }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-center">
          Deals of the Days
        </h2>

        {/* Timer */}
        <div className="flex items-center gap-4 sm:gap-6 text-center font-mono text-3xl sm:text-4xl font-bold">
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
        <div className="flex items-center gap-4">
          <span className="text-orange-600 text-3xl sm:text-4xl font-bold">
            $100
          </span>
          <span className="line-through text-gray-400 text-lg sm:text-xl">
            $500
          </span>
        </div>

        {/* CTA */}
        <button className="border border-black px-8 sm:px-10 py-3 hover:bg-black hover:text-white transition text-sm sm:text-base font-semibold">
          SHOP NOW
        </button>
      </div>
    </section>
  );
}
