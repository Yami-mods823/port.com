'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaPlay, FaPause, FaExpand, FaVolumeUp, FaVolumeMute, FaTimes } from 'react-icons/fa';
import { VideoDTO } from '@/types';
import { formatDate } from '@/lib/utils';

export default function VideoModal({
  video,
  onClose,
}: {
  video: VideoDTO | null;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (video) {
      setPlaying(false);
      setProgress(0);
    }
  }, [video]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const togglePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
  };

  const onTimeUpdate = () => {
    const el = videoRef.current;
    if (!el || !el.duration) return;
    setProgress((el.currentTime / el.duration) * 100);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = videoRef.current;
    if (!el || !el.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    el.currentTime = pct * el.duration;
  };

  const goFullscreen = () => {
    videoRef.current?.requestFullscreen?.();
  };

  return (
    <AnimatePresence>
      {video && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[95] flex items-center justify-center bg-ink-950/90 backdrop-blur-md p-4 md:p-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl rounded-2xl overflow-hidden border border-bone/10 bg-ink-900"
          >
            <div className="relative group bg-black">
              <video
                ref={videoRef}
                src={video.videoUrl}
                poster={video.thumbnailUrl || undefined}
                className="w-full aspect-video"
                onTimeUpdate={onTimeUpdate}
                onClick={togglePlay}
                playsInline
              />

              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute top-3 right-3 h-9 w-9 rounded-full glass flex items-center justify-center text-bone focus-ring"
              >
                <FaTimes />
              </button>

              {!playing && (
                <button
                  onClick={togglePlay}
                  aria-label="Play video"
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="h-16 w-16 rounded-full glass flex items-center justify-center text-bone">
                    <FaPlay className="ml-1" />
                  </span>
                </button>
              )}

              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <div
                  onClick={seek}
                  className="h-1.5 w-full rounded-full bg-white/20 cursor-pointer mb-3"
                >
                  <div
                    className="h-full rounded-full bg-bronze"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex items-center gap-4 text-bone">
                  <button onClick={togglePlay} aria-label="Play/Pause" className="focus-ring rounded">
                    {playing ? <FaPause /> : <FaPlay />}
                  </button>
                  <button onClick={toggleMute} aria-label="Mute/Unmute" className="focus-ring rounded">
                    {muted ? <FaVolumeMute /> : <FaVolumeUp />}
                  </button>
                  <div className="flex-1" />
                  <button onClick={goFullscreen} aria-label="Fullscreen" className="focus-ring rounded">
                    <FaExpand />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-3 text-xs text-bone-faint mb-3">
                <span className="rounded-full border border-bronze/40 text-bronze-light px-3 py-1">
                  {video.category}
                </span>
                <span>{formatDate(video.date)}</span>
              </div>
              <h3 className="font-display italic text-2xl md:text-3xl text-bone mb-3">
                {video.title}
              </h3>
              <p className="text-bone-dim leading-relaxed mb-4">{video.description}</p>
              {video.aiTools.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {video.aiTools.map((tool) => (
                    <span
                      key={tool}
                      className="text-xs px-3 py-1 rounded-full bg-ink-800 border border-bone/10 text-bone-dim"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
