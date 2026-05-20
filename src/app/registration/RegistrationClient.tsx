'use client';

import { FormEvent, useState } from 'react';
import type { RegistrationPageContent } from '@/lib/cms-types';
import { fillTemplate } from '@/lib/fill-template';
import styles from './RegistrationStyles.module.css';

const STEPS = ['Personal Information', 'Church Details', 'Travel & lodging', 'Review & submit'] as const;

export interface RegistrationClientProps {
  page: RegistrationPageContent;
}

export default function RegistrationClient({ page }: RegistrationClientProps) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    church: '',
    city: '',
    country: '',
    notes: '',
    website: '',
  });

  const asideTitle = page.asideTitle ?? 'Registration';
  const asideLead =
    page.asideLead ??
    'Reserve your place for Feast of Esther North America. Complete each step — your details help us plan hospitality, seating, and follow-up.';
  const successTitle = page.successTitle ?? "You're registered";
  const successBodyTpl =
    page.successBody ??
    "Thank you, {{firstName}}. We've saved your registration and will be in touch with event updates and next steps.";
  const stepHints: [string, string, string, string] = [
    page.step0Hint ?? 'Tell us who you are so we can stay in touch.',
    page.step1Hint ?? 'Help us understand your home church and region.',
    page.step2Hint ?? 'Optional — share travel or accessibility needs.',
    page.step3Hint ?? 'Review your details before submitting.',
  ];

  async function submitRegistration() {
    const fullName = `${form.firstName} ${form.lastName}`.trim();
    if (!fullName || !form.email) {
      setError('Please complete your name and email.');
      setStep(0);
      return;
    }
    setLoading(true);
    setError('');
    const response = await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName,
        email: form.email,
        phone: form.phone,
        church: form.church,
        city: form.city,
        country: form.country,
        notes: form.notes,
        website: form.website,
      }),
    });
    setLoading(false);
    if (!response.ok) {
      setError('Could not submit registration. Please try again.');
      return;
    }
    setDone(true);
  }

  function handleNext(e: FormEvent) {
    e.preventDefault();
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    void submitRegistration();
  }

  function handleBack() {
    setStep((s) => Math.max(0, s - 1));
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <aside className={styles.aside}>
          <h1 className={styles.asideTitle}>{asideTitle}</h1>
          <div className={styles.asideRule} aria-hidden />
          <p className={styles.asideLead}>{asideLead}</p>
          <ul className={styles.stepList}>
            {STEPS.map((label, i) => (
              <li
                key={label}
                className={`${styles.stepItem} ${i === step ? styles.stepItemActive : ''}`}
              >
                <span className={`${styles.stepNum} ${i === step ? styles.stepNumActive : ''}`}>{i + 1}</span>
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </aside>

        <div className={styles.main}>
          {done ? (
            <div className={styles.successPanel}>
              <h2 className={styles.successTitle}>{successTitle}</h2>
              <p className={styles.successText}>
                {fillTemplate(successBodyTpl, { firstName: form.firstName || 'friend' })}
              </p>
            </div>
          ) : (
            <form onSubmit={handleNext}>
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="sr-only"
                style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
              />
              <h2 className={styles.stepHeading}>{STEPS[step]}</h2>
              <p className={styles.stepSub}>{stepHints[step]}</p>

              {step === 0 ? (
                <div className={`${styles.fieldGrid} ${styles.fieldGrid2}`}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="reg-first">
                      First name
                    </label>
                    <input
                      id="reg-first"
                      required
                      className={styles.input}
                      value={form.firstName}
                      onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="reg-last">
                      Last name
                    </label>
                    <input
                      id="reg-last"
                      required
                      className={styles.input}
                      value={form.lastName}
                      onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="reg-email">
                      Email
                    </label>
                    <input
                      id="reg-email"
                      required
                      type="email"
                      className={styles.input}
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="reg-phone">
                      Phone
                    </label>
                    <input
                      id="reg-phone"
                      className={styles.input}
                      value={form.phone}
                      onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    />
                  </div>
                </div>
              ) : null}

              {step === 1 ? (
                <div className={styles.fieldGrid}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="reg-church">
                      Church / ministry
                    </label>
                    <input
                      id="reg-church"
                      className={styles.input}
                      value={form.church}
                      onChange={(e) => setForm((p) => ({ ...p, church: e.target.value }))}
                    />
                  </div>
                  <div className={`${styles.fieldGrid} ${styles.fieldGrid2}`}>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="reg-city">
                        City
                      </label>
                      <input
                        id="reg-city"
                        className={styles.input}
                        value={form.city}
                        onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="reg-country">
                        Country
                      </label>
                      <input
                        id="reg-country"
                        className={styles.input}
                        value={form.country}
                        onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {step === 2 ? (
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="reg-notes">
                    Travel & lodging notes (optional)
                  </label>
                  <textarea
                    id="reg-notes"
                    className={styles.textarea}
                    rows={5}
                    placeholder="Arrival date, roommates, accessibility needs…"
                    value={form.notes}
                    onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                  />
                </div>
              ) : null}

              {step === 3 ? (
                <div className={styles.review}>
                  <p className={styles.reviewRow}>
                    <strong>Name</strong> — {form.firstName} {form.lastName}
                  </p>
                  <p className={styles.reviewRow}>
                    <strong>Email</strong> — {form.email}
                  </p>
                  <p className={styles.reviewRow}>
                    <strong>Phone</strong> — {form.phone || '—'}
                  </p>
                  <p className={styles.reviewRow}>
                    <strong>Church</strong> — {form.church || '—'}
                  </p>
                  <p className={styles.reviewRow}>
                    <strong>Location</strong> — {form.city || '—'}
                    {form.country ? `, ${form.country}` : ''}
                  </p>
                  {form.notes ? (
                    <p className={styles.reviewRow}>
                      <strong>Notes</strong> — {form.notes}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {error ? <p className={`${styles.msg} ${styles.msgError}`}>{error}</p> : null}

              <div className={styles.actions}>
                {step > 0 ? (
                  <button type="button" className={styles.btnBack} onClick={handleBack}>
                    Back
                  </button>
                ) : null}
                <button type="submit" className={styles.btnNext} disabled={loading}>
                  {loading ? 'Submitting…' : step === STEPS.length - 1 ? 'Submit registration' : 'Continue'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
