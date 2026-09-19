'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import VideoCard from '@/components/ui/VideoCard';
import VideoModal from '@/components/ui/VideoModal';
import MagneticButton from '@/components/ui/MagneticButton';
import { VideoDTO } from '@/types';

const PAGE_SIZE = 6;

export default function VideoGallery({
  initialVideos,
  initialNextCursor,
  title,
}: {
  initialVideos: VideoDTO[];
  initialNextCursor: string | null;
  title: string;
}) {
  const [videos, setVideos] = useState(initialVideos);
  const [cursor, setCursor] = useState(initialNextCursor);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState<VideoDTO | null>(null);

  const loadMore = async () => {
    if (!cursor || loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/videos?limit=${PAGE_SIZE}&cursor=${cursor}`);
      const data = await res.json();
      setVideos((prev) => [...prev, ...data.videos]);
      setCursor(data.nextCursor);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ai-videos" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <SectionHeading index="01" label="Visual centerpiece" title={title} />

        {videos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-dashed border-bone/15 py-24 text-center"
          >
            <p className="font-display italic text-2xl text-bone-dim">
              AI video projects coming soon.
            </p>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {videos.map((v, i) => (
                <VideoCard key={v.id} video={v} index={i} onOpen={() => setActive(v)} />
              ))}
            </div>

            {cursor && (
              <div className="mt-14 flex justify-center">
                <MagneticButton onClick={loadMore} variant="outline">
                  {loading ? 'Loading…' : 'Load More'}
                </MagneticButton>
              </div>
            )}
          </>
        )}
      </div>

      <VideoModal video={active} onClose={() => setActive(null)} />
    </section>
  );
}
