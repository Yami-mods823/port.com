'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#ai-videos', label: 'AI Videos' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar({
  name,
  logoUrl,
}: {
  name: string;
  logoUrl?: string | null;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('#home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = LINKS.map((l) => document.querySelector(l.href)).filter(
      Boolean
    ) as Element[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-all duration-500',
          scrolled ? 'py-3' : 'py-6'
        )}
      >
        <div
          className={cn(
            'mx-auto max-w-7xl px-5 md:px-8 flex items-center justify-between rounded-full transition-all duration-500',
            scrolled ? 'glass py-2.5 px-5 md:px-6 mx-4 md:mx-auto' : ''
          )}
        >
          <a href="#home" className="flex items-center gap-3" data-cursor-hover>
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={`${name} logo`}
                width={34}
                height={34}
                className="rounded-full object-cover"
              />
            ) : (
              <span className="h-8 w-8 rounded-full border border-bronze/50 flex items-center justify-center font-display italic text-bronze text-sm">
                {name.charAt(0)}
              </span>
            )}
            <span className="font-display italic text-lg tracking-tight text-bone">{name}</span>
          </a>

          <nav className="hidden md:flex items-center gap-1">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                data-cursor-hover
                className={cn(
                  'relative px-4 py-2 text-sm rounded-full transition-colors',
                  active === link.href ? 'text-ink-950' : 'text-bone-dim hover:text-bone'
                )}
              >
                {active === link.href && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 bg-bronze rounded-full"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </a>
            ))}
          </nav>

          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            data-cursor-hover
            className="md:hidden relative h-9 w-9 flex flex-col items-center justify-center gap-1.5 focus-ring rounded-full"
          >
            <span className="block h-px w-5 bg-bone" />
            <span className="block h-px w-5 bg-bone" />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-ink-950/98 backdrop-blur-xl md:hidden"
          >
            <div className="flex justify-end p-6">
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="h-9 w-9 flex items-center justify-center text-bone text-2xl focus-ring rounded-full"
              >
                ×
              </button>
            </div>
            <nav className="flex flex-col items-center gap-6 mt-8">
              {LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i, duration: 0.5 }}
                  className="font-display italic text-3xl text-bone hover:text-bronze transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
