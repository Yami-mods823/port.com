'use client';

import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaWhatsapp,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { SocialLinkDTO } from '@/types';
import { cn } from '@/lib/utils';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  GITHUB: FaGithub,
  LINKEDIN: FaLinkedin,
  INSTAGRAM: FaInstagram,
  YOUTUBE: FaYoutube,
  TIKTOK: FaTiktok,
  WHATSAPP: FaWhatsapp,
};

export default function SocialIcons({
  social,
  size = 'md',
}: {
  social: SocialLinkDTO[];
  size?: 'sm' | 'md';
}) {
  const active = social.filter((s) => s.url);
  if (active.length === 0) return null;

  return (
    <div className="flex items-center gap-3">
      {active.map((s) => {
        const Icon = ICONS[s.platform];
        return (
          <motion.a
            key={s.platform}
            href={s.url!}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-hover
            whileHover={{ y: -3, scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            aria-label={s.platform}
            className={cn(
              'flex items-center justify-center rounded-full border border-bone/15 text-bone-dim hover:text-bronze hover:border-bronze/50 transition-colors',
              size === 'sm' ? 'h-9 w-9' : 'h-11 w-11'
            )}
          >
            <Icon className={size === 'sm' ? 'text-sm' : 'text-base'} />
          </motion.a>
        );
      })}
    </div>
  );
}
