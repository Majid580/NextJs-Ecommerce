"use client";

import { useState, useEffect } from "react";
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

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 15);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <style>{`
        /* Underline hover effect */
        .nav-link-underline {
          position: relative;
          cursor: pointer;
          user-select: none;
        }
        .nav-link-underline::after {
          content: "";
          position: absolute;
          width: 0%;
          height: 2px;
          bottom: -4px;
          left: 0;
          background-color: #333;
          transition: width 0.3s ease;
          border-radius: 2px;
        }
        .nav-link-underline:hover::after {
          width: 100%;
        }

        /* Mobile menu slide */
        .mobile-menu-slide {
          transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
          will-change: max-height, opacity;
        }

        /* Remove focus outlines on mobile, keep subtle on desktop */
        button:focus,
        a:focus {
          outline: none;
        }

        /* Soft shadow and bg blur on scroll */
        nav.scrolled {
          box-shadow: 0 3px 8px rgb(0 0 0 / 0.1);
          background-color: rgba(255 255 255 / 0.98);
          backdrop-filter: saturate(180%) blur(10px);
          -webkit-backdrop-filter: saturate(180%) blur(10px);
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }

        /* Scrollbar hidden on mobile menu */
        .mobile-menu-slide::-webkit-scrollbar {
          display: none;
        }

        /* Input styling */
        input[type="text"] {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 1rem;
          color: #444;
          background-color: #fafafa;
          transition: border-color 0.25s ease;
          width: 100%;
          max-width: 100%;
        }
        input[type="text"]:focus {
          border-color: #666;
          outline: none;
          box-shadow: 0 0 8px rgb(0 0 0 / 0.1);
          background-color: #fff;
        }

        /* Mobile menu link styling */
        .mobile-menu-slide a {
          padding: 12px 14px;
          font-weight: 600;
          color: #222;
          border-radius: 8px;
          transition: background-color 0.25s ease, color 0.25s ease;
        }
        .mobile-menu-slide a:hover {
          background-color: #f2f2f2;
          color: #000;
        }

        /* Icon buttons styling */
        .icon-button {
          background: none;
          border: none;
          padding: 6px;
          border-radius: 8px;
          cursor: pointer;
          color: #444;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.25s ease, color 0.25s ease;
        }
        .icon-button:hover {
          background-color: #eee;
          color: #111;
        }
      `}</style>

      <nav
        className={`fixed top-0 w-full z-50 bg-white transition-all duration-300 ease-in-out ${
          scrolled ? "scrolled" : ""
        }`}
        aria-label="Primary Navigation"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile menu toggle */}
            <button
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden icon-button"
              type="button"
            >
              {menuOpen ? (
                <FaTimes className="w-6 h-6" />
              ) : (
                <FaBars className="w-6 h-6" />
              )}
            </button>

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-900"
            >
              <FaTshirt
                className="text-3xl"
                aria-hidden="true"
                focusable="false"
              />
              <span className="font-extrabold text-xl sm:text-2xl select-none">
                Sajid Garments
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex md:ml-10 md:space-x-10 nav-links overflow-x-auto no-scrollbar">
              {[
                { href: "/", label: "Home" },
                { href: "/products", label: "Products" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
              ].map(({ href, label }) => (
                <Link
                  key={label}
                  href={href}
                  className="nav-link-underline text-gray-800 font-semibold whitespace-nowrap px-3 py-2 rounded-md select-none"
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Right icons */}
            <div className="flex items-center text-black space-x-4">
              {/* Shopping cart */}
              <CartDropdown />

              {/* Search button */}
              <button
                aria-label={searchOpen ? "Close search" : "Open search"}
                onClick={() => setSearchOpen(!searchOpen)}
                className="icon-button"
                type="button"
              >
                <FaSearch className="w-5 h-5" />
              </button>

              {/* User profile */}
              <button
                aria-label="User profile"
                className="icon-button"
                type="button"
              >
                <FaUserCircle className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div
          className={`bg-white border-t border-gray-200 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 overflow-hidden transition-all duration-300 ease-in-out ${
            searchOpen ? "max-h-20 opacity-100 py-3" : "max-h-0 opacity-0 py-0"
          }`}
        >
          <input
            type="text"
            aria-label="Search products"
            placeholder="Search products, categories..."
            className="w-full md:max-w-md block mx-auto border border-gray-300 rounded-lg px-4 py-2 text-gray-700 placeholder-gray-500 bg-gray-50 focus:bg-white"
            autoComplete="off"
          />
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden bg-white border-t border-gray-200 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 mobile-menu-slide overflow-hidden ${
            menuOpen
              ? "max-h-[280px] opacity-100 py-4"
              : "max-h-0 opacity-0 py-0"
          }`}
          role="menu"
          aria-label="Mobile Navigation"
        >
          <nav className="flex flex-col space-y-3">
            {[
              { href: "/", label: "Home" },
              { href: "/products", label: "Products" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ].map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                className="block text-gray-800 font-semibold rounded-lg px-4 py-3 hover:bg-gray-100 active:bg-gray-200 transition select-none"
                onClick={() => setMenuOpen(false)}
                role="menuitem"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </nav>
    </>
  );
}
