'use client';

import { useEffect, useState } from 'react';
import { Field, inputClass, textareaClass } from '@/components/admin/Field';
import UploadField from '@/components/admin/UploadField';
import { ProjectDTO } from '@/types';

const EMPTY_FORM = {
  title: '',
  description: '',
  technologies: '',
  imageUrl: '',
  liveUrl: '',
  githubUrl: '',
};

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<ProjectDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch('/api/projects?admin=1');
    const data = await res.json();
    setProjects(data.projects);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const startEdit = (p: ProjectDTO) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      description: p.description,
      technologies: p.technologies.join(', '),
      imageUrl: p.imageUrl || '',
      liveUrl: p.liveUrl || '',
      githubUrl: p.githubUrl || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async () => {
    if (!form.title) {
      alert('Title is required.');
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title,
      description: form.description,
      technologies: form.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      imageUrl: form.imageUrl || null,
      liveUrl: form.liveUrl || null,
      githubUrl: form.githubUrl || null,
    };

    try {
      if (editingId) {
        await fetch(`/api/projects/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      resetForm();
      await load();
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (p: ProjectDTO) => {
    await fetch(`/api/projects/${p.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !p.published }),
    });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this project permanently?')) return;
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    load();
  };

  const move = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= projects.length) return;
    const a = projects[index];
    const b = projects[target];
    await Promise.all([
      fetch(`/api/projects/${a.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: b.order }),
      }),
      fetch(`/api/projects/${b.id}`, {
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
        <h1 className="font-display italic text-3xl text-bone">Projects</h1>
        <p className="text-sm text-bone-faint mt-1">Manage your software development portfolio.</p>
      </div>

      <div className="rounded-2xl border border-bone/10 bg-ink-900/40 p-6">
        <h2 className="font-display italic text-lg text-bone mb-5">
          {editingId ? 'Edit project' : 'Add a new project'}
        </h2>

        <div className="mb-6">
          <UploadField
            label="Project image"
            kind="image"
            value={form.imageUrl}
            onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
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
          <Field label="Technologies" hint="Comma separated, e.g. Next.js, Prisma, Tailwind">
            <input
              className={inputClass}
              value={form.technologies}
              onChange={(e) => setForm((f) => ({ ...f, technologies: e.target.value }))}
            />
          </Field>
          <Field label="Live Demo URL">
            <input
              className={inputClass}
              value={form.liveUrl}
              onChange={(e) => setForm((f) => ({ ...f, liveUrl: e.target.value }))}
            />
          </Field>
          <Field label="GitHub URL">
            <input
              className={inputClass}
              value={form.githubUrl}
              onChange={(e) => setForm((f) => ({ ...f, githubUrl: e.target.value }))}
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
            disabled={saving}
            className="rounded-full bg-bronze text-ink-950 font-medium px-6 py-2.5 text-sm hover:bg-bronze-light transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving…' : editingId ? 'Update project' : 'Add project'}
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
          All projects {!loading && `(${projects.length})`}
        </h2>
        {loading ? (
          <p className="text-bone-dim text-sm">Loading…</p>
        ) : projects.length === 0 ? (
          <p className="text-bone-faint text-sm">No projects added yet.</p>
        ) : (
          projects.map((p, i) => (
            <div
              key={p.id}
              className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-bone/10 bg-ink-900/30 p-4"
            >
              <div className="h-16 w-24 shrink-0 rounded-lg bg-ink-800 overflow-hidden">
                {p.imageUrl && <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-bone font-medium truncate">{p.title}</p>
                <p className="text-xs text-bone-faint truncate">
                  {p.published ? 'Published' : 'Unpublished'}
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
                  disabled={i === projects.length - 1}
                  className="h-8 w-8 rounded-lg border border-bone/10 text-bone-dim hover:text-bone disabled:opacity-30 text-sm"
                >
                  ↓
                </button>
                <button
                  onClick={() => togglePublish(p)}
                  className="rounded-lg border border-bone/10 px-3 py-1.5 text-xs text-bone-dim hover:text-bone transition-colors"
                >
                  {p.published ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => startEdit(p)}
                  className="rounded-lg border border-bone/10 px-3 py-1.5 text-xs text-bone-dim hover:text-bone transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(p.id)}
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
