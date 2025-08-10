"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function FadeUp({ children, delay = 0 }) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true, // will replay on re-enter
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100 }} // ⬅ increased from 40 to 80 for lower start
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
      transition={{ duration: 0.7, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
