'use client';

export type AdminSaveNoticeVariant = 'success' | 'error';

interface AdminSaveNoticeProps {
  message: string;
  variant: AdminSaveNoticeVariant;
  onDismiss?: () => void;
}

export default function AdminSaveNotice({ message, variant, onDismiss }: AdminSaveNoticeProps) {
  return (
    <div
      className={`admin-save-notice admin-save-notice--${variant}`}
      role="status"
      aria-live="polite"
    >
      <span className="admin-save-notice__icon" aria-hidden>
        {variant === 'success' ? '✓' : '!'}
      </span>
      <span className="admin-save-notice__text">{message}</span>
      {onDismiss ? (
        <button type="button" className="admin-save-notice__dismiss" onClick={onDismiss} aria-label="Dismiss">
          ×
        </button>
      ) : null}
    </div>
  );
}
