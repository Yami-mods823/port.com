'use client';

import { useEffect, useState } from 'react';
import { inputClass } from '@/components/admin/Field';
import { SocialLinkDTO } from '@/types';

const LABELS: Record<string, string> = {
  GITHUB: 'GitHub',
  LINKEDIN: 'LinkedIn',
  INSTAGRAM: 'Instagram',
  YOUTUBE: 'YouTube',
  TIKTOK: 'TikTok',
  WHATSAPP: 'WhatsApp',
};

export default function SocialAdminPage() {
  const [links, setLinks] = useState<SocialLinkDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingPlatform, setSavingPlatform] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch('/api/social');
    const data = await res.json();
    setLinks(data.links);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const update = (platform: string, url: string) => {
    setLinks((prev) => prev.map((l) => (l.platform === platform ? { ...l, url } : l)));
  };

  const save = async (platform: string, url: string | null) => {
    setSavingPlatform(platform);
    try {
      await fetch('/api/social', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, url }),
      });
    } finally {
      setSavingPlatform(null);
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display italic text-3xl text-bone">Social Links</h1>
        <p className="text-sm text-bone-faint mt-1">
          Leave a field empty to automatically hide that icon on the public site.
        </p>
      </div>

      <div className="rounded-2xl border border-bone/10 bg-ink-900/40 p-6 space-y-5">
        {loading ? (
          <p className="text-bone-dim text-sm">Loading…</p>
        ) : (
          links.map((link) => (
            <div key={link.platform} className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="w-28 shrink-0 text-sm text-bone-dim">{LABELS[link.platform]}</span>
              <input
                className={inputClass}
                placeholder={`https://...`}
                value={link.url || ''}
                onChange={(e) => update(link.platform, e.target.value)}
                onBlur={(e) => save(link.platform, e.target.value || null)}
              />
              <span className="w-16 shrink-0 text-xs text-bone-faint text-right">
                {savingPlatform === link.platform ? 'Saving…' : ''}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
