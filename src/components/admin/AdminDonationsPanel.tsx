'use client';

import { useCallback, useEffect, useState } from 'react';
import type { DonationIntent } from '@/lib/cms-types';

const ACTION_LABEL: Record<DonationIntent['action'], string> = {
  method_select: 'Chose payment method',
  give_click: 'Clicked Give',
  paypal_link: 'Opened PayPal',
};

export default function AdminDonationsPanel() {
  const [intents, setIntents] = useState<DonationIntent[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/donations');
    if (res.ok) {
      const data = await res.json();
      setIntents(data.intents ?? []);
      setTotal(data.total ?? 0);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="admin-card space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2>Donation activity</h2>
          <p className="text-sm text-black/55">
            Visitors who chose Zeffy or PayPal, clicked Give, or opened PayPal from the donate page.
          </p>
        </div>
        <button type="button" className="admin-btn-ghost" onClick={() => void load()}>
          Refresh
        </button>
      </div>
      <p className="text-sm font-medium text-[var(--primary-dark)]">{total} recorded interaction{total === 1 ? '' : 's'}</p>
      {loading ? (
        <p className="text-sm text-black/50">Loading…</p>
      ) : intents.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[rgba(194,24,91,0.2)] bg-white/50 p-6 text-sm text-black/50">
          No clicks yet. Activity appears here after someone uses the donate page.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[rgba(194,24,91,0.12)]">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr>
                <th className="admin-field-label px-3 py-2">When</th>
                <th className="admin-field-label px-3 py-2">Action</th>
                <th className="admin-field-label px-3 py-2">Method</th>
                <th className="admin-field-label px-3 py-2">Amount</th>
                <th className="admin-field-label px-3 py-2">Contact</th>
              </tr>
            </thead>
            <tbody>
              {intents.map((row) => (
                <tr key={row.id} className="border-t border-[rgba(194,24,91,0.08)] bg-white/60">
                  <td className="px-3 py-2 whitespace-nowrap text-xs">
                    {new Date(row.createdAt).toLocaleString()}
                  </td>
                  <td className="px-3 py-2">{ACTION_LABEL[row.action]}</td>
                  <td className="px-3 py-2 capitalize">{row.method}</td>
                  <td className="px-3 py-2">${row.amount.toFixed(2)}</td>
                  <td className="px-3 py-2 text-xs">
                    {[row.firstName, row.lastName].filter(Boolean).join(' ') || '—'}
                    {row.email ? (
                      <>
                        <br />
                        {row.email}
                      </>
                    ) : null}
                    {row.phone ? (
                      <>
                        <br />
                        {row.phone}
                      </>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
