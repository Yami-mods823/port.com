'use client';

import { useEffect, useState } from 'react';
import { Field, inputClass } from '@/components/admin/Field';
import UploadField from '@/components/admin/UploadField';
import { SkillDTO } from '@/types';

const EMPTY_FORM = { name: '', percentage: 75, logoUrl: '' };

export default function SkillsAdminPage() {
  const [skills, setSkills] = useState<SkillDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch('/api/skills?admin=1');
    const data = await res.json();
    setSkills(data.skills);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const startEdit = (s: SkillDTO) => {
    setEditingId(s.id);
    setForm({ name: s.name, percentage: s.percentage, logoUrl: s.logoUrl || '' });
  };

  const submit = async () => {
    if (!form.name) {
      alert('Skill name is required.');
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name,
      percentage: Math.max(0, Math.min(100, Number(form.percentage))),
      logoUrl: form.logoUrl || null,
    };

    try {
      if (editingId) {
        await fetch(`/api/skills/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/skills', {
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

  const togglePublish = async (s: SkillDTO) => {
    await fetch(`/api/skills/${s.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !s.published }),
    });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this skill?')) return;
    await fetch(`/api/skills/${id}`, { method: 'DELETE' });
    load();
  };

  const move = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= skills.length) return;
    const a = skills[index];
    const b = skills[target];
    await Promise.all([
      fetch(`/api/skills/${a.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: b.order }),
      }),
      fetch(`/api/skills/${b.id}`, {
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
        <h1 className="font-display italic text-3xl text-bone">Skills</h1>
        <p className="text-sm text-bone-faint mt-1">
          Manage the technologies shown in your skills section.
        </p>
      </div>

      <div className="rounded-2xl border border-bone/10 bg-ink-900/40 p-6">
        <h2 className="font-display italic text-lg text-bone mb-5">
          {editingId ? 'Edit skill' : 'Add a new skill'}
        </h2>

        <div className="mb-6 max-w-xs">
          <UploadField
            label="Technology logo"
            kind="image"
            value={form.logoUrl}
            onChange={(url) => setForm((f) => ({ ...f, logoUrl: url }))}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <Field label="Skill name">
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </Field>
          <Field label={`Percentage — ${form.percentage}%`}>
            <input
              type="range"
              min={0}
              max={100}
              value={form.percentage}
              onChange={(e) => setForm((f) => ({ ...f, percentage: Number(e.target.value) }))}
              className="w-full accent-bronze"
            />
          </Field>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={submit}
            disabled={saving}
            className="rounded-full bg-bronze text-ink-950 font-medium px-6 py-2.5 text-sm hover:bg-bronze-light transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving…' : editingId ? 'Update skill' : 'Add skill'}
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
          All skills {!loading && `(${skills.length})`}
        </h2>
        {loading ? (
          <p className="text-bone-dim text-sm">Loading…</p>
        ) : (
          skills.map((s, i) => (
            <div
              key={s.id}
              className="flex items-center gap-4 rounded-xl border border-bone/10 bg-ink-900/30 p-4"
            >
              <div className="h-10 w-10 shrink-0 rounded-lg bg-ink-800 overflow-hidden flex items-center justify-center">
                {s.logoUrl ? (
                  <img src={s.logoUrl} alt="" className="h-full w-full object-contain p-1.5" />
                ) : (
                  <span className="text-xs text-bone-faint">{s.name.charAt(0)}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-bone font-medium truncate">{s.name}</p>
                <p className="text-xs text-bone-faint">
                  {s.percentage}% · {s.published ? 'Published' : 'Unpublished'}
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
                  disabled={i === skills.length - 1}
                  className="h-8 w-8 rounded-lg border border-bone/10 text-bone-dim hover:text-bone disabled:opacity-30 text-sm"
                >
                  ↓
                </button>
                <button
                  onClick={() => togglePublish(s)}
                  className="rounded-lg border border-bone/10 px-3 py-1.5 text-xs text-bone-dim hover:text-bone transition-colors"
                >
                  {s.published ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => startEdit(s)}
                  className="rounded-lg border border-bone/10 px-3 py-1.5 text-xs text-bone-dim hover:text-bone transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(s.id)}
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
