'use client';

interface AdminReorderButtonsProps {
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  label?: string;
}

export default function AdminReorderButtons({
  index,
  total,
  onMoveUp,
  onMoveDown,
  label = 'item',
}: AdminReorderButtonsProps) {
  if (total < 2) return null;

  return (
    <div className="flex flex-wrap items-center gap-1">
      <button
        type="button"
        className="admin-btn-ghost px-2 py-1 text-xs"
        disabled={index === 0}
        onClick={onMoveUp}
        aria-label={`Move ${label} up`}
        title="Move up"
      >
        ↑ Up
      </button>
      <button
        type="button"
        className="admin-btn-ghost px-2 py-1 text-xs"
        disabled={index >= total - 1}
        onClick={onMoveDown}
        aria-label={`Move ${label} down`}
        title="Move down"
      >
        ↓ Down
      </button>
    </div>
  );
}
