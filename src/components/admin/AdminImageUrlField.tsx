'use client';

import { AdminImagePreview } from './AdminImagePreview';

interface AdminImageUrlFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputClassName?: string;
  previewLabel?: string;
}

export default function AdminImageUrlField({
  value,
  onChange,
  placeholder = 'https://res.cloudinary.com/...',
  inputClassName = 'admin-input mb-2',
  previewLabel = 'Preview',
}: AdminImageUrlFieldProps) {
  return (
    <>
      <input
        className={inputClassName}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <AdminImagePreview url={value} label={previewLabel} />
    </>
  );
}
