"use client";
import React, { useEffect } from "react"; // <-- Import useEffect directly
import Home from "@/components/Home";
import ReduxProvider from "@/app/ReduxProvider";
import { useDispatch } from "react-redux";
import { setCart } from "@/redux/slices/cartSlice";

export default function Page() {
  return (
    <ReduxProvider>
      <InnerPage />
    </ReduxProvider>
  );
}

function InnerPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      const serializedCart = localStorage.getItem("cart");
      if (serializedCart) {
        dispatch(setCart(JSON.parse(serializedCart)));
      }
    } catch (e) {
      console.warn("Failed to load cart from localStorage", e);
    }
  }, [dispatch]);

  return <Home />;
}
