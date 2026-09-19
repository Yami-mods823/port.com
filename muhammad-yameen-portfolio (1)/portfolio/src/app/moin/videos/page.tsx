'use client';

import { useEffect, useState } from 'react';
import { Field, inputClass, textareaClass } from '@/components/admin/Field';
import UploadField from '@/components/admin/UploadField';
import { VideoDTO } from '@/types';

const EMPTY_FORM = {
  title: '',
  description: '',
  category: 'Claymation',
  aiTools: '',
  date: new Date().toISOString().slice(0, 10),
  videoUrl: '',
  thumbnailUrl: '',
};

export default function VideosAdminPage() {
  const [videos, setVideos] = useState<VideoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch('/api/videos?admin=1');
    const data = await res.json();
    setVideos(data.videos);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const startEdit = (v: VideoDTO) => {
    setEditingId(v.id);
    setForm({
      title: v.title,
      description: v.description,
      category: v.category,
      aiTools: v.aiTools.join(', '),
      date: v.date.slice(0, 10),
      videoUrl: v.videoUrl,
      thumbnailUrl: v.thumbnailUrl || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async () => {
    if (!form.title || !form.videoUrl) {
      alert('Title and an uploaded video are required.');
      return;
    }
    setCreating(true);
    const payload = {
      title: form.title,
      description: form.description,
      category: form.category,
      aiTools: form.aiTools
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      date: form.date,
      videoUrl: form.videoUrl,
      thumbnailUrl: form.thumbnailUrl || null,
    };

    try {
      if (editingId) {
        await fetch(`/api/videos/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      resetForm();
      await load();
    } finally {
      setCreating(false);
    }
  };

  const togglePublish = async (v: VideoDTO) => {
    await fetch(`/api/videos/${v.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !v.published }),
    });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this video permanently?')) return;
    await fetch(`/api/videos/${id}`, { method: 'DELETE' });
    load();
  };

  const move = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= videos.length) return;
    const a = videos[index];
    const b = videos[target];
    await Promise.all([
      fetch(`/api/videos/${a.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: b.order }),
      }),
      fetch(`/api/videos/${b.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: a.order }),
      }),
    ]);
    load();
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display italic text-3xl text-bone">AI Videos</h1>
        <p className="text-sm text-bone-faint mt-1">
          Upload and manage every video in your Claymation / AI video gallery. Supports MP4, WebM
          and MOV — no duration limit.
        </p>
      </div>

      <div className="rounded-2xl border border-bone/10 bg-ink-900/40 p-6">
        <h2 className="font-display italic text-lg text-bone mb-5">
          {editingId ? 'Edit video' : 'Upload a new video'}
        </h2>

        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          <UploadField
            label="Video file"
            kind="video"
            value={form.videoUrl}
            onChange={(url) => setForm((f) => ({ ...f, videoUrl: url }))}
          />
          <UploadField
            label="Thumbnail image"
            kind="image"
            value={form.thumbnailUrl}
            onChange={(url) => setForm((f) => ({ ...f, thumbnailUrl: url }))}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <Field label="Title">
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </Field>
          <Field label="Category">
            <input
              className={inputClass}
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            />
          </Field>
          <Field label="Date">
            <input
              type="date"
              className={inputClass}
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
          </Field>
          <Field label="AI tools used" hint="Comma separated, e.g. Runway, Midjourney, ElevenLabs">
            <input
              className={inputClass}
              value={form.aiTools}
              onChange={(e) => setForm((f) => ({ ...f, aiTools: e.target.value }))}
            />
          </Field>
        </div>

        <div className="mt-6">
          <Field label="Description">
            <textarea
              className={textareaClass}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </Field>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={submit}
            disabled={creating}
            className="rounded-full bg-bronze text-ink-950 font-medium px-6 py-2.5 text-sm hover:bg-bronze-light transition-colors disabled:opacity-60"
          >
            {creating ? 'Saving…' : editingId ? 'Update video' : 'Publish video'}
          </button>
          {editingId && (
            <button
              onClick={resetForm}
              className="text-sm text-bone-faint hover:text-bone transition-colors"
            >
              Cancel edit
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="font-display italic text-lg text-bone">
          All videos {!loading && `(${videos.length})`}
        </h2>
        {loading ? (
          <p className="text-bone-dim text-sm">Loading…</p>
        ) : videos.length === 0 ? (
          <p className="text-bone-faint text-sm">No videos uploaded yet.</p>
        ) : (
          videos.map((v, i) => (
            <div
              key={v.id}
              className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-bone/10 bg-ink-900/30 p-4"
            >
              <div className="h-16 w-24 shrink-0 rounded-lg bg-ink-800 overflow-hidden">
                {v.thumbnailUrl && (
                  <img src={v.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-bone font-medium truncate">{v.title}</p>
                <p className="text-xs text-bone-faint truncate">
                  {v.category} · {v.published ? 'Published' : 'Unpublished'}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="h-8 w-8 rounded-lg border border-bone/10 text-bone-dim hover:text-bone disabled:opacity-30 text-sm"
                >
                  ↑
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === videos.length - 1}
                  className="h-8 w-8 rounded-lg border border-bone/10 text-bone-dim hover:text-bone disabled:opacity-30 text-sm"
                >
                  ↓
                </button>
                <button
                  onClick={() => togglePublish(v)}
                  className="rounded-lg border border-bone/10 px-3 py-1.5 text-xs text-bone-dim hover:text-bone transition-colors"
                >
                  {v.published ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => startEdit(v)}
                  className="rounded-lg border border-bone/10 px-3 py-1.5 text-xs text-bone-dim hover:text-bone transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(v.id)}
                  className="rounded-lg border border-red-500/20 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
