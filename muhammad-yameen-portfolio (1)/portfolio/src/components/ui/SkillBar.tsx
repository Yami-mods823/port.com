'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';
import { SkillDTO } from '@/types';

export default function SkillBar({ skill, index }: { skill: SkillDTO; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const radius = 34;
  const circumference = 2 * Math.PI * radius;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: (index % 4) * 0.08 }}
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-bone/10 bg-ink-900/60 p-6 flex flex-col items-center text-center gap-4"
    >
      <div className="relative h-20 w-20">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={radius} fill="none" stroke="#1B1B21" strokeWidth="6" />
          <motion.circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="url(#bronzeGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={
              inView ? { strokeDashoffset: circumference * (1 - skill.percentage / 100) } : {}
            }
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          />
          <defs>
            <linearGradient id="bronzeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E4C888" />
              <stop offset="100%" stopColor="#8F7135" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {skill.logoUrl ? (
            <img src={skill.logoUrl} alt={skill.name} className="h-7 w-7 object-contain" />
          ) : (
            <AnimatedCounter value={skill.percentage} suffix="%" className="text-sm font-medium text-bone" />
          )}
        </div>
      </div>
      <div>
        <p className="text-bone font-medium">{skill.name}</p>
        <p className="text-xs text-bone-faint mt-1">
          <AnimatedCounter value={skill.percentage} suffix="%" />
        </p>
      </div>
    </motion.div>
  );
}
