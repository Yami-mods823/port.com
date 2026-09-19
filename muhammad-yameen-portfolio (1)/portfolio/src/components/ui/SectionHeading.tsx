'use client';

import { motion } from 'framer-motion';
import RevealText from './RevealText';
import { cn } from '@/lib/utils';

export default function SectionHeading({
  index,
  label,
  title,
  align = 'left',
  className,
}: {
  index: string;
  label: string;
  title: string;
  align?: 'left' | 'center';
  className?: string;
}) {
  return (
    <div className={cn('mb-14 md:mb-20', align === 'center' && 'text-center', className)}>
      <motion.div
        initial={{ opacity: 0, x: align === 'center' ? 0 : -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={cn(
          'flex items-center gap-3 text-bone-faint text-sm mb-5',
          align === 'center' && 'justify-center'
        )}
      >
        <span className="font-display italic text-bronze">{index}</span>
        <span className="hairline w-10" />
        <span>{label}</span>
      </motion.div>
      <RevealText
        as="h2"
        text={title}
        className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.05] text-balance text-bone"
      />
    </div>
  );
}
