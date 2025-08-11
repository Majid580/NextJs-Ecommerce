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
      <Navbar />
      <main>{children}</main>
      <Footer />
    </Provider>
  );
}
