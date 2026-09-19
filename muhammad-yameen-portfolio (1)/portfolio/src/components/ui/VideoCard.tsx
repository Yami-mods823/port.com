'use client';

import { motion } from 'framer-motion';
import { FaPlay } from 'react-icons/fa';
import TiltCard from './TiltCard';
import { VideoDTO } from '@/types';
import { formatDate } from '@/lib/utils';

export default function VideoCard({
  video,
  index,
  onOpen,
}: {
  video: VideoDTO;
  index: number;
  onOpen: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: (index % 6) * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <TiltCard className="rounded-2xl">
        <div className="relative rounded-2xl overflow-hidden border border-bone/10 bg-ink-800">
          <button
            onClick={onOpen}
            data-cursor-hover
            className="relative group block w-full aspect-video overflow-hidden focus-ring"
            aria-label={`Play ${video.title}`}
          >
            {video.thumbnailUrl ? (
              <motion.img
                src={video.thumbnailUrl}
                alt={video.title}
                className="h-full w-full object-cover"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-ink-700 to-ink-900 flex items-center justify-center">
                <span className="font-display italic text-bone-faint">{video.title}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/10 to-transparent" />

            <motion.span
              initial={{ scale: 0.7, opacity: 0 }}
              whileHover={{ scale: 1 }}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <span className="h-16 w-16 rounded-full glass flex items-center justify-center text-bone">
                <FaPlay className="ml-1" />
              </span>
            </motion.span>

            <span className="absolute top-3 left-3 rounded-full glass px-3 py-1 text-[11px] tracking-wide text-bone">
              {video.category}
            </span>
          </button>

          <div className="p-5">
            <div className="flex items-center justify-between gap-3 text-[11px] text-bone-faint mb-2">
              <span>{formatDate(video.date)}</span>
              {video.aiTools.length > 0 && <span className="truncate">{video.aiTools.join(' · ')}</span>}
            </div>
            <h3 className="font-display italic text-xl text-bone mb-1.5">{video.title}</h3>
            <p className="text-sm text-bone-dim line-clamp-2 mb-4">{video.description}</p>
            <div className="flex items-center gap-3">
              <button
                onClick={onOpen}
                data-cursor-hover
                className="text-sm text-bronze-light hover:text-bronze transition-colors focus-ring rounded"
              >
                Watch Video
              </button>
              <span className="text-bone/20">/</span>
              <button
                onClick={onOpen}
                data-cursor-hover
                className="text-sm text-bone-dim hover:text-bone transition-colors focus-ring rounded"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}
