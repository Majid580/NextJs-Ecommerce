"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import {
  selectCartItems,
  selectTotalPrice,
  selectTotalQuantity,
  increaseQuantity,
  decreaseQuantity,
  removeItem,
  clearCart,
} from "@/redux/slices/cartSlice";

/**
 * Checkout Page
 *
 * - Mobile-first responsive layout
 * - Uses your existing Redux cart slice for data & actions
 * - Includes: shipping address form, billing toggle, shipping methods,
 *   promo code, order summary, inline quantity controls, and a fake
 *   payment placeholder. Also a final confirmation modal.
 *
 * Drop this file into your project and route to /checkout or render it.
 */

function formatPrice(priceCents) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format((priceCents || 0) / 100);
}

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectTotalPrice);
  const totalQty = useSelector(selectTotalQuantity);

  // Form state
  const [shipping, setShipping] = useState({
    firstName: "",
    lastName: "",
    company: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
    phone: "",
    email: "",
    notes: "",
  });

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [billing, setBilling] = useState({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
  });

  const [selectedShippingMethod, setSelectedShippingMethod] =
    useState("standard");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(null); // object {code, discountCents} or null
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(null); // order object or null
  const [validationErrors, setValidationErrors] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Responsive UI toggles
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  // Refs
  const placeOrderBtnRef = useRef(null);

  // Shipping options (sample)
  const shippingOptions = useMemo(
    () => [
      {
        id: "standard",
        label: "Standard Shipping (3-6 business days)",
        priceCents: 500,
        details: "Affordable, tracked delivery.",
      },
      {
        id: "express",
        label: "Express Shipping (1-2 business days)",
        priceCents: 1500,
        details: "Faster delivery with priority handling.",
      },
      {
        id: "localpickup",
        label: "Local Pickup (1-2 days)",
        priceCents: 0,
        details: "Pick up at our warehouse for free.",
      },
    ],
    []
  );

  // Promo codes sample (mock)
  const promoDatabase = useMemo(
    () => ({
      SAVE10: {
        code: "SAVE10",
        discountCents: Math.round(totalPrice * 0.1 || 0),
      },
      FREESHIP: { code: "FREESHIP", discountCents: 0, freeship: true },
      TENOFF50: { code: "TENOFF50", discountCents: 1000 }, // $10
    }),
    [totalPrice]
  );

  // Compute totals
  const shippingPriceCents = useMemo(() => {
    const selected = shippingOptions.find(
      (s) => s.id === selectedShippingMethod
    );
    return selected ? selected.priceCents : 0;
  }, [selectedShippingMethod, shippingOptions]);

  const promoDiscountCents = useMemo(() => {
    if (!promoApplied) return 0;
    // If promo gives freeship
    if (promoApplied.freeship) return shippingPriceCents;
    return promoApplied.discountCents || 0;
  }, [promoApplied, shippingPriceCents]);

  const subtotalCents = totalPrice || 0;
  const totalCents = Math.max(
    0,
    subtotalCents + shippingPriceCents - promoDiscountCents
  );

  // Validation helpers
  function validateShipping() {
    const errors = {};
    if (!shipping.firstName.trim()) errors.firstName = "First name is required";
    if (!shipping.lastName.trim()) errors.lastName = "Last name is required";
    if (!shipping.address1.trim()) errors.address1 = "Address is required";
    if (!shipping.city.trim()) errors.city = "City is required";
    if (!shipping.postalCode.trim())
      errors.postalCode = "Postal code is required";
    if (!shipping.email.trim()) errors.email = "Email is required";
    // Basic email regex
    if (shipping.email && !/^\S+@\S+\.\S+$/.test(shipping.email))
      errors.email = "Invalid email";
    return errors;
  }

  function validateBilling() {
    if (billingSameAsShipping) return {};
    const errors = {};
    if (!billing.firstName.trim()) errors.firstName = "First name is required";
    if (!billing.lastName.trim()) errors.lastName = "Last name is required";
    if (!billing.address1.trim()) errors.address1 = "Address is required";
    if (!billing.city.trim()) errors.city = "City is required";
    if (!billing.postalCode.trim())
      errors.postalCode = "Postal code is required";
    return errors;
  }

  // Apply promo
  function handleApplyPromo() {
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      setPromoApplied(null);
      return;
    }
    // Fake database check
    const found = promoDatabase[code];
    if (!found) {
      setPromoApplied({ code, error: "Invalid promo code" });
      return;
    }
    // If promo is SAVE10, recalc discount based on current subtotal
    if (found.code === "SAVE10") {
      const computed = {
        code: found.code,
        discountCents: Math.round(subtotalCents * 0.1),
      };
      setPromoApplied(computed);
    } else {
      setPromoApplied(found);
    }
  }

  // Inline cart actions
  function increase(id) {
    dispatch(increaseQuantity(id));
  }
  function decrease(id) {
    dispatch(decreaseQuantity(id));
  }
  function removeCartItem(id) {
    dispatch(removeItem(id));
  }

  // Place order simulation
  async function handlePlaceOrder(e) {
    e?.preventDefault?.();
    setValidationErrors({});
    const shipErr = validateShipping();
    const billErr = validateBilling();
    const allErr = { ...shipErr, ...billErr };

    if (Object.keys(allErr).length > 0) {
      setValidationErrors(allErr);
      // scroll to top of form on mobile
      window.scrollTo({ top: 120, behavior: "smooth" });
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setIsProcessing(true);

    // simulate async order placement
    await new Promise((res) => setTimeout(res, 900));

    const order = {
      id: `ORD-${Date.now()}`,
      placedAt: new Date().toISOString(),
      items: cartItems,
      shipping,
      billing: billingSameAsShipping ? shipping : billing,
      totals: {
        subtotalCents,
        shippingPriceCents,
        promoDiscountCents,
        totalCents,
      },
      shippingMethod: shippingOptions.find(
        (s) => s.id === selectedShippingMethod
      ),
      promo: promoApplied,
    };

    setOrderPlaced(order);
    setShowConfirmModal(true);
    setIsProcessing(false);
    // Optionally clear cart (comment out if you don't want that)
    // dispatch(clearCart());
  }

  // Utility: small accessible input component
  function InputRow({
    id,
    label,
    value,
    onChange,
    type = "text",
    placeholder = "",
    error,
    className = "",
    ...rest
  }) {
    return (
      <div className={`w-full ${className}`}>
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`block w-full rounded-md border px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-300 transition
            ${error ? "border-red-400 focus:ring-red-300" : "border-gray-200"}
          `}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...rest}
        />
        {error && (
          <p id={`${id}-error`} className="mt-1 text-xs text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }

  // Cart items display component (mobile friendly)
  function CartItemRow({ item }) {
    return (
      <li className="flex items-start gap-3 py-3">
        <img
          src={item.images?.[0] || "/images/default.png"}
          alt={item.title}
          className="w-16 h-16 rounded-md object-contain bg-white border"
        />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {item.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                SKU: {item.sku || "—"}
              </p>
            </div>
            <div className="text-sm font-semibold text-gray-900">
              {formatPrice(item.price)}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => decrease(item.id)}
                disabled={item.quantity <= 1}
                className="w-8 h-8 rounded-md border border-gray-300 text-gray-700 flex items-center justify-center disabled:opacity-40"
                aria-label={`Decrease qty for ${item.title}`}
              >
                −
              </button>
              <div className="w-8 text-center font-medium">{item.quantity}</div>
              <button
                onClick={() => increase(item.id)}
                disabled={item.quantity >= item.stock}
                className="w-8 h-8 rounded-md border border-gray-300 text-gray-700 flex items-center justify-center disabled:opacity-40"
                aria-label={`Increase qty for ${item.title}`}
              >
                +
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => removeCartItem(item.id)}
                className="text-xs text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </li>
    );
  }

  // Clear promo when subtotal changes enough
  useEffect(() => {
    // If applied promo depends on subtotal (SAVE10), recalc discount
    if (promoApplied && promoApplied.code === "SAVE10") {
      setPromoApplied({
        code: "SAVE10",
        discountCents: Math.round(subtotalCents * 0.1),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotalCents]);

  // If order placed close modal after a short delay
  useEffect(() => {
    if (orderPlaced) {
      // auto close after 6s
      const t = setTimeout(() => {
        setShowConfirmModal(false);
      }, 6000);
      return () => clearTimeout(t);
    }
  }, [orderPlaced]);

  // UX small helpers
  const emptyCart = !cartItems || cartItems.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <style>{`
        /* extra custom */
        .section-card { background: white; border: 1px solid rgba(15,23,42,0.05); border-radius: 12px; }
        .sticky-summary { position: sticky; top: 1rem; }
        @media (min-width: 768px) {
          .desktop-two-col { display: grid; grid-template-columns: 1fr 420px; gap: 24px; }
        }
      `}</style>

      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6">
          <Link href="/" className="text-lg font-extrabold text-gray-900">
            Sajid Garments
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900">Checkout</h1>
          <p className="mt-1 text-sm text-gray-600">
            Complete your purchase — secure checkout, flexible shipping options.
          </p>
        </div>

        <div className="desktop-two-col">
          {/* LEFT: forms & cart list */}
          <div className="space-y-6">
            {/* Shipping details */}
            <section className="section-card p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Shipping information
                </h2>
                <span className="text-sm text-gray-500">{totalQty} items</span>
              </div>

              <form
                className="mt-4 space-y-4"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InputRow
                    id="firstName"
                    label="First name"
                    value={shipping.firstName}
                    onChange={(v) =>
                      setShipping((s) => ({ ...s, firstName: v }))
                    }
                    error={validationErrors.firstName}
                  />
                  <InputRow
                    id="lastName"
                    label="Last name"
                    value={shipping.lastName}
                    onChange={(v) =>
                      setShipping((s) => ({ ...s, lastName: v }))
                    }
                    error={validationErrors.lastName}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InputRow
                    id="company"
                    label="Company (optional)"
                    value={shipping.company}
                    onChange={(v) => setShipping((s) => ({ ...s, company: v }))}
                  />
                  <InputRow
                    id="phone"
                    label="Phone"
                    value={shipping.phone}
                    onChange={(v) => setShipping((s) => ({ ...s, phone: v }))}
                    type="tel"
                  />
                </div>

                <div className="mt-2">
                  <InputRow
                    id="address1"
                    label="Address line 1"
                    value={shipping.address1}
                    onChange={(v) =>
                      setShipping((s) => ({ ...s, address1: v }))
                    }
                    error={validationErrors.address1}
                  />
                </div>
                <div>
                  <InputRow
                    id="address2"
                    label="Address line 2 (optional)"
                    value={shipping.address2}
                    onChange={(v) =>
                      setShipping((s) => ({ ...s, address2: v }))
                    }
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <InputRow
                    id="city"
                    label="City"
                    value={shipping.city}
                    onChange={(v) => setShipping((s) => ({ ...s, city: v }))}
                    error={validationErrors.city}
                  />
                  <InputRow
                    id="state"
                    label="State / Region"
                    value={shipping.state}
                    onChange={(v) => setShipping((s) => ({ ...s, state: v }))}
                  />
                  <InputRow
                    id="postalCode"
                    label="Postal code"
                    value={shipping.postalCode}
                    onChange={(v) =>
                      setShipping((s) => ({ ...s, postalCode: v }))
                    }
                    error={validationErrors.postalCode}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InputRow
                    id="country"
                    label="Country"
                    value={shipping.country}
                    onChange={(v) => setShipping((s) => ({ ...s, country: v }))}
                  />
                  <InputRow
                    id="email"
                    label="Email"
                    value={shipping.email}
                    onChange={(v) => setShipping((s) => ({ ...s, email: v }))}
                    type="email"
                    error={validationErrors.email}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order notes (optional)
                  </label>
                  <textarea
                    value={shipping.notes}
                    onChange={(e) =>
                      setShipping((s) => ({ ...s, notes: e.target.value }))
                    }
                    placeholder="Delivery instructions, preferred time, etc."
                    className="w-full rounded-md border border-gray-200 p-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    rows={3}
                  />
                </div>
              </form>
            </section>

            {/* Billing details */}
            <section className="section-card p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Billing information
                </h2>
                <div className="text-sm text-gray-500 flex items-center gap-3">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={billingSameAsShipping}
                      onChange={(e) =>
                        setBillingSameAsShipping(e.target.checked)
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-600">
                      Same as shipping
                    </span>
                  </label>
                </div>
              </div>

              {!billingSameAsShipping && (
                <form
                  className="mt-4 space-y-4"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InputRow
                      id="billFirst"
                      label="First name"
                      value={billing.firstName}
                      onChange={(v) =>
                        setBilling((b) => ({ ...b, firstName: v }))
                      }
                      error={validationErrors.firstName}
                    />
                    <InputRow
                      id="billLast"
                      label="Last name"
                      value={billing.lastName}
                      onChange={(v) =>
                        setBilling((b) => ({ ...b, lastName: v }))
                      }
                      error={validationErrors.lastName}
                    />
                  </div>

                  <InputRow
                    id="billAddress1"
                    label="Address line 1"
                    value={billing.address1}
                    onChange={(v) => setBilling((b) => ({ ...b, address1: v }))}
                    error={validationErrors.address1}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <InputRow
                      id="billCity"
                      label="City"
                      value={billing.city}
                      onChange={(v) => setBilling((b) => ({ ...b, city: v }))}
                      error={validationErrors.city}
                    />
                    <InputRow
                      id="billState"
                      label="State"
                      value={billing.state}
                      onChange={(v) => setBilling((b) => ({ ...b, state: v }))}
                    />
                    <InputRow
                      id="billPostal"
                      label="Postal code"
                      value={billing.postalCode}
                      onChange={(v) =>
                        setBilling((b) => ({ ...b, postalCode: v }))
                      }
                      error={validationErrors.postalCode}
                    />
                  </div>
                </form>
              )}
            </section>

            {/* Shipping methods */}
            <section className="section-card p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Shipping method
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Choose how you'd like your items delivered.
              </p>

              <div className="mt-4 space-y-3">
                {shippingOptions.map((opt) => (
                  <label
                    key={opt.id}
                    className="flex items-center gap-3 p-3 rounded-md border hover:shadow-sm transition cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="shippingMethod"
                      value={opt.id}
                      checked={selectedShippingMethod === opt.id}
                      onChange={() => setSelectedShippingMethod(opt.id)}
                      className="h-4 w-4"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{opt.label}</div>
                          <div className="text-xs text-gray-500">
                            {opt.details}
                          </div>
                        </div>
                        <div className="text-sm font-semibold">
                          {formatPrice(opt.priceCents)}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {/* Cart items list */}
            <section className="section-card p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Review items
                </h2>
                <button
                  onClick={() => setShowOrderSummary((s) => !s)}
                  className="text-sm text-indigo-600"
                >
                  {showOrderSummary ? "Hide" : "Show"} summary
                </button>
              </div>

              <ul className="mt-4 divide-y">
                {emptyCart ? (
                  <li className="p-6 text-center text-gray-500">
                    Your cart is empty.
                  </li>
                ) : (
                  cartItems.map((it) => <CartItemRow key={it.id} item={it} />)
                )}
              </ul>
            </section>

            {/* Promo & payment placeholder */}
            <section className="section-card p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Promo & payment
              </h2>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo code"
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleApplyPromo}
                    className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => {
                      setPromoCode("");
                      setPromoApplied(null);
                    }}
                    className="px-3 py-2 border border-gray-200 rounded-md text-sm hover:bg-gray-50"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="mt-3 text-sm">
                {promoApplied ? (
                  promoApplied.error ? (
                    <div className="text-sm text-red-600">
                      {promoApplied.error}
                    </div>
                  ) : (
                    <div className="text-sm text-green-700">
                      Applied {promoApplied.code} — Discount{" "}
                      {formatPrice(promoDiscountCents)}
                    </div>
                  )
                ) : (
                  <div className="text-sm text-gray-500">
                    Have a promo? Apply it above.
                  </div>
                )}
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700">
                  Payment method
                </h3>
                <div className="mt-3 p-3 rounded-md border border-dashed border-gray-200 bg-gray-50">
                  <p className="text-sm text-gray-700">
                    Payment integration goes here.
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    You can plug Stripe, Razorpay, or another gateway. For now
                    this is a placeholder.
                  </p>
                </div>
              </div>
            </section>

            {/* Place order */}
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-gray-600">
                By placing an order you agree to our{" "}
                <Link href="/terms" className="text-indigo-600">
                  Terms
                </Link>
                .
              </div>

              <div className="w-full sm:w-auto">
                <button
                  ref={placeOrderBtnRef}
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || emptyCart}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md text-white ${
                    emptyCart
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {isProcessing
                    ? "Processing..."
                    : `Place order — ${formatPrice(totalCents)}`}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: summary */}
          <aside className="pt-4">
            <div className="section-card p-4 sm:p-6 sticky-summary">
              <h2 className="text-lg font-semibold text-gray-900">
                Order summary
              </h2>

              <div className="mt-4 space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <div>Subtotal</div>
                  <div>{formatPrice(subtotalCents)}</div>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <div>Shipping</div>
                  <div>{formatPrice(shippingPriceCents)}</div>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <div>Promo</div>
                  <div
                    className={`${
                      promoDiscountCents > 0 ? "text-red-600" : "text-gray-500"
                    }`}
                  >
                    -{formatPrice(promoDiscountCents)}
                  </div>
                </div>

                <div className="border-t pt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-700 font-semibold">
                    Total
                  </div>
                  <div className="text-lg font-bold">
                    {formatPrice(totalCents)}
                  </div>
                </div>

                <div className="mt-3">
                  <button
                    onClick={() => setShowOrderSummary((s) => !s)}
                    className="w-full text-sm text-indigo-600"
                  >
                    {showOrderSummary ? "Hide details" : "View details"}
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <Link href="/shipping" className="block text-xs text-gray-500">
                  Shipping & returns policy
                </Link>
              </div>
            </div>

            {/* collapsed detail box for mobile when user toggles */}
            {showOrderSummary && (
              <div className="mt-4 section-card p-4 sm:p-6">
                <h3 className="text-sm font-semibold text-gray-900">Items</h3>
                <ul className="mt-3 divide-y">
                  {cartItems.map((it) => (
                    <li
                      key={it.id}
                      className="py-3 flex justify-between items-center"
                    >
                      <div className="text-sm text-gray-700">
                        {it.title} × {it.quantity}
                      </div>
                      <div className="text-sm font-semibold">
                        {formatPrice(it.price * it.quantity)}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </main>

      {/* Confirm modal */}
      {showConfirmModal && orderPlaced && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowConfirmModal(false)}
          />
          <div className="relative max-w-md w-full bg-white rounded-xl p-6 shadow-xl">
            <h3 className="text-lg font-bold">Order placed</h3>
            <p className="mt-2 text-sm text-gray-600">
              Thanks — your order{" "}
              <span className="font-mono text-sm">{orderPlaced.id}</span> has
              been received. We'll email details to{" "}
              <strong>{orderPlaced.shipping.email}</strong>.
            </p>

            <div className="mt-4">
              <div className="text-sm text-gray-700">
                Total:{" "}
                <span className="font-semibold">
                  {formatPrice(orderPlaced.totals.totalCents)}
                </span>
              </div>
              <div className="text-sm text-gray-700 mt-2">
                Shipping:{" "}
                <span className="font-semibold">
                  {orderPlaced.shippingMethod?.label}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                }}
                className="px-4 py-2 text-sm border rounded-md"
              >
                Close
              </button>
              <Link
                href={`/orders/${orderPlaced.id}`}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm"
              >
                View order
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
