"use client";
import { useState } from "react";
import {
  FaShoppingCart,
  FaSearch,
  FaBars,
  FaTimes,
  FaTshirt,
  FaUserCircle,
} from "react-icons/fa";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="bg-white text-black shadow-lg">
      {/* Mobile Logo Row */}
      <div className="md:hidden flex justify-center items-center py-2 bg-white z-50 relative">
        <FaTshirt className="text-2xl mr-2" />
        <span className="font-bold text-lg">Sajid Garments</span>
      </div>

      {/* Main Row */}
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Left - Menu Button (Mobile) */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Desktop Logo */}
        <div className="hidden md:flex items-center gap-2">
          <FaTshirt className="text-2xl" />
          <span className="font-bold text-lg">Sajid Garments</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="hover:text-gray-600">
            Home
          </Link>
          <Link href="/products" className="hover:text-gray-600">
            Products
          </Link>
          <Link href="/about" className="hover:text-gray-600">
            About
          </Link>
          <Link href="/contact" className="hover:text-gray-600">
            Contact
          </Link>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-4">
          <button onClick={() => setSearchOpen(!searchOpen)}>
            <FaSearch className="text-xl" />
          </button>
          <FaShoppingCart className="text-xl cursor-pointer" />
          <FaUserCircle className="text-xl cursor-pointer" />
        </div>
      </div>

      {/* Search Bar */}
      <div
        className={`bg-gray-100 overflow-hidden transition-all duration-300 ${
          searchOpen ? "max-h-20 opacity-100 p-3" : "max-h-0 opacity-0 p-0"
        }`}
      >
        <input
          type="text"
          placeholder="Search..."
          className="w-full border rounded-lg px-3 py-2 outline-none"
        />
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-gray-100 overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-60 opacity-100 p-4" : "max-h-0 opacity-0 p-0"
        }`}
      >
        <Link href="/" className="block">
          Home
        </Link>
        <Link href="/products" className="block">
          Products
        </Link>
        <Link href="/about" className="block">
          About
        </Link>
        <Link href="/contact" className="block">
          Contact
        </Link>
      </div>
    </nav>
  );
}
