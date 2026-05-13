'use client';

import { FormEvent, useState } from 'react';
import styles from './RegistrationStyles.module.css';

const STEPS = ['Personal Information', 'Church Details', 'Travel & lodging', 'Review & submit'] as const;

export default function RegistrationClient() {
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
  });

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
          <h1 className={styles.asideTitle}>Registration</h1>
          <div className={styles.asideRule} aria-hidden />
          <p className={styles.asideLead}>
            Reserve your place for Feast of Esther North America. Complete each step — your details help us plan
            hospitality, seating, and follow-up.
          </p>
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
              <h2 className={styles.successTitle}>You&apos;re registered</h2>
              <p className={styles.successText}>
                Thank you, {form.firstName}. We&apos;ve saved your registration and will be in touch with event updates
                and next steps.
              </p>
            </div>
          ) : (
            <form onSubmit={handleNext}>
              <h2 className={styles.stepHeading}>{STEPS[step]}</h2>
              <p className={styles.stepSub}>
                {step === 0
                  ? 'Tell us who you are so we can stay in touch.'
                  : step === 1
                    ? 'Help us understand your home church and region.'
                    : step === 2
                      ? 'Optional — share travel or accessibility needs.'
                      : 'Review your details before submitting.'}
              </p>

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
