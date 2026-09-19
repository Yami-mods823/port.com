'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

export default function About({
  heading,
  body,
  profileImageUrl,
  age,
}: {
  heading: string;
  body: string;
  profileImageUrl?: string | null;
  age: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  const stats = [
    { value: age, suffix: '', label: 'Years old' },
    { value: 2, suffix: '', label: 'Core disciplines' },
    { value: 100, suffix: '%', label: 'Original AI craft' },
  ];

  return (
    <section id="about" ref={ref} className="relative py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-12 grid md:grid-cols-2 gap-14 md:gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, clipPath: 'inset(8% 8% 8% 8%)' }}
          whileInView={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-bone/10 order-2 md:order-1"
        >
          <motion.div style={{ y: imgY }} className="absolute inset-[-8%]">
            {profileImageUrl ? (
              <img src={profileImageUrl} alt="Muhammad Yameen" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-ink-700 via-ink-800 to-ink-900 flex items-center justify-center">
                <span className="font-display italic text-6xl text-bone-faint">MY</span>
              </div>
            )}
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/40 via-transparent to-transparent" />
        </motion.div>

        <div className="order-1 md:order-2">
          <SectionHeading index="02" label="The person" title={heading} className="mb-8" />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-bone-dim text-lg leading-relaxed mb-10"
          >
            {body}
          </motion.p>

          <div className="grid grid-cols-3 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="border-t border-bone/10 pt-4"
              >
                <AnimatedCounter
                  value={s.value}
                  suffix={s.suffix}
                  className="font-display italic text-3xl md:text-4xl text-bronze-light"
                />
                <p className="text-xs text-bone-faint mt-2">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
