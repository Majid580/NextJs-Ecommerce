"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaHandsHelping,
  FaHandHoldingUsd,
  FaSeedling,
  FaTools,
  FaUsers,
  FaClock,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaChevronRight,
} from "react-icons/fa";

/**
 * About Us Page
 *
 * - Long, richly styled, animated page
 * - Emphasizes 0% profit model and worker-first mission
 * - Uses Tailwind + DaisyUI classes on buttons & elements
 * - Framer-motion for smooth reveal animations
 *
 * Drop into app/about/page.jsx
 */

const sectionFade = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, ease: "easeOut", duration: 0.6 },
  }),
};

const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export default function AboutUs() {
  const [faqOpen, setFaqOpen] = useState(null);

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 text-gray-900">
      {/* HERO */}
      <header className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <motion.div
            initial="hidden"
            animate="show"
            variants={staggerParent}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            <motion.div variants={sectionFade} className="lg:col-span-7">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 md:p-10 shadow-lg border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-2xl shadow-md">
                    0%
                  </div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight">
                      0% Profit — 100% For The Makers
                    </h1>
                    <p className="mt-1 text-sm text-gray-600 max-w-xl">
                      We're not a factory chasing margins — we're a skills-first
                      startup that returns every cent of profit to the workers
                      who stitch, craft and shape our garments. Join us to
                      support learning, fair pay, and opportunity.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center">
                  <a
                    href="#how"
                    className="btn btn-sm rounded-full bg-white text-black border border-gray-300 hover:bg-black hover:text-white transition"
                  >
                    Learn how it works
                    <FaChevronRight className="ml-2" />
                  </a>

                  <a
                    href="#stories"
                    className="btn btn-sm rounded-full bg-white text-black border border-gray-300 hover:bg-black hover:text-white transition"
                    aria-label="Read worker stories"
                  >
                    Read worker stories
                    <FaChevronRight className="ml-2" />
                  </a>

                  <div className="ml-auto flex items-center gap-3">
                    <div className="text-xs text-gray-500">Founded</div>
                    <div className="text-sm font-medium">2024</div>
                    <div className="h-0.5 w-6 bg-gray-200 mx-2" />
                    <div className="text-xs text-gray-500">Location</div>
                    <div className="text-sm font-medium">Pakistan</div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <StatCard title="Profit to Workers" value="100%" />
                  <StatCard title="Local Workshops" value="7" />
                  <StatCard title="Apprenticeships" value="120+" />
                </div>
              </div>
            </motion.div>

            <motion.div variants={sectionFade} className="lg:col-span-5">
              <VisualPanel />
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative SVG wave */}
        <div className="-mt-6">
          <svg
            viewBox="0 0 1440 80"
            className="w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0,48L120,58.7C240,69,480,91,720,85.3C960,80,1200,48,1320,32L1440,16L1440,0L0,0Z"
              fill="url(#g1)"
              opacity="0.7"
            />
            <defs>
              <linearGradient id="g1" x1="0" x2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#f8fafc" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-24">
        {/* Mission */}
        <section id="how" className="mt-10">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={staggerParent}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
          >
            <motion.div
              variants={sectionFade}
              className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-md border border-gray-100"
            >
              <h2 className="text-2xl font-extrabold mb-2">
                Our Mission: Opportunity through Craft
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                We exist to create sustainable pathways for employment and skill
                development in garment production. Unlike conventional
                businesses that prioritize profit, we prioritize people. Our
                business model returns every rupee of operating profit to the
                hands, families and training programs that made the product — so
                every purchase doubles as a contribution to livelihoods.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FeatureCard
                  icon={<FaHandsHelping />}
                  title="Worker-first pay"
                  desc="All profit is pooled and distributed to our makers — directly and transparently."
                />
                <FeatureCard
                  icon={<FaSeedling />}
                  title="Skill-building"
                  desc="Apprenticeships and paid training let people learn tailoring, pattern-making and quality control."
                />
                <FeatureCard
                  icon={<FaTools />}
                  title="Tool access"
                  desc="Workers receive access to tools, materials and mentorship during training."
                />
                <FeatureCard
                  icon={<FaUsers />}
                  title="Community impact"
                  desc="Local supply chains, local hires — we invest where our staff live."
                />
              </div>

              <blockquote className="mt-6 p-4 border-l-4 border-black bg-gray-50 rounded">
                <p className="text-sm text-gray-700">
                  “No gimmicks — our goal is simple: create dignified paid work
                  and teach people skills that last a lifetime. Profit follows
                  purpose — we simply redirect it back to the people.” —
                  Founding Team
                </p>
              </blockquote>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  className="btn btn-sm rounded-full bg-white text-black border border-gray-300 hover:bg-black hover:text-white transition"
                  href="#stories"
                >
                  Meet our makers
                </a>
                <a
                  className="btn btn-sm rounded-full bg-white text-black border border-gray-300 hover:bg-black hover:text-white transition"
                  href="#impact"
                >
                  Impact report
                </a>
              </div>
            </motion.div>

            <motion.div
              variants={sectionFade}
              className="bg-white rounded-2xl p-6 shadow-md border border-gray-100"
            >
              <h3 className="text-lg font-semibold mb-3">
                How 0% Profit Works
              </h3>
              <ol className="list-decimal ml-5 text-gray-700 space-y-3">
                <li>
                  <span className="font-semibold">Revenue minus costs</span> —
                  we calculate operating revenue and subtract material,
                  logistics, and necessary operational costs.
                </li>
                <li>
                  <span className="font-semibold">0% profit policy</span> — any
                  remaining operating profit is marked for distribution.
                </li>
                <li>
                  <span className="font-semibold">Worker allocation</span> —
                  profits are distributed to makers as bonus payments & training
                  grants, prioritized by hours, impact, and participation in
                  training.
                </li>
                <li>
                  <span className="font-semibold">Transparency</span> — each
                  quarter we publish a distribution report showing how profits
                  were allocated.
                </li>
              </ol>

              <div className="mt-6 text-sm text-gray-500">
                <strong>Note:</strong> This model covers operating profit only.
                We retain a tiny reserve to ensure continuity of training
                programs and essential operations during seasonal fluctuations.
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Impact numbers */}
        <section id="impact" className="mt-12">
          <div className="bg-gradient-to-r from-white via-gray-50 to-white rounded-2xl p-6 shadow-md border border-gray-100">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={staggerParent}
              className="grid grid-cols-1 sm:grid-cols-4 gap-4"
            >
              <motion.div
                variants={sectionFade}
                className="p-4 bg-white rounded-lg shadow-sm text-center"
              >
                <div className="text-3xl font-extrabold">120+</div>
                <div className="text-sm text-gray-500">Apprentices trained</div>
              </motion.div>
              <motion.div
                variants={sectionFade}
                className="p-4 bg-white rounded-lg shadow-sm text-center"
              >
                <div className="text-3xl font-extrabold">7</div>
                <div className="text-sm text-gray-500">Local workshops</div>
              </motion.div>
              <motion.div
                variants={sectionFade}
                className="p-4 bg-white rounded-lg shadow-sm text-center"
              >
                <div className="text-3xl font-extrabold">100%</div>
                <div className="text-sm text-gray-500">Profit returned</div>
              </motion.div>
              <motion.div
                variants={sectionFade}
                className="p-4 bg-white rounded-lg shadow-sm text-center"
              >
                <div className="text-3xl font-extrabold">8,000+</div>
                <div className="text-sm text-gray-500">
                  Hours of paid training
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stories */}
        <section id="stories" className="mt-12">
          <h2 className="text-2xl font-extrabold mb-4">
            Stories from Our Makers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StoryCard
              name="Amina"
              role="Tailor & Trainer"
              excerpt="“I learned to stitch and now I teach — the bonuses helped me buy a sewing machine.”"
            />
            <StoryCard
              name="Rizwan"
              role="Pattern Maker"
              excerpt="“My hours are flexible so I can take classes. I earn more than before.”"
            />
            <StoryCard
              name="Sana"
              role="Quality Checker"
              excerpt="“I used to repair clothes. Now I check them — and earn a stable income.”"
            />
          </div>

          <div className="mt-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg p-6 shadow-md border border-gray-100"
            >
              <h3 className="font-semibold text-lg mb-2">
                Your purchase = direct support
              </h3>
              <p className="text-gray-600 leading-relaxed">
                When you buy from us, you become part of the distribution
                system. 100% of profit (after costs) goes into quarterly payouts
                and learning programs — that money goes directly to workers and
                apprentices. We publish the numbers and stories to make the
                impact real.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Process timeline */}
        <section className="mt-12">
          <h2 className="text-2xl font-extrabold mb-6">
            How We Build — Step by Step
          </h2>
          <div className="space-y-4">
            <ProcessStep
              number="1"
              title="Design & Material Sourcing"
              body="Design is done locally with input from makers to keep patterns practical and reduce waste. Materials are sourced from nearby suppliers to keep the community economy cycling."
            />
            <ProcessStep
              number="2"
              title="Apprenticeship & Training"
              body="New workers enroll in paid apprenticeships — classroom time, hands-on practice and mentoring from experienced tailors."
            />
            <ProcessStep
              number="3"
              title="Production in Local Workshops"
              body="Small batches are produced in local workshops, ensuring quality and steady work."
            />
            <ProcessStep
              number="4"
              title="Quality & Distribution"
              body="Products are checked, packaged and sent directly to customers — revenue flows back to overhead + worker distributions."
            />
          </div>
        </section>

        {/* CTA / Join */}
        <section className="mt-12 bg-black text-white rounded-2xl p-8 shadow-lg">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center"
          >
            <div className="md:col-span-2">
              <h3 className="text-2xl font-extrabold">
                Be a part of the movement
              </h3>
              <p className="mt-2 text-gray-200">
                Support jobs by buying intentionally. Or partner with us to
                expand learning programs and workshops. Every sale trains, pays
                and empowers a maker.
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="/products"
                className="btn btn-outline btn-sm rounded-full bg-white text-black hover:bg-black hover:text-white transition"
              >
                Shop purposefully
              </a>
              <a
                href="/contact"
                className="btn btn-sm rounded-full bg-white text-black hover:bg-black hover:text-white transition"
              >
                Partner with us
              </a>
            </div>
          </motion.div>
        </section>

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="text-2xl font-extrabold mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            <FAQItem
              idx={0}
              title="How exactly is profit calculated?"
              open={faqOpen === 0}
              onToggle={() => setFaqOpen(faqOpen === 0 ? null : 0)}
            >
              <p className="text-gray-600">
                We subtract direct costs (materials, shipping), variable
                operating costs (utilities, logistics), and essential reserves
                for continuity. Remaining operating profit is then pooled for
                distribution.
              </p>
            </FAQItem>

            <FAQItem
              idx={1}
              title="Can I donate directly to workers?"
              open={faqOpen === 1}
              onToggle={() => setFaqOpen(faqOpen === 1 ? null : 1)}
            >
              <p className="text-gray-600">
                Yes — we accept one-off donations that go to the training fund
                and hardship grants. Contact us on the form below.
              </p>
            </FAQItem>

            <FAQItem
              idx={2}
              title="Is this model sustainable long-term?"
              open={faqOpen === 2}
              onToggle={() => setFaqOpen(faqOpen === 2 ? null : 2)}
            >
              <p className="text-gray-600">
                We balance growth with sustainable wages and reserves.
                Transparency and community partnerships are essential to scaling
                responsibly.
              </p>
            </FAQItem>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold mb-3">Get in touch</h3>
              <p className="text-gray-600 mb-4">
                Questions about partnerships, wholesale, or our reports? Fill
                the form and we’ll respond within 48 hours.
              </p>

              <ContactForm />
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
              <h4 className="font-semibold mb-3">Head Office</h4>
              <p className="text-sm text-gray-600">
                <FaMapMarkerAlt className="inline mr-2" /> Lahore, Pakistan
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <FaEnvelope className="inline mr-2" /> hello@yourstartup.com
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <FaPhoneAlt className="inline mr-2" /> +92 300 0000000
              </p>
              <div className="mt-6">
                <a
                  className="btn btn-sm rounded-full bg-white text-black border border-gray-300 hover:bg-black hover:text-white transition"
                  href="/impact"
                >
                  Read impact report
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 border-t pt-6 pb-12 text-sm text-gray-500">
          <div className="flex items-center justify-between">
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
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

/* ---------------------------
   Small reusable presentational components
   --------------------------- */

function StatCard({ title, value }) {
  return (
    <div className="p-3 bg-white rounded-md shadow-sm flex items-center gap-3">
      <div className="flex-1">
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-xl font-bold">{value}</div>
      </div>
    </div>
  );
}

function VisualPanel() {
  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl p-6 shadow-lg border border-gray-100 h-full flex flex-col justify-center">
      <div className="relative aspect-[4/3] bg-gradient-to-tr from-gray-100 to-white rounded-lg overflow-hidden shadow-inner">
        <svg viewBox="0 0 600 400" className="w-full h-full">
          <defs>
            <linearGradient id="a" x1="0" x2="1">
              <stop offset="0%" stopColor="#111827" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#111827" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#a)" />
          <g transform="translate(60,40)">
            <rect
              x="0"
              y="20"
              width="140"
              height="120"
              rx="12"
              fill="#ffffff"
              stroke="#e6e6e6"
            />
            <rect
              x="170"
              y="0"
              width="140"
              height="160"
              rx="12"
              fill="#ffffff"
              stroke="#e6e6e6"
            />
            <rect
              x="340"
              y="40"
              width="140"
              height="120"
              rx="12"
              fill="#ffffff"
              stroke="#e6e6e6"
            />
            <circle cx="70" cy="90" r="18" fill="#f8fafc" />
            <circle cx="240" cy="60" r="18" fill="#f8fafc" />
            <circle cx="410" cy="80" r="18" fill="#f8fafc" />
            <text x="10" y="170" fontSize="12" fill="#9CA3AF">
              Craft. Train. Pay.
            </text>
          </g>
        </svg>
      </div>

      <div className="mt-4">
        <h4 className="font-semibold">People-first production</h4>
        <p className="text-sm text-gray-500 mt-1">
          A light, modern visual that reflects local workshops and hands-on
          craft.
        </p>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 flex gap-3 items-start">
      <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-lg">
        {icon}
      </div>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-gray-600">{desc}</div>
      </div>
    </div>
  );
}

function StoryCard({ name, role, excerpt }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="bg-white rounded-lg p-6 shadow-md border border-gray-100"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
          {name[0]}
        </div>
        <div>
          <div className="font-semibold">{name}</div>
          <div className="text-sm text-gray-500">{role}</div>
        </div>
      </div>
      <p className="mt-4 text-gray-700">{excerpt}</p>
      <div className="mt-4">
        <a className="text-sm underline text-gray-900" href="#">
          Read full story
        </a>
      </div>
    </motion.div>
  );
}

function ProcessStep({ number, title, body }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
          {number}
        </div>
        <div>
          <div className="font-semibold">{title}</div>
          <div className="text-sm text-gray-600 mt-1">{body}</div>
        </div>
      </div>
    </motion.div>
  );
}

function FAQItem({ idx, title, children, open, onToggle }) {
  return (
    <div className="bg-white rounded-lg border p-3 shadow-sm">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="text-sm font-medium">{title}</div>
        <div className="text-gray-500">{open ? "−" : "+"}</div>
      </button>
      {open && <div className="mt-3 text-gray-600">{children}</div>}
    </div>
  );
}

function ContactForm() {
  const [state, setState] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  function submit(e) {
    e.preventDefault();
    // placeholder: would call API
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          required
          value={state.name}
          onChange={(e) => setState({ ...state, name: e.target.value })}
          className="input input-bordered w-full  bg-white text-black border"
          placeholder="Your name"
        />
        <input
          required
          value={state.email}
          onChange={(e) => setState({ ...state, email: e.target.value })}
          className="input input-bordered w-full  bg-white text-black border"
          placeholder="Email address"
          type="email"
        />
      </div>

      <textarea
        required
        value={state.message}
        onChange={(e) => setState({ ...state, message: e.target.value })}
        className="textarea textarea-bordered w-full  bg-white text-black border"
        rows={6}
        placeholder="Tell us about your inquiry"
      />

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="btn btn-sm rounded-full bg-white text-black hover:bg-black hover:text-white"
        >
          Send message
        </button>
        {sent && (
          <div className="text-sm text-green-600">
            Message sent — we’ll reply soon.
          </div>
        )}
      </div>
    </form>
  );
}
