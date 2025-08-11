"use client";

import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  increaseQuantity,
  decreaseQuantity,
  removeItem,
} from "@/redux/slices/cartSlice";

export default function CartDropdown() {
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

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
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function toggleOpen() {
    if (!open && buttonRef.current && dropdownRef.current) {
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

  function onIncreaseQuantity(id) {
    dispatch(increaseQuantity(id));
  }
  function onDecreaseQuantity(id) {
    dispatch(decreaseQuantity(id));
  }
  function onRemoveItem(id) {
    dispatch(removeItem(id));
  }

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  function formatPrice(price) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price / 100);
  }

  return (
    <>
      <style>{`
        /* Your existing styles here (copy-paste all your style block) */
        .cart-items-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .cart-items-scroll::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 10px;
        }
        .qty-btn {
          transition: background-color 0.2s ease;
          border: 1.5px solid #374151;
          color: #374151;
          font-weight: 600;
          font-size: 1.25rem;
          line-height: 1;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          user-select: none;
          background-color: white;
        }
        .qty-btn:hover {
          background-color: #374151;
          color: white;
        }
        .qty-btn:active {
          background-color: #1f2937;
          border-color: #1f2937;
          color: white;
        }
        .qty-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .remove-btn {
          color: #ef4444;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          user-select: none;
          transition: color 0.2s ease;
          background: none;
          border: none;
          padding: 0;
        }
        .remove-btn:hover {
          color: #b91c1c;
        }
        .remove-btn:active {
          color: #7f1d1d;
        }
        #cart-button > span {
          min-width: 16px !important;
          height: 16px !important;
          padding: 0 !important;
          font-size: 10px !important;
          line-height: 14px !important;
          top: 2px !important;
          right: 2px !important;
          transform: none !important;
          border-radius: 9999px !important;
          position: absolute;
        }
        .cart-product-image {
          object-fit: contain !important;
          object-position: center !important;
          max-height: 80px;
          width: 80px;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
          flex-shrink: 0;
          background: white;
        }
        #cart-dropdown {
          transition-property: opacity, visibility;
          transition-duration: 250ms;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          visibility: hidden;
          opacity: 0;
          pointer-events: none;
          position: absolute;
          right: 0;
          top: calc(100% + 0.5rem);
          z-index: 9999;
          background-color: white;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          box-shadow:
            0 10px 15px -3px rgb(0 0 0 / 0.1),
            0 4px 6px -2px rgb(0 0 0 / 0.05);
          width: 400px;
          max-height: 500px;
          overflow: hidden;
          min-width: 280px;
        }
        #cart-dropdown[data-open="true"] {
          visibility: visible;
          opacity: 1;
          pointer-events: auto;
        }
        #cart-dropdown.open-upwards {
          bottom: 100%;
          top: auto !important;
          transform-origin: bottom right;
        }
        #cart-dropdown .close-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          background: transparent;
          border: none;
          font-size: 1.5rem;
          color: #6b7280;
          cursor: pointer;
          padding: 0;
          line-height: 1;
          transition: color 0.2s ease;
          user-select: none;
        }
        #cart-dropdown .close-btn:hover {
          color: #111827;
        }
        @media (max-width: 768px) {
          #cart-dropdown {
            width: calc(100vw - 2rem) !important;
            max-height: 60vh !important;
            left: 50% !important;
            right: auto !important;
            transform: translateX(-65%) !important;
            top: calc(100% + 0.5rem);
          }
          #cart-dropdown.open-upwards {
            bottom: auto !important;
            top: 1rem !important;
          }
        }
      `}</style>

      <div className="relative inline-block">
        <button
          id="cart-button"
          ref={buttonRef}
          aria-haspopup="true"
          aria-expanded={open}
          aria-controls="cart-dropdown"
          onClick={toggleOpen}
          className="relative icon-button"
          type="button"
          title="Toggle cart dropdown"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            className="w-6 h-6"
            aria-hidden="true"
            focusable="false"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 7.5M7 13h10m0 0l1.5 7.5M17 13l1.5 7.5M6 21a1 1 0 100-2 1 1 0 000 2zm12 0a1 1 0 100-2 1 1 0 000 2z"
            />
          </svg>

          {cartItems.length > 0 && (
            <span
              aria-label={`${cartItems.length} items in cart`}
              className="absolute top-0 right-0 inline-flex items-center justify-center px-1 text-xs font-bold leading-none text-white bg-red-600"
            >
              {cartItems.length}
            </span>
          )}
        </button>

        <div
          ref={dropdownRef}
          id="cart-dropdown"
          role="region"
          aria-label="Shopping cart dropdown"
          data-open={open ? "true" : "false"}
          className={openUpwards ? "open-upwards" : ""}
        >
          <button
            aria-label="Close cart dropdown"
            className="close-btn"
            onClick={() => setOpen(false)}
            type="button"
          >
            &times;
          </button>

          <div className="flex flex-col h-full">
            <div className="px-6 py-4 border-b border-gray-200 font-semibold text-xl text-gray-900">
              Your Cart ({cartItems.length}{" "}
              {cartItems.length === 1 ? "item" : "items"})
            </div>

            <div
              className="flex-grow overflow-y-auto cart-items-scroll px-6"
              style={{ maxHeight: "340px" }}
            >
              {cartItems.length === 0 ? (
                <div className="p-10 text-center text-gray-500 italic select-none">
                  Your cart is empty.
                </div>
              ) : (
                cartItems.map(
                  ({ id, title, price, quantity, stock, sku, images }) => (
                    <div
                      key={id}
                      className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-none"
                    >
                      <img
                        src={images?.[0] || "/images/default.png"}
                        alt={title}
                        className="cart-product-image"
                        loading="lazy"
                      />

                      <div className="flex-1 min-w-0">
                        <h3
                          className="text-gray-900 font-semibold text-lg truncate"
                          title={title}
                        >
                          {title}
                        </h3>
                        <p className="text-sm text-gray-600">SKU: {sku}</p>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          {formatPrice(price)}
                        </p>
                      </div>

                      <div className="flex flex-col items-center justify-between space-y-3 ml-2 min-w-[90px]">
                        <div className="flex items-center gap-2">
                          <button
                            aria-label={`Decrease quantity of ${title}`}
                            onClick={() => onDecreaseQuantity(id)}
                            className="qty-btn disabled:opacity-50"
                            disabled={quantity <= 1}
                            type="button"
                          >
                            –
                          </button>
                          <span className="w-8 text-center font-semibold select-none text-gray-900">
                            {quantity}
                          </span>
                          <button
                            aria-label={`Increase quantity of ${title}`}
                            onClick={() => onIncreaseQuantity(id)}
                            className="qty-btn disabled:opacity-50"
                            disabled={quantity >= stock}
                            type="button"
                          >
                            +
                          </button>
                        </div>

                        <button
                          aria-label={`Remove ${title} from cart`}
                          onClick={() => onRemoveItem(id)}
                          className="remove-btn"
                          type="button"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )
                )
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="px-6 py-5 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                <div className="flex justify-between items-center mb-4 text-2xl font-semibold text-gray-900">
                  <span>Total:</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <button
                  type="button"
                  className="w-full py-4 bg-black hover:bg-gray-900 active:bg-gray-800 text-white font-semibold rounded-lg shadow-lg transition-colors"
                  onClick={() => alert("Proceeding to checkout...")}
                >
                  Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
