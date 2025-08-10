"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function useAOS(duration = 1000) {
  useEffect(() => {
    AOS.init({
      duration,
      once: false,
      mirror: true,
    });

    // Force refresh after load
    setTimeout(() => {
      AOS.refresh();
    }, 200);
  }, [duration]);
}
