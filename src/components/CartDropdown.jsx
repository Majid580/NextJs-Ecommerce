"use client";

import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  increaseQuantity,
  decreaseQuantity,
  removeItem,
} from "@/redux/slices/cartSlice";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CartDropdown() {
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Close when clicking outside
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
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [open]);

  function toggleOpen() {
    if (!open && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = 480;
      const spaceBelow = window.innerHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;

      setOpenUpwards(
        spaceBelow < dropdownHeight && spaceAbove > dropdownHeight
      );
    }
    setOpen((prev) => !prev);
  }

  const onIncreaseQuantity = (id) => dispatch(increaseQuantity(id));
  const onDecreaseQuantity = (id) => dispatch(decreaseQuantity(id));
  const onRemoveItem = (id) => dispatch(removeItem(id));

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
    <div className="relative inline-block">
      {/* Cart Button */}
      <button
        id="cart-button"
        ref={buttonRef}
        onClick={toggleOpen}
        className="relative p-2 rounded-full hover:bg-gray-100 transition"
        title="Cart"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          className="w-6 h-6"
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

      {/* Always mounted dropdown */}
      <motion.div
        ref={dropdownRef}
        onClick={(e) => e.stopPropagation()}
        initial={false}
        animate={open ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={`absolute z-50
          ${openUpwards ? "bottom-full mb-3" : "top-full mt-3"}
          w-[90vw] max-w-md bg-white/80 backdrop-blur-md border border-gray-200 shadow-2xl rounded-xl
          md:origin-top-right md:translate-x-[-300px]
          origin-top-center left-[-20px] -translate-x-1/2 md:left-auto`}
        style={{
          maxHeight: "70vh",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <span className="font-semibold text-lg text-gray-900">
            Your Cart ({cartItems.length})
          </span>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-500 hover:text-gray-800 transition text-xl"
          >
            &times;
          </button>
        </div>

        {/* Items */}
        <div
          className="overflow-y-auto overflow-x-hidden"
          style={{ maxHeight: "45vh" }}
        >
          {cartItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500 italic">
              Your cart is empty.
            </div>
          ) : (
            cartItems.map(
              ({ id, title, price, quantity, stock, sku, images }) => (
                <div
                  key={id}
                  className="flex items-center gap-4 p-4 border-b border-gray-100"
                >
                  <img
                    src={images?.[0] || "/images/default.png"}
                    alt={title}
                    className="w-16 h-16 object-contain rounded-lg shadow-sm bg-white"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-900 font-semibold truncate">
                      {title}
                    </h3>
                    <p className="text-sm text-gray-500">SKU: {sku}</p>
                    <p className="mt-1 text-base font-semibold text-gray-900">
                      {formatPrice(price)}
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onDecreaseQuantity(id)}
                        disabled={quantity <= 1}
                        className="w-8 h-8 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-800 hover:text-white disabled:opacity-40 transition"
                      >
                        –
                      </button>
                      <span className="w-6 text-center">{quantity}</span>
                      <button
                        onClick={() => onIncreaseQuantity(id)}
                        disabled={quantity >= stock}
                        className="w-8 h-8 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-800 hover:text-white disabled:opacity-40 transition"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => onRemoveItem(id)}
                      className="text-xs text-red-500 hover:text-red-700 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )
            )
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <div className="flex justify-between font-semibold text-lg mb-4">
              <span>Total:</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <Link href="/checkout">
              <button className="w-full py-3 bg-black text-white rounded-lg shadow-md hover:bg-gray-900 active:bg-gray-800 transition">
                Checkout
              </button>
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
