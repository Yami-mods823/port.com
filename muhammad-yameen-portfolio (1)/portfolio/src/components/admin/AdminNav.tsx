'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const ITEMS = [
  { href: '/moin', label: 'General' },
  { href: '/moin/videos', label: 'Videos' },
  { href: '/moin/projects', label: 'Projects' },
  { href: '/moin/skills', label: 'Skills' },
  { href: '/moin/social', label: 'Social Links' },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-bone/10 bg-ink-900/40">
      <div className="px-5 py-6 md:py-8">
        <Link href="/" className="block mb-8">
          <p className="text-xs text-bone-faint tracking-wide">Admin dashboard</p>
          <p className="font-display italic text-xl text-bone">Muhammad Yameen</p>
        </Link>

        <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          {ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'shrink-0 rounded-lg px-4 py-2.5 text-sm transition-colors whitespace-nowrap',
                  active
                    ? 'bg-bronze text-ink-950 font-medium'
                    : 'text-bone-dim hover:bg-ink-800 hover:text-bone'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <Link
          href="/"
          target="_blank"
          className="hidden md:inline-block mt-8 text-xs text-bone-faint hover:text-bronze-light transition-colors"
        >
          View live site →
        </Link>
      </div>
    </nav>
  );
}
