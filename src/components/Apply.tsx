import { useEffect, useRef, useState, type FormEvent } from 'react';
import { site } from '../content/site';
import { scrollToTarget } from '../lib/scroll';
import { ArrowUpRight, Check, Copy, Loader, WhatsApp } from './Icons';
import { SectionMeta } from './SectionMeta';
import './Apply.css';

type FieldKey =
  | 'name'
  | 'email'
  | 'instagram'
  | 'age'
  | 'gender'
  | 'weight'
  | 'height'
  | 'goal'
  | 'experience'
  | 'frequency'
  | 'message';

type Values = Record<FieldKey, string>;
type Errors = Partial<Record<FieldKey, string>>;
type Status = 'idle' | 'submitting' | 'ready' | 'sent' | 'error';

const initialValues: Values = {
  name: '',
  email: '',
  instagram: '',
  age: '',
  gender: 'Prefer not to say',
  weight: '',
  height: '',
  goal: '',
  experience: '',
  frequency: '',
  message: '',
};

const endpoint = import.meta.env.VITE_COACHING_ENDPOINT as string | undefined;
const contactEmail = import.meta.env.VITE_CONTACT_EMAIL as string | undefined;

function validateField(field: FieldKey, values: Values): string | undefined {
  const value = values[field].trim();

  switch (field) {
    case 'name':
      if (value.length < 2) return 'Enter your full name.';
      return;
    case 'email':
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return 'Enter a valid email address.';
      return;
    case 'instagram':
      if (value && !/^@?[A-Za-z0-9._]{1,30}$/.test(value)) return 'Use a valid Instagram username.';
      return;
    case 'age': {
      const age = Number(value);
      if (!value || !Number.isFinite(age) || age < 16 || age > 80)
        return 'Enter an age between 16 and 80.';
      return;
    }
    case 'weight': {
      const weight = Number(value);
      if (!value || !Number.isFinite(weight) || weight < 30 || weight > 250)
        return 'Enter a weight between 30 and 250 kg.';
      return;
    }
    case 'height': {
      const height = Number(value);
      if (!value || !Number.isFinite(height) || height < 120 || height > 230)
        return 'Enter a height between 120 and 230 cm.';
      return;
    }
    case 'goal':
      if (!value) return 'Choose your main goal.';
      return;
    case 'experience':
      if (!value) return 'Choose your training experience.';
      return;
    case 'frequency':
      if (!value) return 'Choose your training frequency.';
      return;
    case 'message':
      if (value.length > 1000) return 'Please keep this under 1,000 characters.';
      return;
    default:
      return;
  }
}

function validateAll(values: Values): Errors {
  const errors: Errors = {};
  (Object.keys(values) as FieldKey[]).forEach((field) => {
    const error = validateField(field, values);
    if (error) errors[field] = error;
  });
  return errors;
}

function buildMessage(values: Values) {
  const lines = [
    'COACHING APPLICATION — ANAS_TIME',
    '',
    `Name: ${values.name.trim()}`,
    `Email: ${values.email.trim()}`,
    `Instagram: ${values.instagram.trim() || '—'}`,
    `Age: ${values.age.trim()}`,
    `Gender: ${values.gender === 'Prefer not to say' ? '—' : values.gender}`,
    `Weight: ${values.weight.trim()} kg`,
    `Height: ${values.height.trim()} cm`,
    `Goal: ${values.goal}`,
    `Training experience: ${values.experience}`,
    `Training frequency: ${values.frequency}`,
    '',
    'Additional information:',
    values.message.trim() || '—',
  ];

  return lines.join('\n');
}

export function Apply() {
  const { apply } = site;
  const [values, setValues] = useState<Values>(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const message = buildMessage(values);

  useEffect(() => {
    if (status === 'ready' || status === 'sent') {
      const result = resultRef.current;
      if (!result) return;
      result.focus({ preventScroll: true });
      window.requestAnimationFrame(() => scrollToTarget(result, -96));
    }

    if (status === 'error') {
      const alert = errorRef.current;
      if (!alert) return;
      alert.focus({ preventScroll: true });
      window.requestAnimationFrame(() => scrollToTarget(alert, -96));
    }
  }, [status]);

  useEffect(() => {
    if (copyState === 'idle') return;
    const timeout = window.setTimeout(() => setCopyState('idle'), 3000);
    return () => window.clearTimeout(timeout);
  }, [copyState]);

  const update = (field: FieldKey, value: string) => {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);

    if (errors[field]) {
      const error = validateField(field, nextValues);
      setErrors((currentErrors) => {
        const nextErrors = { ...currentErrors };
        if (error) nextErrors[field] = error;
        else delete nextErrors[field];
        return nextErrors;
      });
    }
  };

  const validateOnBlur = (field: FieldKey) => {
    const error = validateField(field, values);
    setErrors((current) => {
      const next = { ...current };
      if (error) next[field] = error;
      else delete next[field];
      return next;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateAll(values);
    setErrors(nextErrors);

    const firstError = (Object.keys(nextErrors) as FieldKey[])[0];
    if (firstError) {
      const field = formRef.current?.querySelector<HTMLElement>(`[name="${firstError}"]`);
      field?.focus();
      return;
    }

    setCopyState('idle');

    if (!endpoint) {
      setStatus('ready');
      return;
    }

    setStatus('submitting');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          message: values.message.trim(),
          source: 'anas-time-website',
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error(`Application request failed: ${response.status}`);
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  const copyApplication = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopyState('copied');
    } catch {
      setCopyState('error');
    }
  };

  const reset = () => {
    setStatus('idle');
    setCopyState('idle');
    window.requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('input')?.focus());
  };

  const whatsappHref = `${site.brand.whatsapp}?text=${encodeURIComponent(message)}`;
  const emailHref = contactEmail
    ? `mailto:${contactEmail}?subject=${encodeURIComponent(
        'Coaching application — ANAS_TIME',
      )}&body=${encodeURIComponent(message)}`
    : null;

  return (
    <section id="apply" className="apply section" aria-labelledby="apply-title">
      <div className="apply__glow" aria-hidden="true" />
      <div className="container">
        <SectionMeta section={apply.section} time={apply.time} />

        <div className="apply__grid">
          <div className="apply__intro">
            <h2 id="apply-title" className="h2 apply__title" data-reveal>
              {apply.title.map((line) => (
                <span className="apply__title-line" key={line}>
                  {line}
                </span>
              ))}
            </h2>

            <p className="apply__lead" data-reveal>
              {apply.intro}
            </p>
            <p className="apply__copy" data-reveal>
              {apply.copy}
            </p>

            <ol className="apply__steps" data-reveal>
              {apply.steps.map((step, index) => (
                <li key={step}>
                  <span className="apply__step-num">0{index + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>

            <div className="apply__whatsapp" data-reveal>
              <span className="apply__whatsapp-label">{apply.whatsappLead}</span>
              <a
                className="btn btn--ghost"
                href={site.brand.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsApp />
                {apply.whatsappCta}
              </a>
              <span className="apply__whatsapp-number">{site.brand.whatsappDisplay}</span>
            </div>

            <p className="apply__note" data-reveal>
              {apply.note}
            </p>
          </div>

          <div className="apply__panel" data-reveal>
            {status === 'ready' && (
              <div
                ref={resultRef}
                className="apply__result"
                role="status"
                tabIndex={-1}
                aria-live="polite"
              >
                <p className="label">
                  <span className="label__dot" aria-hidden="true" />
                  {apply.readyTitle}
                </p>
                <h3 className="apply__result-title">One last step.</h3>
                <p className="apply__result-copy">{apply.readyNote}</p>

                <div className="apply__result-actions">
                  <a
                    className="btn btn--primary"
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsApp />
                    {apply.readyWhatsapp}
                    <ArrowUpRight />
                  </a>
                  <a
                    className="btn btn--outline"
                    href={site.brand.instagramDm}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {apply.readyInstagram}
                    <ArrowUpRight />
                  </a>
                  <button type="button" className="btn btn--ghost" onClick={copyApplication}>
                    {copyState === 'copied' ? <Check /> : <Copy />}
                    {copyState === 'copied' ? apply.copied : apply.readyCopy}
                  </button>
                  {emailHref && (
                    <a className="btn btn--ghost" href={emailHref}>
                      Send by email
                      <ArrowUpRight />
                    </a>
                  )}
                </div>

                {copyState === 'error' && <p className="apply__copy-error">{apply.copyFailed}</p>}

                <pre
                  className="apply__preview"
                  aria-label="Your coaching application"
                  tabIndex={0}
                >
                  {message}
                </pre>

                <button type="button" className="apply__edit" onClick={reset}>
                  Edit application
                </button>
              </div>
            )}

            {status === 'sent' && (
              <div
                ref={resultRef}
                className="apply__result"
                role="status"
                tabIndex={-1}
                aria-live="polite"
              >
                <span className="apply__result-check" aria-hidden="true">
                  <Check />
                </span>
                <h3 className="apply__result-title">Application sent.</h3>
                <p className="apply__result-copy">
                  Your application has reached Anasse. You can also message him directly on WhatsApp
                  if you want to add anything.
                </p>
                <div className="apply__result-actions">
                  <a
                    className="btn btn--primary"
                    href={site.brand.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsApp />
                    {apply.readyWhatsapp}
                  </a>
                  <a
                    className="btn btn--outline"
                    href={site.brand.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {apply.readyInstagram}
                    <ArrowUpRight />
                  </a>
                </div>
              </div>
            )}

            {status !== 'ready' && status !== 'sent' && (
              <form
                ref={formRef}
                className="apply__form"
                onSubmit={handleSubmit}
                noValidate
                aria-busy={status === 'submitting'}
              >
                <div className="apply__form-head">
                  <span className="label">
                    <span className="label__dot" aria-hidden="true" />
                    Application
                  </span>
                  <span>{apply.requiredNote}</span>
                </div>

                {status === 'error' && (
                  <div
                    ref={errorRef}
                    className="apply__alert"
                    role="alert"
                    tabIndex={-1}
                    aria-live="assertive"
                  >
                    <p>The application didn’t send. Nothing was lost.</p>
                    <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                      Send it directly on WhatsApp
                      <ArrowUpRight />
                    </a>
                  </div>
                )}

                {Object.keys(errors).length > 0 && (
                  <p className="apply__error-summary" role="alert">
                    {apply.errorSummary}
                  </p>
                )}

                <div className="apply__fields">
                  <div
                    className={`field ${errors.name ? 'has-error' : ''}`}
                    data-span="full"
                  >
                    <label htmlFor="field-name">
                      {apply.fields.name} <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="field-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={values.name}
                      onChange={(event) => update('name', event.target.value)}
                      onBlur={() => validateOnBlur('name')}
                      placeholder={apply.placeholders.name}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'error-name' : undefined}
                      required
                    />
                    {errors.name && (
                      <span className="field__error" id="error-name">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  <div className={`field ${errors.email ? 'has-error' : ''}`} data-span="full">
                    <label htmlFor="field-email">
                      {apply.fields.email} <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="field-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={(event) => update('email', event.target.value)}
                      onBlur={() => validateOnBlur('email')}
                      placeholder={apply.placeholders.email}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'error-email' : undefined}
                      required
                    />
                    {errors.email && (
                      <span className="field__error" id="error-email">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  <div className={`field ${errors.instagram ? 'has-error' : ''}`}>
                    <label htmlFor="field-instagram">{apply.fields.instagram}</label>
                    <input
                      id="field-instagram"
                      name="instagram"
                      type="text"
                      autoComplete="username"
                      inputMode="text"
                      value={values.instagram}
                      onChange={(event) => update('instagram', event.target.value)}
                      onBlur={() => validateOnBlur('instagram')}
                      placeholder={apply.placeholders.instagram}
                      aria-invalid={Boolean(errors.instagram)}
                      aria-describedby={errors.instagram ? 'error-instagram' : 'hint-instagram'}
                    />
                    {errors.instagram ? (
                      <span className="field__error" id="error-instagram">
                        {errors.instagram}
                      </span>
                    ) : (
                      <span className="field__hint" id="hint-instagram">
                        {apply.hints.instagram}
                      </span>
                    )}
                  </div>

                  <div className={`field ${errors.age ? 'has-error' : ''}`}>
                    <label htmlFor="field-age">
                      {apply.fields.age} <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="field-age"
                      name="age"
                      type="number"
                      inputMode="numeric"
                      min="16"
                      max="80"
                      value={values.age}
                      onChange={(event) => update('age', event.target.value)}
                      onBlur={() => validateOnBlur('age')}
                      placeholder={apply.placeholders.age}
                      aria-invalid={Boolean(errors.age)}
                      aria-describedby={errors.age ? 'error-age' : undefined}
                      required
                    />
                    {errors.age && (
                      <span className="field__error" id="error-age">
                        {errors.age}
                      </span>
                    )}
                  </div>

                  <div className="field">
                    <label htmlFor="field-gender">{apply.fields.gender}</label>
                    <div className="select-wrap">
                      <select
                        id="field-gender"
                        name="gender"
                        value={values.gender}
                        onChange={(event) => update('gender', event.target.value)}
                        aria-describedby="hint-gender"
                      >
                        {apply.genders.map((gender) => (
                          <option key={gender} value={gender}>
                            {gender}
                          </option>
                        ))}
                      </select>
                    </div>
                    <span className="field__hint" id="hint-gender">
                      {apply.hints.gender}
                    </span>
                  </div>

                  <div className={`field ${errors.weight ? 'has-error' : ''}`}>
                    <label htmlFor="field-weight">
                      {apply.fields.weight} <span aria-hidden="true">*</span>
                    </label>
                    <div className="input-unit">
                      <input
                        id="field-weight"
                        name="weight"
                        type="number"
                        inputMode="decimal"
                        min="30"
                        max="250"
                        step="0.1"
                        value={values.weight}
                        onChange={(event) => update('weight', event.target.value)}
                        onBlur={() => validateOnBlur('weight')}
                        placeholder={apply.placeholders.weight}
                        aria-invalid={Boolean(errors.weight)}
                        aria-describedby={errors.weight ? 'error-weight' : undefined}
                        required
                      />
                      <span aria-hidden="true">kg</span>
                    </div>
                    {errors.weight && (
                      <span className="field__error" id="error-weight">
                        {errors.weight}
                      </span>
                    )}
                  </div>

                  <div className={`field ${errors.height ? 'has-error' : ''}`}>
                    <label htmlFor="field-height">
                      {apply.fields.height} <span aria-hidden="true">*</span>
                    </label>
                    <div className="input-unit">
                      <input
                        id="field-height"
                        name="height"
                        type="number"
                        inputMode="numeric"
                        min="120"
                        max="230"
                        value={values.height}
                        onChange={(event) => update('height', event.target.value)}
                        onBlur={() => validateOnBlur('height')}
                        placeholder={apply.placeholders.height}
                        aria-invalid={Boolean(errors.height)}
                        aria-describedby={errors.height ? 'error-height' : undefined}
                        required
                      />
                      <span aria-hidden="true">cm</span>
                    </div>
                    {errors.height && (
                      <span className="field__error" id="error-height">
                        {errors.height}
                      </span>
                    )}
                  </div>

                  <div className={`field ${errors.goal ? 'has-error' : ''}`} data-span="full">
                    <label htmlFor="field-goal">
                      {apply.fields.goal} <span aria-hidden="true">*</span>
                    </label>
                    <div className="select-wrap">
                      <select
                        id="field-goal"
                        name="goal"
                        value={values.goal}
                        onChange={(event) => update('goal', event.target.value)}
                        onBlur={() => validateOnBlur('goal')}
                        aria-invalid={Boolean(errors.goal)}
                        aria-describedby={errors.goal ? 'error-goal' : undefined}
                        required
                      >
                        <option value="">Select a goal</option>
                        {apply.goals.map((goal) => (
                          <option key={goal} value={goal}>
                            {goal}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.goal && (
                      <span className="field__error" id="error-goal">
                        {errors.goal}
                      </span>
                    )}
                  </div>

                  <div className={`field ${errors.experience ? 'has-error' : ''}`}>
                    <label htmlFor="field-experience">
                      {apply.fields.experience} <span aria-hidden="true">*</span>
                    </label>
                    <div className="select-wrap">
                      <select
                        id="field-experience"
                        name="experience"
                        value={values.experience}
                        onChange={(event) => update('experience', event.target.value)}
                        onBlur={() => validateOnBlur('experience')}
                        aria-invalid={Boolean(errors.experience)}
                        aria-describedby={errors.experience ? 'error-experience' : undefined}
                        required
                      >
                        <option value="">Select experience</option>
                        {apply.experienceLevels.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.experience && (
                      <span className="field__error" id="error-experience">
                        {errors.experience}
                      </span>
                    )}
                  </div>

                  <div className={`field ${errors.frequency ? 'has-error' : ''}`}>
                    <label htmlFor="field-frequency">
                      {apply.fields.frequency} <span aria-hidden="true">*</span>
                    </label>
                    <div className="select-wrap">
                      <select
                        id="field-frequency"
                        name="frequency"
                        value={values.frequency}
                        onChange={(event) => update('frequency', event.target.value)}
                        onBlur={() => validateOnBlur('frequency')}
                        aria-invalid={Boolean(errors.frequency)}
                        aria-describedby={errors.frequency ? 'error-frequency' : undefined}
                        required
                      >
                        <option value="">Select frequency</option>
                        {apply.frequencies.map((frequency) => (
                          <option key={frequency} value={frequency}>
                            {frequency}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.frequency && (
                      <span className="field__error" id="error-frequency">
                        {errors.frequency}
                      </span>
                    )}
                  </div>

                  <div className={`field ${errors.message ? 'has-error' : ''}`} data-span="full">
                    <div className="field__label-row">
                      <label htmlFor="field-message">{apply.fields.message}</label>
                      <span className="field__count">{values.message.length} / 1000</span>
                    </div>
                    <textarea
                      id="field-message"
                      name="message"
                      rows={5}
                      maxLength={1000}
                      value={values.message}
                      onChange={(event) => update('message', event.target.value)}
                      onBlur={() => validateOnBlur('message')}
                      placeholder={apply.placeholders.message}
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? 'error-message' : 'hint-message'}
                    />
                    {errors.message ? (
                      <span className="field__error" id="error-message">
                        {errors.message}
                      </span>
                    ) : (
                      <span className="field__hint" id="hint-message">
                        {apply.hints.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="apply__form-foot">
                  <button
                    type="submit"
                    className="btn btn--primary apply__submit"
                    disabled={status === 'submitting'}
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader className="apply__spinner" />
                        {apply.submitting}
                      </>
                    ) : (
                      <>
                        {apply.submit}
                        <ArrowUpRight />
                      </>
                    )}
                  </button>
                  <p className="apply__privacy">{apply.privacy}</p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
