'use client';

import { motion } from 'framer-motion';
import { FaLaptopCode, FaLayerGroup, FaDatabase, FaCube } from 'react-icons/fa';
import SectionHeading from '@/components/ui/SectionHeading';

const PILLARS = [
  {
    icon: FaLaptopCode,
    title: 'Web development',
    desc: 'End-to-end builds, from architecture to deployment, tuned for speed and reliability.',
  },
  {
    icon: FaLayerGroup,
    title: 'Frontend development',
    desc: 'Interactive, animated, accessible interfaces people actually enjoy using.',
  },
  {
    icon: FaCube,
    title: 'Backend development',
    desc: 'Clean APIs, sound data models, and systems that scale without drama.',
  },
  {
    icon: FaDatabase,
    title: 'Database & applications',
    desc: 'Structured data, cloud-native storage, and full modern application development.',
  },
];

export default function SoftwareDev() {
  return (
    <section className="relative py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="flex items-end justify-between gap-6 mb-14 md:mb-20 flex-wrap">
          <SectionHeading
            index="03.5"
            label="Second discipline"
            title="Software Development"
            className="mb-0"
          />
          <p className="max-w-sm text-bone-dim text-sm md:text-base leading-relaxed">
            Alongside AI video work, I design and build modern web applications — the engineering
            half of everything I make.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              whileHover={{ y: -6, borderColor: 'rgba(198,161,91,0.5)' }}
              className="rounded-2xl border border-bone/10 p-7 bg-ink-900/50"
            >
              <p.icon className="text-bronze text-2xl mb-5" />
              <h3 className="font-display italic text-xl text-bone mb-2">{p.title}</h3>
              <p className="text-sm text-bone-dim leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
