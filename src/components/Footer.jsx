"use client";
import React from "react";
import Link from "next/link";
import { SpeedInsights } from "@vercel/speed-insights/next";
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="w-full border-t border-gray-200 bg-white"
      aria-labelledby="footer-heading"
    >
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <nav
          id="footer-heading"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-black"
          aria-label="Footer"
        >
          {/* Company */}
          <div>
            <h3 className="font-bold text-sm mb-2">Company</h3>
            <ul className="space-y-1 text-xs font-thin">
              <li>
                <Link href="/about" legacyBehavior>
                  <a className="hover:underline">About Us</a>
                </Link>
              </li>
              <li>
                <Link href="/careers" legacyBehavior>
                  <a className="hover:underline">Careers</a>
                </Link>
              </li>
              <li>
                <Link href="/blog" legacyBehavior>
                  <a className="hover:underline">Blog</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-sm mb-2">Support</h3>
            <ul className="space-y-1 text-xs font-thin">
              <li>
                <Link href="/help" legacyBehavior>
                  <a className="hover:underline">Help Center</a>
                </Link>
              </li>
              <li>
                <Link href="/shipping" legacyBehavior>
                  <a className="hover:underline">Shipping &amp; Returns</a>
                </Link>
              </li>
              <li>
                <Link href="/contact" legacyBehavior>
                  <a className="hover:underline">Contact Us</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-bold text-sm mb-2">Shop</h3>
            <ul className="space-y-1 text-xs font-thin">
              <li>
                <Link href="/products" legacyBehavior>
                  <a className="hover:underline">All Products</a>
                </Link>
              </li>
              <li>
                <Link href="/collections/new" legacyBehavior>
                  <a className="hover:underline">New Arrivals</a>
                </Link>
              </li>
              <li>
                <Link href="/sale" legacyBehavior>
                  <a className="hover:underline">Sale</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-sm mb-2">Legal</h3>
            <ul className="space-y-1 text-xs font-thin">
              <li>
                <Link href="/terms" legacyBehavior>
                  <a className="hover:underline">Terms &amp; Conditions</a>
                </Link>
              </li>
              <li>
                <Link href="/privacy" legacyBehavior>
                  <a className="hover:underline">Privacy Policy</a>
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className="mt-6 border-t border-gray-100 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-black">
          <p className="text-xs font-thin">
            © {year} Your Brand. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <Link href="/" legacyBehavior>
              <a className="text-xs font-thin hover:underline">
                Pakistan Delivery
              </a>
            </Link>
            <span className="hidden sm:inline-block text-xs font-thin">•</span>
            <Link href="/contact" legacyBehavior>
              <a className="text-xs font-thin hover:underline">Support</a>
            </Link>
          </div>
        </div>
        <SpeedInsights />
      </div>
    </footer>
  );
}
