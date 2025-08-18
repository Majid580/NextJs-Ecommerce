// src/app/ClientLayout.jsx
"use client";

import React from "react";
import { Provider } from "react-redux";
import store from "@/redux/store/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ClientLayout({ children }) {
  return (
    <Provider store={store}>
      {/* Page shell */}
      <div className="flex min-h-screen min-h-[100dvh] flex-col bg-white text-gray-900 antialiased overflow-x-hidden">
        {/* If your Navbar is fixed or sticky, it will not affect this structure.
            The main area grows to fill remaining height so Footer sits at the bottom. */}
        <Navbar />

        <main
          id="content"
          className="
            flex-1 w-full
            /* Layout container spacing */
            px-3 sm:px-4 md:px-6
            /* Provide small top/bottom breathing room on tiny screens */
            py-3 sm:py-4
            /* Respect device safe areas (iOS notch etc.) */
            pt-[max(env(safe-area-inset-top),0px)]
            pb-[max(env(safe-area-inset-bottom),0px)]
          "
        >
          {children}
        </main>

        <Footer />
      </div>
    </Provider>
  );
}
