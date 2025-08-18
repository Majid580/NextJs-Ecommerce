"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FaShoppingCart,
  FaSearch,
  FaBars,
  FaTimes,
  FaTshirt,
  FaUserCircle,
} from "react-icons/fa";
import Link from "next/link";
import CartDropdown from "./CartDropdown";

/**
 * Ultra-responsive Navbar optimized for mobile-first usage
 * - Sticky with blur-on-scroll and gradient accent
 * - Accessible: proper aria labels, focus rings, ESC to close overlays
 * - Mobile drawer with overlay, body scroll lock, and smooth transitions
 * - Expanding search bar (collapsible on desktop, overlay on mobile)
 * - Beautiful micro-interactions and hover underlines
 */
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close all overlays utility
  const closeAll = useCallback(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, []);

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Window resize: close menus on md+
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Body scroll lock when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [menuOpen]);

  // ESC to close overlays
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeAll();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeAll]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* Local styles for fancy underline and subtle animations */}
      <style jsx>{`
        .nav-link-underline {
          position: relative;
        }
        .nav-link-underline::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -3px;
          height: 2px;
          width: 0%;
          background: currentColor;
          transition: width 0.25s ease;
          border-radius: 2px;
        }
        .nav-link-underline:hover::after {
          width: 100%;
        }
      `}</style>

      <header className="fixed top-0 inset-x-0 z-50 text-black">
        {/* Gradient accent line */}
        <div className="h-1 bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400" />

        <nav
          aria-label="Primary Navigation"
          className={[
            "relative w-full transition-all duration-300",
            "bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80",
            scrolled ? "shadow-[0_6px_24px_rgba(0,0,0,0.08)]" : "shadow-none",
          ].join(" ")}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 md:h-20">
              {/* Left: mobile menu toggle */}
              <button
                type="button"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
                className="md:hidden inline-flex items-center justify-center rounded-xl p-2 text-neutral-700 hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800"
              >
                {menuOpen ? (
                  <FaTimes className="h-6 w-6" />
                ) : (
                  <FaBars className="h-6 w-6" />
                )}
              </button>

              {/* Logo */}
              <Link
                href="/"
                className="flex items-center gap-2 text-neutral-900"
              >
                <FaTshirt className="text-2xl" aria-hidden />
                <span className="font-extrabold text-lg sm:text-xl select-none tracking-tight">
                  Civora
                </span>
              </Link>

              {/* Desktop links */}
              <div className="hidden md:flex items-center gap-2 ml-4">
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={label}
                    href={href}
                    className="nav-link-underline px-3 py-2 text-[0.95rem] font-semibold text-neutral-800 rounded-lg hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800"
                  >
                    {label}
                  </Link>
                ))}
              </div>

              {/* Right cluster */}
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Cart */}
                <div className="relative">
                  <CartDropdown />
                </div>

                {/* Search toggle (desktop shows inline bar below; mobile uses overlay) */}
                <button
                  type="button"
                  aria-label={searchOpen ? "Close search" : "Open search"}
                  aria-expanded={searchOpen}
                  onClick={() => setSearchOpen((v) => !v)}
                  className="inline-flex items-center justify-center rounded-xl p-2 text-neutral-700 hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800"
                >
                  <FaSearch className="h-5 w-5" />
                </button>

                {/* Profile */}
                <button
                  type="button"
                  aria-label="User profile"
                  className="hidden xs:flex items-center justify-center rounded-xl p-2 text-neutral-700 hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800"
                >
                  <FaUserCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Collapsible search bar (desktop & tablets) */}
          <div
            className={[
              "hidden md:block overflow-hidden transition-[max-height,opacity,padding] duration-300 ease-out",
              searchOpen
                ? "max-h-24 opacity-100 py-3"
                : "max-h-0 opacity-0 py-0",
            ].join(" ")}
          >
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search products, categories…"
                  aria-label="Search products"
                  className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 pl-10 pr-4 py-2.5 text-sm text-neutral-800 placeholder-neutral-500 focus:bg-white focus:border-neutral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800"
                />
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile FULLSCREEN search overlay */}
        {searchOpen && (
          <div
            role="dialog"
            aria-modal="true"
            className="md:hidden fixed inset-0 z-[60] bg-white/95 backdrop-blur p-4"
          >
            <div className="mx-auto max-w-xl">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Close search"
                  onClick={() => setSearchOpen(false)}
                  className="inline-flex items-center justify-center rounded-xl p-2 text-neutral-700 hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
                <div className="relative flex-1">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search products, categories…"
                    aria-label="Search products"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-10 pr-4 py-3 text-sm text-neutral-800 placeholder-neutral-500 focus:bg-white focus:border-neutral-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Drawer + Overlay */}
        <div
          className={[
            "md:hidden fixed inset-0 z-50 transition-opacity",
            menuOpen ? "opacity-100" : "pointer-events-none opacity-0",
          ].join(" ")}
          aria-hidden={!menuOpen}
          onClick={closeAll}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <aside
          className={[
            "md:hidden fixed top-0 left-0 bottom-0 z-[55] w-[82%] max-w-sm",
            "bg-white shadow-2xl border-r border-neutral-200",
            "transition-transform duration-300 ease-out",
            menuOpen ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          <div className="flex items-center justify-between px-4 py-4 border-b border-neutral-200">
            <Link
              href="/"
              className="flex items-center gap-2 text-neutral-900"
              onClick={closeAll}
            >
              <FaTshirt className="text-2xl" aria-hidden />
              <span className="font-extrabold text-lg tracking-tight">
                Civora
              </span>
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={closeAll}
              className="inline-flex items-center justify-center rounded-xl p-2 text-neutral-700 hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800"
            >
              <FaTimes className="h-6 w-6" />
            </button>
          </div>

          {/* Menu items */}
          <nav className="px-4 py-4 space-y-2">
            {navLinks.map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                onClick={closeAll}
                className="block rounded-xl px-4 py-3 text-[0.95rem] font-semibold text-neutral-900 bg-neutral-50 hover:bg-neutral-100 active:bg-neutral-200 transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Quick actions */}
          <div className="mt-auto px-4 py-4 border-t border-neutral-200">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(true);
                  setMenuOpen(false);
                }}
                className="rounded-xl border border-neutral-300 bg-white px-3 py-3 text-sm font-semibold text-neutral-800 hover:bg-neutral-100"
              >
                <div className="flex items-center justify-center gap-2">
                  <FaSearch className="h-4 w-4" /> Search
                </div>
              </button>
              <button
                type="button"
                className="rounded-xl bg-black px-3 py-3 text-sm font-semibold text-white shadow hover:brightness-110"
              >
                <div className="flex items-center justify-center gap-2">
                  <FaUserCircle className="h-5 w-5" /> Account
                </div>
              </button>
            </div>
          </div>
        </aside>
      </header>
    </>
  );
}
