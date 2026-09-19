'use client';

import { useEffect, useState } from 'react';
import { Field, inputClass, textareaClass } from '@/components/admin/Field';
import UploadField from '@/components/admin/UploadField';
import { SiteSettingsDTO } from '@/types';

const EMPTY: SiteSettingsDTO = {
  name: '',
  age: 0,
  email: '',
  phone: '',
  bio: '',
  heroTagline: '',
  heroDescription: '',
  aboutHeading: '',
  aboutBody: '',
  videosSectionTitle: '',
  projectsSectionTitle: '',
  skillsSectionTitle: '',
  profileImageUrl: null,
  logoUrl: null,
};

export default function GeneralSettingsPage() {
  const [data, setData] = useState<SiteSettingsDTO>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  const set = <K extends keyof SiteSettingsDTO>(key: K, value: SiteSettingsDTO[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    setStatus('saving');
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('error');
    }
  };

  if (loading) return <p className="text-bone-dim">Loading…</p>;

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display italic text-3xl text-bone">General</h1>
          <p className="text-sm text-bone-faint mt-1">
            Edit the content shown across your public site.
          </p>
        </div>
        <SaveButton status={status} onClick={save} />
      </div>

      <Section title="Profile & images">
        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          <UploadField
            label="Profile image"
            kind="image"
            value={data.profileImageUrl}
            onChange={(url) => set('profileImageUrl', url || null)}
          />
          <UploadField
            label="Website logo"
            kind="image"
            value={data.logoUrl}
            onChange={(url) => set('logoUrl', url || null)}
          />
        </div>
      </Section>

      <Section title="General information">
        <div className="grid sm:grid-cols-2 gap-6">
          <Field label="Name">
            <input
              className={inputClass}
              value={data.name}
              onChange={(e) => set('name', e.target.value)}
            />
          </Field>
          <Field label="Age">
            <input
              type="number"
              className={inputClass}
              value={data.age}
              onChange={(e) => set('age', Number(e.target.value))}
            />
          </Field>
          <Field label="Email">
            <input
              className={inputClass}
              value={data.email}
              onChange={(e) => set('email', e.target.value)}
            />
          </Field>
          <Field label="Phone">
            <input
              className={inputClass}
              value={data.phone}
              onChange={(e) => set('phone', e.target.value)}
            />
          </Field>
        </div>
        <div className="mt-6">
          <Field label="Bio">
            <textarea
              className={textareaClass}
              value={data.bio}
              onChange={(e) => set('bio', e.target.value)}
            />
          </Field>
        </div>
      </Section>

      <Section title="Hero section">
        <div className="space-y-6">
          <Field label="Hero tagline">
            <input
              className={inputClass}
              value={data.heroTagline}
              onChange={(e) => set('heroTagline', e.target.value)}
            />
          </Field>
          <Field label="Hero description">
            <textarea
              className={textareaClass}
              value={data.heroDescription}
              onChange={(e) => set('heroDescription', e.target.value)}
            />
          </Field>
        </div>
      </Section>

      <Section title="About section">
        <div className="space-y-6">
          <Field label="About heading">
            <input
              className={inputClass}
              value={data.aboutHeading}
              onChange={(e) => set('aboutHeading', e.target.value)}
            />
          </Field>
          <Field label="About body">
            <textarea
              className={textareaClass}
              value={data.aboutBody}
              onChange={(e) => set('aboutBody', e.target.value)}
            />
          </Field>
        </div>
      </Section>

      <Section title="Section titles">
        <div className="grid sm:grid-cols-3 gap-6">
          <Field label="Videos section title">
            <input
              className={inputClass}
              value={data.videosSectionTitle}
              onChange={(e) => set('videosSectionTitle', e.target.value)}
            />
          </Field>
          <Field label="Projects section title">
            <input
              className={inputClass}
              value={data.projectsSectionTitle}
              onChange={(e) => set('projectsSectionTitle', e.target.value)}
            />
          </Field>
          <Field label="Skills section title">
            <input
              className={inputClass}
              value={data.skillsSectionTitle}
              onChange={(e) => set('skillsSectionTitle', e.target.value)}
            />
          </Field>
        </div>
      </Section>

      <div className="flex justify-end">
        <SaveButton status={status} onClick={save} />
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-bone/10 bg-ink-900/40 p-6">
      <h2 className="font-display italic text-lg text-bone mb-5">{title}</h2>
      {children}
    </div>
  );
}

function SaveButton({
  status,
  onClick,
}: {
  status: 'idle' | 'saving' | 'saved' | 'error';
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={status === 'saving'}
      className="rounded-full bg-bronze text-ink-950 font-medium px-6 py-2.5 text-sm hover:bg-bronze-light transition-colors disabled:opacity-60"
    >
      {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved ✓' : status === 'error' ? 'Error — retry' : 'Save changes'}
    </button>
  );
}
