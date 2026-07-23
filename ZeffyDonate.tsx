'use client';

interface ZeffyEmbedProps {
  embedUrl: string; // https://www.zeffy.com/en-US/donation-form/donations-255
}

export default function ZeffyEmbed({ embedUrl }: ZeffyEmbedProps) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-100 shadow-sm bg-white">
      <iframe
        src={embedUrl}
        className="w-full min-h-[700px] border-0"
        title="Donate via Zeffy"
        allow="payment" // Required for credit card / Apple Pay security
        loading="lazy"
      />
    </div>
  );
}