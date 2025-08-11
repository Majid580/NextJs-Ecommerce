"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaClock,
  FaPaperPlane,
  FaWhatsapp,
  FaInstagram,
  FaTwitter,
  FaFacebookF,
  FaCircle,
  FaCheckCircle,
} from "react-icons/fa";

/**
 * Contact Page (drop-in)
 *
 * - Mobile-first, fully responsive
 * - DaisyUI + Tailwind utility classes used for controls and buttons
 * - Rich Framer Motion animations and micro-interactions
 * - Long, highly-styled page with interactive components (counters, animated form, validation)
 *
 * Requirements:
 * - Tailwind CSS + DaisyUI must be installed and configured
 * - framer-motion and react-icons installed
 *
 * Notes:
 * - The form currently mocks submission (no backend). Replace `submitContact` with real API call.
 * - Map is an iframe placeholder — swap to your preferred map provider / embed key.
 */

/* ---------- animation helpers ---------- */
const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { delay, ease: "easeOut", duration: 0.6 },
  },
});

const pop = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.96 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { delay, duration: 0.45, ease: "backOut" },
  },
});

/* ---------- utility: animated counter hook ---------- */
function useAnimatedCounter(target, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = null;
    const initial = 0;
    const diff = target - initial;
    if (diff === 0) {
      setValue(target);
      return;
    }
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased =
        progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress; // basic easing
      setValue(Math.round(initial + diff * eased));
      if (elapsed < duration) requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

/* ---------- main export ---------- */
export default function ContactPage() {
  // form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    channel: "email",
  });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  // micro-interaction: live counters
  const apprentices = useAnimatedCounter(120);
  const messages = useAnimatedCounter(3420);
  const partners = useAnimatedCounter(28);

  // accessibility: focus after submit
  const successRef = useRef(null);

  // validate
  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
    if (!form.subject.trim()) e.subject = "Subject required";
    if (!form.message.trim() || form.message.trim().length < 8)
      e.message = "Please write a short message (8+ chars)";
    return e;
  }

  async function submitContact(e) {
    e && e.preventDefault();
    const eobj = validate();
    setErrors(eobj);
    if (Object.keys(eobj).length) return;
    setSending(true);
    setSentSuccess(false);

    // mock async submit
    await new Promise((res) => setTimeout(res, 1300));

    // fake success response
    setSending(false);
    setSentSuccess(true);
    setForm({
      name: "",
      email: "",
      subject: "",
      message: "",
      channel: form.channel,
    });

    // announce and focus
    successRef.current?.focus();
    // bump messages counter to feel alive
    // NOTE: in a real app you'd re-fetch a live metric
  }

  useEffect(() => {
    if (sentSuccess) {
      // small success animation side effect: increase messages slightly
      // this demonstrates local UI reaction; not persisted
    }
  }, [sentSuccess]);

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen text-gray-900">
      {/* HERO */}
      <header className="relative overflow-hidden pt-8 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeIn(0)}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
          >
            <div className="lg:col-span-7">
              <div className="bg-white/60 backdrop-blur-sm p-6 md:p-10 rounded-2xl border border-gray-100 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-xl font-extrabold shadow">
                    Hi
                  </div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                      Let's build something together
                    </h1>
                    <p className="mt-2 text-gray-600 leading-relaxed">
                      We're here to answer questions, discuss partnerships, or
                      help you understand how your purchase creates real
                      opportunities for makers. Choose a channel below — email,
                      call, or message — and we'll respond quickly.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3 items-center">
                  <ContactQuickButton
                    icon={<FaEnvelope />}
                    text="hello@yourstartup.com"
                    sub="Email us"
                  />
                  <ContactQuickButton
                    icon={<FaPhoneAlt />}
                    text="+92 300 0000000"
                    sub="Call / WhatsApp"
                  />
                  <ContactQuickButton
                    icon={<FaMapMarkerAlt />}
                    text="Lahore, Pakistan"
                    sub="Visit by appointment"
                  />
                </div>
              </div>

              {/* mission highlight */}
              <motion.div
                {...pop(0.1)}
                className="mt-6 rounded-2xl p-4 bg-black text-white shadow-lg border border-gray-800"
              >
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-white text-black rounded-full font-bold">
                    0%
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      0% Profit — All profit goes to workers
                    </h3>
                    <p className="text-sm text-gray-200 mt-1">
                      We don't take profit. Every rupee of operating profit
                      (after necessary costs) is pooled and distributed to the
                      workers who create these products. If you want to learn
                      about distribution, request our quarterly report and we’ll
                      walk you through the numbers.
                    </p>
                    <div className="mt-3 flex gap-3">
                      <a
                        className="btn btn-sm rounded-full bg-white text-black border border-gray-300 hover:bg-black hover:text-white transition"
                        href="#contact-form"
                      >
                        Contact us
                      </a>
                      <a
                        className="btn btn-sm rounded-full bg-white text-black border border-gray-300 hover:bg-black hover:text-white transition"
                        href="#impact"
                      >
                        See impact
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-5">
              <motion.div
                {...fadeIn(0.08)}
                className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100"
              >
                <h4 className="text-lg font-semibold">Reach out instantly</h4>
                <p className="text-sm text-gray-500 mt-1">
                  Pick a channel — we’ll respond in 24–48 hours for normal
                  requests.
                </p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <ContactMethodCard
                    icon={<FaWhatsapp />}
                    title="WhatsApp"
                    desc="Quick messages & order support"
                    actionText="Message on WhatsApp"
                    href="#"
                  />
                  <ContactMethodCard
                    icon={<FaPhoneAlt />}
                    title="Phone"
                    desc="For urgent matters"
                    actionText="Call us"
                    href="#"
                  />
                  <ContactMethodCard
                    icon={<FaEnvelope />}
                    title="Email"
                    desc="For partnerships & reports"
                    actionText="Send email"
                    href="mailto:hello@yourstartup.com"
                  />
                  <ContactMethodCard
                    icon={<FaClock />}
                    title="Hours"
                    desc="Mon — Sat, 9am — 6pm"
                    actionText="Plan a meeting"
                    href="#contact-form"
                  />
                </div>
              </motion.div>

              <motion.div
                {...fadeIn(0.12)}
                className="mt-4 p-4 rounded-lg bg-gradient-to-r from-white to-gray-50 border border-gray-100 shadow-sm"
              >
                <div className="text-sm text-gray-700">
                  We value accessibility — reply speed may vary by channel, but
                  we strive to reply within 48 hours for all enquiries. For
                  urgent support, WhatsApp is fastest.
                </div>
                <div className="mt-3 text-xs text-gray-400">
                  We keep your data private — see our Privacy page for details.
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* counters + mini CTA */}
        <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            {...pop(0)}
            className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 text-center"
          >
            <div className="text-xs text-gray-500">Apprentices trained</div>
            <div className="text-3xl font-extrabold">{apprentices}+</div>
            <div className="mt-2 text-sm text-gray-600">
              Paid training hours and on-the-job mentorship
            </div>
          </motion.div>

          <motion.div
            {...pop(0.06)}
            className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 text-center"
          >
            <div className="text-xs text-gray-500">Messages routed</div>
            <div className="text-3xl font-extrabold">
              {messages.toLocaleString()}
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Customer support & partner connections
            </div>
          </motion.div>

          <motion.div
            {...pop(0.12)}
            className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 text-center"
          >
            <div className="text-xs text-gray-500">Community partners</div>
            <div className="text-3xl font-extrabold">{partners}</div>
            <div className="mt-2 text-sm text-gray-600">
              Workshops & local suppliers
            </div>
          </motion.div>
        </section>

        {/* big contact area */}
        <section
          id="contact-form"
          className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start "
        >
          <motion.div
            {...fadeIn(0.06)}
            className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-md border border-gray-100"
          >
            <h2 className="text-2xl font-extrabold">Send us a message</h2>
            <p className="text-gray-600 mt-2">
              Whether you're a customer, a potential partner, or a journalist,
              we welcome your message. Share details and we'll route it to the
              right team.
            </p>

            <form onSubmit={submitContact} className="mt-6 space-y-4  ">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ">
                <FloatingInput
                  id="name"
                  value={form.name}
                  onChange={(v) => setForm({ ...form, name: v })}
                  error={errors.name}
                />
                <FloatingInput
                  id="email"
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                  error={errors.email}
                  type="email"
                />
              </div>

              <FloatingInput
                id="subject"
                value={form.subject}
                onChange={(v) => setForm({ ...form, subject: v })}
                error={errors.subject}
              />
              <FloatingTextarea
                id="message"
                rows={6}
                value={form.message}
                onChange={(v) => setForm({ ...form, message: v })}
                error={errors.message}
              />

              <div className="flex items-center gap-3 flex-wrap">
                <div className="text-sm text-gray-600">Preferred channel:</div>
                <div className="flex gap-2">
                  <RadioOption
                    name="channel"
                    checked={form.channel === "email"}
                    onChange={() => setForm({ ...form, channel: "email" })}
                    label="Email"
                  />
                  <RadioOption
                    name="channel"
                    checked={form.channel === "whatsapp"}
                    onChange={() => setForm({ ...form, channel: "whatsapp" })}
                    label="WhatsApp"
                  />
                  <RadioOption
                    name="channel"
                    checked={form.channel === "call"}
                    onChange={() => setForm({ ...form, channel: "call" })}
                    label="Call"
                  />
                </div>
                <div className="ml-auto text-sm text-gray-500">
                  All fields are required unless noted.
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={sending}
                  className="btn btn-sm rounded-full bg-black text-white hover:bg-gray-900 flex items-center gap-2"
                >
                  <FaPaperPlane /> {sending ? "Sending..." : "Send message"}
                </button>

                <AnimatePresence>
                  {sentSuccess && (
                    <motion.div
                      {...pop(0.05)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      tabIndex={-1}
                      ref={successRef}
                      className="text-sm text-green-600 flex items-center gap-2"
                    >
                      <FaCheckCircle /> Message sent — we’ll reply soon.
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="ml-auto text-xs text-gray-400">
                  We typically reply in 24–48 hours.
                </div>
              </div>
            </form>
          </motion.div>

          <motion.div
            {...fadeIn(0.1)}
            className="bg-white rounded-2xl p-6 shadow-md border border-gray-100"
          >
            <h3 className="text-lg font-semibold">Other ways to connect</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <div className="font-medium">Visit our workshop</div>
                  <div className="text-sm text-gray-500">
                    By appointment only — contact us to schedule a visit.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <FaEnvelope />
                </div>
                <div>
                  <div className="font-medium">Press & partnerships</div>
                  <div className="text-sm text-gray-500">
                    press@yourstartup.com
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <FaPhoneAlt />
                </div>
                <div>
                  <div className="font-medium">Phone</div>
                  <div className="text-sm text-gray-500">
                    +92 300 0000000 (Mon—Sat)
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Follow us</h4>
              <div className="flex gap-2">
                <IconLink icon={<FaInstagram />} href="#" label="Instagram" />
                <IconLink icon={<FaFacebookF />} href="#" label="Facebook" />
                <IconLink icon={<FaTwitter />} href="#" label="Twitter" />
                <IconLink icon={<FaWhatsapp />} href="#" label="WhatsApp" />
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Office hours</h4>
              <div className="text-sm text-gray-600">Mon–Sat: 9am — 6pm</div>
              <div className="text-sm text-gray-600">Sun: Closed</div>
            </div>
          </motion.div>
        </section>

        {/* Map and location */}
        <section className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            {...fadeIn(0.08)}
            className="bg-white rounded-2xl p-6 shadow-md border border-gray-100"
          >
            <h3 className="font-semibold text-lg mb-3">Find our workshop</h3>
            <p className="text-sm text-gray-600 mb-4">
              We operate local workshops across the region — the head office is
              in Lahore. Visits are by appointment only.
            </p>

            <div className="w-full h-64 rounded-lg overflow-hidden border">
              {/* Replace src with your map embed link */}
              <iframe
                title="Workshop map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3312.5376488855786!2d74.3586199152055!3d31.52036998139724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391903b3f4b8dbe9%3A0x7cad5b2c2f7b7f0!2sLahore%20Pakistan!5e0!3m2!1sen!2sus!4v1610000000000"
                className="w-full h-full"
                loading="lazy"
              />
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-xs text-gray-500">Address</div>
                <div className="text-sm font-medium">
                  Lahore, Pakistan — exact coordinates shared after booking
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-xs text-gray-500">Parking</div>
                <div className="text-sm font-medium">
                  Limited on-site; public nearby
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            {...fadeIn(0.1)}
            className="bg-white rounded-2xl p-6 shadow-md border border-gray-100"
          >
            <h3 className="font-semibold text-lg mb-3">
              Visiting tips & safety
            </h3>
            <ul className="list-disc ml-5 text-sm text-gray-600 space-y-2">
              <li>
                Book a visit by filling the form and choosing "Visit" in the
                subject.
              </li>
              <li>
                Wear closed-toe shoes if you're joining the workshop floor.
              </li>
              <li>
                Photography is allowed only with consent of the workers
                involved.
              </li>
              <li>
                We prioritize accessible visits — tell us if you need
                accommodations.
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Safety & privacy</h4>
              <p className="text-sm text-gray-600">
                We will never sell your contact information. All visitor details
                are used for scheduling and safety checks only.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Creative CTA */}
        <section className="mt-12">
          <motion.div
            {...pop(0.06)}
            className="rounded-2xl p-8 bg-gradient-to-r from-black to-gray-800 text-white shadow-lg flex flex-col lg:flex-row items-center gap-6"
          >
            <div className="flex-1">
              <h3 className="text-2xl font-extrabold">
                Have a creative idea? Let's partner.
              </h3>
              <p className="mt-2 text-gray-300">
                We collaborate on limited-run collections, community projects
                and training programs. Partnering helps us scale learning and
                paid work.
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="#contact-form"
                className="btn btn-sm rounded-full bg-white text-black hover:bg-black hover:text-white transition"
              >
                Start a project
              </a>
              <a
                href="#contact-form"
                className="btn btn-outline btn-sm rounded-full text-white border-white"
              >
                Request a call
              </a>
            </div>
          </motion.div>
        </section>

        {/* small footer CTA with microcopy */}
        <section className="mt-12 text-center">
          <p className="text-sm text-gray-600">
            If you'd like our quarterly distribution report, request it via the
            contact form and include "Distribution report" in the subject.
          </p>
        </section>

        {/* page footer */}
        <footer className="mt-12 pb-12 text-sm text-gray-500">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              © {new Date().getFullYear()} Sajid Garments — 0% Profit Model
            </div>
            <div className="flex gap-4">
              <a href="/terms" className="hover:underline">
                Terms
              </a>
              <a href="/privacy" className="hover:underline">
                Privacy
              </a>
              <a href="/about" className="hover:underline">
                About
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

/* ===========================
   Reusable small components
   =========================== */

function ContactQuickButton({ icon, text, sub }) {
  return (
    <a
      className="flex items-center gap-3 px-3 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition text-sm"
      href="#"
    >
      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-lg">
        {icon}
      </div>
      <div className="text-left">
        <div className="font-medium">{text}</div>
        <div className="text-xs text-gray-500">{sub}</div>
      </div>
    </a>
  );
}

function ContactMethodCard({ icon, title, desc, actionText, href }) {
  return (
    <a
      href={href}
      className="group bg-white rounded-lg p-3 flex items-start gap-3 hover:shadow-lg transition border border-gray-100"
    >
      <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center text-xl group-hover:bg-black group-hover:text-white transition">
        {icon}
      </div>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-gray-500">{desc}</div>
        <div className="mt-3">
          <span className="text-xs text-gray-400 mr-2">Action</span>
          <span className="text-sm font-medium">{actionText}</span>
        </div>
      </div>
    </a>
  );
}

function IconLink({ icon, href, label }) {
  return (
    <a
      href={href}
      className="w-9 h-9 rounded-full bg-white border flex items-center justify-center text-sm shadow-sm hover:shadow-md transition"
    >
      {icon}
      <span className="sr-only">{label}</span>
    </a>
  );
}

function FloatingInput({ label, id, value, onChange, error, type = "text" }) {
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`input input-bordered w-full pr-3 ${
          error ? "border-red-400" : ""
        }`}
        placeholder=" "
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      <label
        htmlFor={id}
        className="label-text text-sm absolute left-3 -top-3 bg-white px-1 text-gray-600"
      >
        {label}
      </label>
      {error && (
        <div id={`${id}-error`} className="text-xs text-red-500 mt-1">
          {error}
        </div>
      )}
    </div>
  );
}

function FloatingTextarea({ label, id, value, onChange, error, rows = 4 }) {
  return (
    <div className="relative">
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={`textarea textarea-bordered w-full pr-3 ${
          error ? "border-red-400" : ""
        }`}
        placeholder=" "
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      <label
        htmlFor={id}
        className="label-text text-sm absolute left-3 -top-3 bg-white px-1 text-gray-600"
      >
        {label}
      </label>
      {error && (
        <div id={`${id}-error`} className="text-xs text-red-500 mt-1">
          {error}
        </div>
      )}
    </div>
  );
}

function RadioOption({ name, label, checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`btn btn-xs rounded-full ${
        checked
          ? "bg-black text-white"
          : "bg-white text-black border border-gray-300"
      } transition`}
      aria-pressed={checked}
    >
      {label}
    </button>
  );
}
