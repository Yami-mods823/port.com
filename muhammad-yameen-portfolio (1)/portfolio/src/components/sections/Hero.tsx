'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import RevealText from '@/components/ui/RevealText';
import MagneticButton from '@/components/ui/MagneticButton';

export default function Hero({
  name,
  tagline,
  description,
}: {
  name: string;
  tagline: string;
  description: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-[100svh] flex items-center overflow-hidden pt-28"
    >
      {/* ambient background motion */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(198,161,91,0.10),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(92,70,54,0.18),transparent_50%)]" />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-[8%] h-72 w-72 rounded-full bg-bronze/10 blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-[10%] right-[10%] h-96 w-96 rounded-full bg-clay/20 blur-[120px]"
        />
        <div className="absolute inset-0 opacity-[0.4] [background-image:linear-gradient(rgba(244,242,236,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(244,242,236,0.035)_1px,transparent_1px)] [background-size:64px_64px]" />
      </div>

      {/* floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full bg-bronze-light/60"
          style={{
            top: `${15 + i * 13}%`,
            left: `${8 + ((i * 17) % 85)}%`,
          }}
          animate={{ y: [0, -22, 0], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
        />
      ))}

      <motion.div style={{ y, opacity }} className="mx-auto max-w-7xl w-full px-6 md:px-12">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.7 }}
          className="mb-6 flex items-center gap-3 text-bone-faint text-sm tracking-wide"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-bronze animate-pulse-glow" />
          Available for AI video &amp; development work
        </motion.p>

        <h1 className="font-display italic text-[15vw] leading-[0.92] sm:text-7xl md:text-8xl lg:text-[7.5rem] text-bone">
          <RevealText text={name} delay={2.15} stagger={0.05} />
        </h1>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.7 }}
          className="mt-6 text-xl sm:text-2xl md:text-3xl text-gradient-bronze font-display italic"
        >
          {tagline}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.7, duration: 0.7 }}
          className="mt-6 max-w-xl text-bone-dim text-base md:text-lg leading-relaxed"
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.9, duration: 0.7 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <MagneticButton href="#ai-videos">View My Work</MagneticButton>
          <MagneticButton href="#contact" variant="outline">
            Contact Me
          </MagneticButton>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.2, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[11px] tracking-[0.3em] text-bone-faint">SCROLL</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="h-8 w-px bg-gradient-to-b from-bronze to-transparent"
        />
      </motion.div>
    </section>
  );
}
