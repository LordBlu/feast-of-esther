'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      setError('That password does not match our records. Try again, beloved.');
      setLoading(false);
      return;
    }

    router.push('/admin');
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <form onSubmit={handleSubmit} className="admin-login-card">
        <p className="eyebrow mb-3 text-center" style={{ color: 'var(--primary)' }}>
          Private studio access
        </p>
        <h1
          className="mb-2 text-center text-3xl sm:text-4xl"
          style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--primary-dark)' }}
        >
          Feast of Esther
        </h1>
        <p className="mb-8 text-center text-sm text-black/55">
          Enter the admin passphrase to shape the digital experience for every guest.
        </p>

        <label htmlFor="admin-pass" className="admin-field-label">
          Passphrase
        </label>
        <input
          id="admin-pass"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="admin-input mb-2"
          required
        />

        {error ? <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

        <button
          type="submit"
          className="btn-primary mt-2 w-full rounded-full py-3 text-[0.72rem]"
          disabled={loading}
        >
          {loading ? 'Opening the studio…' : 'Step inside'}
        </button>
      </form>
    </div>
  );
}
