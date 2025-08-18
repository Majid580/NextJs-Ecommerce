// src/components/Footer.jsx
"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { SpeedInsights } from "@vercel/speed-insights/next";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";
import { IoIosArrowUp } from "react-icons/io";

// ---- theme utils ----
function getInitialTheme() {
  if (typeof window === "undefined") return "system";
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark" || stored === "system")
    return stored;
  return "system";
}
function applyTheme(theme) {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  const prefersDark = window.matchMedia?.(
    "(prefers-color-scheme: dark)"
  ).matches;
  const shouldDark = theme === "dark" || (theme === "system" && prefersDark);
  root.classList.toggle("dark", shouldDark);
}

export default function Footer() {
  const year = useMemo(() => new Date().getFullYear(), []);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [country, setCountry] = useState("PK");
  const [currency, setCurrency] = useState("PKR");
  const [showTop, setShowTop] = useState(false);

  // theme state
  const [theme, setTheme] = useState(getInitialTheme());

  // init + react to theme changes
  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // watch system changes when on "system" theme
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (localStorage.getItem("theme") === "system") {
        applyTheme("system");
      }
    };
    mql.addEventListener?.("change", handler);
    return () => mql.removeEventListener?.("change", handler);
  }, []);

  // show “back to top” after scroll
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const company = [
    { href: "/about", label: "About Us" },
    { href: "/careers", label: "Careers" },
    { href: "/blog", label: "Blog" },
  ];
  const support = [
    { href: "/help", label: "Help Center" },
    { href: "/shipping", label: "Shipping & Returns" },
    { href: "/contact", label: "Contact Us" },
  ];
  const shop = [
    { href: "/products", label: "All Products" },
    { href: "/collections/new", label: "New Arrivals" },
    { href: "/sale", label: "Sale" },
  ];
  const legal = [
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/privacy", label: "Privacy Policy" },
  ];

  const socials = [
    { href: "https://facebook.com", icon: FaFacebookF, label: "Facebook" },
    { href: "https://instagram.com", icon: FaInstagram, label: "Instagram" },
    { href: "https://twitter.com", icon: FaTwitter, label: "Twitter/X" },
    { href: "https://youtube.com", icon: FaYoutube, label: "YouTube" },
    { href: "https://tiktok.com", icon: FaTiktok, label: "TikTok" },
  ];

  const countries = [
    { code: "PK", name: "Pakistan Delivery" },
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "AE", name: "United Arab Emirates" },
  ];
  const currencies = ["PKR", "USD", "GBP", "AED"];

  function validateEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    if (!validateEmail(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setMessage("Thanks! You’re subscribed for offers & updates.");
    setEmail("");
  }

  function scrollToTop() {
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      window.scrollTo(0, 0);
    }
  }

  return (
    <footer
      className="w-full border-t border-gray-200 bg-white text-black dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-800"
      aria-labelledby="footer-heading"
    >
      {/* Top Strip: CTA + Newsletter + Theme Switcher */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-900">
        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-neutral-100">
                Get exclusive deals in your inbox
              </p>
              <p className="text-xs text-gray-600 dark:text-neutral-400">
                Be the first to know about new arrivals and special offers.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="w-full md:w-auto flex items-stretch gap-2"
              aria-label="Newsletter signup"
            >
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
                placeholder="Enter your email"
                className="w-full md:w-80 rounded-xl border border-gray-300 px-4 py-3 text-sm placeholder:text-gray-400
                           focus:outline-none focus:ring-2 focus:ring-gray-900/20
                           dark:bg-neutral-800 dark:border-neutral-700 dark:placeholder:text-neutral-500 dark:focus:ring-white/20"
              />
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-900 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition
                           dark:bg-white dark:text-black dark:hover:bg-neutral-200"
              >
                {submitting ? "Subscribing…" : "Subscribe"}
              </button>
            </form>

            {/* Theme toggle */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="theme"
                className="text-xs text-gray-600 dark:text-neutral-400"
              >
                Theme
              </label>
              <select
                id="theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-gray-900/20
                           dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700 dark:focus:ring-white/20"
                aria-label="Color theme"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>

          {message && (
            <div className="mt-3 text-xs text-gray-700 dark:text-neutral-300">
              {message}
            </div>
          )}
        </div>
      </div>

      {/* Main Links */}
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10">
        <nav
          id="footer-heading"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8"
          aria-label="Footer"
        >
          <FooterCol title="Company" links={company} />
          <FooterCol title="Support" links={support} />
          <FooterCol title="Shop" links={shop} />
          <FooterCol title="Legal" links={legal} />

          {/* Connect */}
          <div>
            <h3 className="font-bold text-sm mb-3">Connect</h3>
            <div className="flex items-center gap-2">
              {socials.map(({ href, icon: Icon, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 hover:bg-gray-900 hover:text-white transition
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20
                             dark:border-neutral-700 dark:hover:bg-white dark:hover:text-black dark:focus-visible:ring-white/20"
                >
                  <Icon className="text-sm" />
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-600 dark:text-neutral-400">
                Need help?{" "}
                <Link
                  href="/contact"
                  className="font-semibold hover:underline underline-offset-4"
                >
                  Chat with support
                </Link>
              </p>
            </div>
          </div>
        </nav>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-gray-100 dark:border-neutral-800 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-xs text-gray-600 dark:text-neutral-400">
            © {year} Your Brand. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {/* Country */}
            <label className="sr-only" htmlFor="country">
              Country
            </label>
            <select
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-gray-900/20
                         dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700 dark:focus:ring-white/20"
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Currency */}
            <label className="sr-only" htmlFor="currency">
              Currency
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-gray-900/20
                         dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700 dark:focus:ring-white/20"
            >
              {currencies.map((cur) => (
                <option key={cur} value={cur}>
                  {cur}
                </option>
              ))}
            </select>

            {/* Quick links */}
            <Link
              href="/"
              className="text-xs text-gray-700 hover:text-gray-900 hover:underline dark:text-neutral-300 dark:hover:text-white"
            >
              {countries.find((c) => c.code === country)?.name ||
                "Pakistan Delivery"}
            </Link>
            <span className="hidden sm:inline-block text-xs text-gray-400 dark:text-neutral-600">
              •
            </span>
            <Link
              href="/contact"
              className="text-xs text-gray-700 hover:text-gray-900 hover:underline dark:text-neutral-300 dark:hover:text-white"
            >
              Support
            </Link>
          </div>
        </div>

        {/* Payment badges */}
        <div className="mt-6 flex flex-wrap items-center gap-2 text-[10px] text-gray-500 dark:text-neutral-400">
          <span className="rounded border border-gray-200 px-2 py-1 bg-white dark:bg-neutral-800 dark:border-neutral-700">
            Visa
          </span>
          <span className="rounded border border-gray-200 px-2 py-1 bg-white dark:bg-neutral-800 dark:border-neutral-700">
            Mastercard
          </span>
          <span className="rounded border border-gray-200 px-2 py-1 bg-white dark:bg-neutral-800 dark:border-neutral-700">
            Apple Pay
          </span>
          <span className="rounded border border-gray-200 px-2 py-1 bg-white dark:bg-neutral-800 dark:border-neutral-700">
            Google Pay
          </span>
          <span className="rounded border border-gray-200 px-2 py-1 bg-white dark:bg-neutral-800 dark:border-neutral-700">
            COD
          </span>
        </div>

        <SpeedInsights />
      </div>

      {/* Back to top button */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`fixed bottom-5 right-5 z-40 inline-flex items-center justify-center rounded-full bg-black text-white shadow-lg transition
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30
        dark:bg-white dark:text-black dark:focus-visible:ring-black/30
        ${
          showTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-3 pointer-events-none"
        }`}
      >
        <IoIosArrowUp className="h-6 w-6 m-3" />
      </button>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h3 className="font-bold text-sm mb-3">{title}</h3>
      <ul className="space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-gray-700 hover:text-gray-900 hover:underline underline-offset-4 rounded
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20
                         dark:text-neutral-300 dark:hover:text-white dark:focus-visible:ring-white/20"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
