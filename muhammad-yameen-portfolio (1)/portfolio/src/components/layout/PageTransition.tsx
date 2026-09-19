'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Skip the loading screen on client-side route changes / repeat visits within a session.
    const seen = sessionStorage.getItem('my-loaded');
    if (seen) {
      setLoading(false);
      return;
    }
    const timer = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem('my-loaded', '1');
    }, 1900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loader"
            exit={{
              opacity: 0,
              transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] },
            }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink-950"
          >
            <motion.div
              initial={{ clipPath: 'inset(0 100% 0 0)' }}
              animate={{ clipPath: 'inset(0 0% 0 0)' }}
              transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
              className="overflow-hidden"
            >
              <h1 className="font-display text-4xl md:text-6xl italic tracking-tight text-bone">
                Muhammad Yameen
              </h1>
            </motion.div>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1], delay: 0.35 }}
              className="mt-6 h-[2px] w-40 origin-left bg-gradient-to-r from-transparent via-bronze to-transparent"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-5 text-xs tracking-[0.3em] text-bone-faint"
            >
              AI Video Creator &amp; Software Developer
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: loading ? 1.9 : 0 }}
      >
        {children}
      </motion.div>
    </>
  );
}
