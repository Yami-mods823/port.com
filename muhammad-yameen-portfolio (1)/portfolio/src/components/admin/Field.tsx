export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm text-bone-dim mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-xs text-bone-faint mt-1">{hint}</span>}
    </label>
  );
}

export const inputClass =
  'w-full rounded-lg bg-ink-800 border border-bone/10 px-3.5 py-2.5 text-sm text-bone placeholder:text-bone-faint focus:outline-none focus:border-bronze/60 transition-colors';

export const textareaClass = inputClass + ' resize-y min-h-[100px]';
