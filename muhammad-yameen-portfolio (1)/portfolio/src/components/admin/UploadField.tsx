'use client';

import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export default function UploadField({
  label,
  kind,
  value,
  onChange,
  accept,
}: {
  label: string;
  kind: 'image' | 'video';
  value: string | null | undefined;
  onChange: (url: string) => void;
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('kind', kind);

      const xhr = new XMLHttpRequest();
      const url: string = await new Promise((resolve, reject) => {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
          try {
            const data = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300 && data.url) resolve(data.url);
            else reject(new Error(data.error || 'Upload failed.'));
          } catch {
            reject(new Error('Upload failed.'));
          }
        };
        xhr.onerror = () => reject(new Error('Network error during upload.'));
        xhr.open('POST', '/api/upload');
        xhr.send(formData);
      });

      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setProgress(null);
    }
  };

  return (
    <div>
      <span className="block text-sm text-bone-dim mb-1.5">{label}</span>

      <div className="flex items-center gap-4">
        {value && kind === 'image' && (
          <img src={value} alt="" className="h-16 w-16 rounded-lg object-cover border border-bone/10" />
        )}
        {value && kind === 'video' && (
          <video src={value} className="h-16 w-24 rounded-lg object-cover border border-bone/10" muted />
        )}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            'rounded-lg border border-bone/15 px-4 py-2 text-sm text-bone-dim hover:text-bone hover:border-bronze/50 transition-colors'
          )}
        >
          {value ? 'Replace' : 'Upload'} {kind}
        </button>

        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-xs text-bone-faint hover:text-red-400 transition-colors"
          >
            Remove
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept || (kind === 'video' ? 'video/mp4,video/webm,video/quicktime' : 'image/*')}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />

      {progress !== null && (
        <div className="mt-2 h-1.5 w-full max-w-xs rounded-full bg-ink-800 overflow-hidden">
          <div
            className="h-full bg-bronze transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
