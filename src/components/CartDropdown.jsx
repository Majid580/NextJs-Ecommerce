// src/components/CartDropdown.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  increaseQuantity,
  decreaseQuantity,
  removeItem,
} from "@/redux/slices/cartSlice";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function CartDropdown() {
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => setMounted(true), []);

  // Close on outside click/touch
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest("#cart-button")
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside, {
        passive: true,
      });
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [open]);

  // Close on ESC
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const onIncreaseQuantity = (item) =>
    dispatch(
      increaseQuantity({ id: item.id, size: item.size, color: item.color })
    );
  const onDecreaseQuantity = (item) =>
    dispatch(
      decreaseQuantity({ id: item.id, size: item.size, color: item.color })
    );
  const onRemoveItem = (item) =>
    dispatch(removeItem({ id: item.id, size: item.size, color: item.color }));

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price / 100);

  return (
    <div className="relative inline-block ">
      {/* Cart Button */}
      <button
        id="cart-button"
        ref={buttonRef}
        onClick={() => setOpen((s) => !s)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20"
        title="Cart"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="cart-dropdown"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          className="w-6 h-6"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 7.5M17 13l1.5 7.5M6 21a1 1 0 100-2 1 1 0 000 2zm12 0a1 1 0 100-2 1 1 0 000 2z"
          />
        </svg>
        {cartItems.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            {cartItems.length}
          </span>
        )}
      </button>

      {/* PORTAL RENDERING */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <div className="fixed inset-0 z-[9999]">
                {/* Backdrop */}
                <motion.div
                  className="absolute inset-0 bg-black/40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setOpen(false)}
                  aria-hidden="true"
                />

                {/* Desktop panel (top-right) */}
                <motion.div
                  ref={dropdownRef}
                  role="dialog"
                  aria-label="Cart"
                  className="
                    hidden md:flex absolute top-0 right-0
                    mt-16 mr-3 text-black
                    w-full max-w-md
                    bg-white/95 backdrop-blur border border-gray-200 shadow-2xl rounded-xl
                    overflow-hidden
                  "
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  style={{ maxHeight: "80dvh" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col w-full">
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white/90 backdrop-blur sticky top-0">
                      <span className="font-semibold text-lg text-gray-900">
                        Your Cart ({cartItems.length})
                      </span>
                      <button
                        onClick={() => setOpen(false)}
                        className="text-gray-500 hover:text-gray-800 transition text-xl leading-none"
                        aria-label="Close cart"
                      >
                        &times;
                      </button>
                    </div>

                    {/* Items */}
                    <div
                      className="overflow-y-auto"
                      style={{ maxHeight: "55dvh" }}
                    >
                      {cartItems.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 italic">
                          Your cart is empty.
                        </div>
                      ) : (
                        cartItems.map((item) => (
                          <div
                            key={`${item.id}-${item.size || "no-size"}-${
                              item.color || "no-color"
                            }`}
                            className="flex items-center gap-4 p-4 border-b border-gray-100"
                          >
                            <img
                              src={item.images?.[0] || "/images/default.png"}
                              alt={item.title}
                              className="w-16 h-16 object-contain rounded-lg bg-white"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="text-gray-900 font-semibold truncate">
                                {item.title}
                              </h3>
                              {(item.size || item.color) && (
                                <p className="text-xs text-gray-500">
                                  {item.size && <>Size: {item.size}</>}
                                  {item.size && item.color && " | "}
                                  {item.color && <>Color: {item.color}</>}
                                </p>
                              )}
                              <p className="text-xs text-gray-400">
                                SKU: {item.sku}
                              </p>
                              <p className="mt-1 text-base font-semibold text-gray-900">
                                {formatPrice(item.price)}
                              </p>
                            </div>

                            <div className="flex flex-col items-center gap-2">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => onDecreaseQuantity(item)}
                                  disabled={item.quantity <= 1}
                                  className="w-8 h-8 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-800 hover:text-white disabled:opacity-40 transition"
                                  aria-label="Decrease quantity"
                                >
                                  –
                                </button>
                                <span className="w-6 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => onIncreaseQuantity(item)}
                                  disabled={item.quantity >= item.stock}
                                  className="w-8 h-8 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-800 hover:text-white disabled:opacity-40 transition"
                                  aria-label="Increase quantity"
                                >
                                  +
                                </button>
                              </div>
                              <button
                                onClick={() => onRemoveItem(item)}
                                className="text-xs text-red-500 hover:text-red-700 transition"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Footer */}
                    {cartItems.length > 0 && (
                      <div className="p-4 border-t border-gray-200 bg-gray-50 sticky bottom-0">
                        <div className="flex justify-between font-semibold text-lg mb-4">
                          <span>Total:</span>
                          <span>{formatPrice(totalPrice)}</span>
                        </div>
                        <Link href="/checkout">
                          <button className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-900 active:bg-gray-800 transition">
                            Checkout
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Mobile bottom sheet */}
                <motion.div
                  ref={dropdownRef}
                  role="dialog"
                  aria-label="Cart"
                  aria-modal="true"
                  className="
                    md:hidden absolute inset-x-0 bottom-0 text-black
                    w-full rounded-t-2xl bg-white shadow-2xl
                    overflow-hidden
                  "
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{
                    type: "tween",
                    duration: 0.25,
                    ease: "easeOut",
                  }}
                  onClick={(e) => e.stopPropagation()}
                  style={{ maxHeight: "100dvh", height: "min(88svh, 88dvh)" }}
                >
                  {/* Grab handle */}
                  <div className="flex items-center justify-center py-2">
                    <span className="h-1.5 w-12 rounded-full bg-gray-300" />
                  </div>

                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 sticky top-0 bg-white/90 backdrop-blur">
                    <span className="font-semibold text-base text-gray-900">
                      Your Cart ({cartItems.length})
                    </span>
                    <button
                      onClick={() => setOpen(false)}
                      className="text-gray-500 hover:text-gray-800 transition text-2xl leading-none"
                      aria-label="Close cart"
                    >
                      &times;
                    </button>
                  </div>

                  {/* Items (panel owns the scroll) */}
                  <div
                    className="overflow-y-auto"
                    style={{
                      maxHeight: "56dvh",
                      WebkitOverflowScrolling: "touch",
                    }}
                  >
                    {cartItems.length === 0 ? (
                      <div className="p-8 text-center text-gray-500 italic">
                        Your cart is empty.
                      </div>
                    ) : (
                      cartItems.map((item) => (
                        <div
                          key={`${item.id}-${item.size || "no-size"}-${
                            item.color || "no-color"
                          }`}
                          className="flex items-center gap-3 px-4 py-3 border-b border-gray-100"
                        >
                          <img
                            src={item.images?.[0] || "/images/default.png"}
                            alt={item.title}
                            className="w-14 h-14 object-contain rounded-md bg-white"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-gray-900 font-semibold truncate text-sm">
                              {item.title}
                            </h3>
                            {(item.size || item.color) && (
                              <p className="text-[11px] text-gray-500">
                                {item.size && <>Size: {item.size}</>}
                                {item.size && item.color && " | "}
                                {item.color && <>Color: {item.color}</>}
                              </p>
                            )}
                            <p className="text-[11px] text-gray-400">
                              SKU: {item.sku}
                            </p>
                            <p className="mt-1 text-sm font-semibold text-gray-900">
                              {formatPrice(item.price)}
                            </p>
                          </div>

                          <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => onDecreaseQuantity(item)}
                                disabled={item.quantity <= 1}
                                className="w-8 h-8 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-800 hover:text-white disabled:opacity-40 transition"
                                aria-label="Decrease quantity"
                              >
                                –
                              </button>
                              <span className="w-6 text-center text-sm">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onIncreaseQuantity(item)}
                                disabled={item.quantity >= item.stock}
                                className="w-8 h-8 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-800 hover:text-white disabled:opacity-40 transition"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => onRemoveItem(item)}
                              className="text-[11px] text-red-500 hover:text-red-700 transition"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  {cartItems.length > 0 && (
                    <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 sticky bottom-0">
                      <div className="flex justify-between items-center font-semibold text-base mb-3">
                        <span>Total</span>
                        <span>{formatPrice(totalPrice)}</span>
                      </div>
                      <Link href="/checkout">
                        <button className="w-full py-3 rounded-lg bg-black text-white font-medium hover:bg-gray-900 active:bg-gray-800 transition">
                          Checkout
                        </button>
                      </Link>
                    </div>
                  )}
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
