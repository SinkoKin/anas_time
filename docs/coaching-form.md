# Coaching Application — Behavior and Configuration

The application form lives in `src/components/Apply.tsx`. It is deliberately honest about what happens to the data: no endpoint means **nothing is sent**, and the UI says so.

---

## 1. Two modes

| Mode | Configuration | What the visitor sees |
| --- | --- | --- |
| **Review fallback** (default) | `VITE_COACHING_ENDPOINT` empty | Validation runs, then a review panel with the full application, a prefilled WhatsApp link, an Instagram DM link, and a copy button. Copy changes the heading to "Your application is ready." and states "Nothing has been sent yet." |
| **Direct submit** | `VITE_COACHING_ENDPOINT` set | The form POSTs JSON to the endpoint. The success screen appears only after a 2xx response. Network errors and non-2xx responses show an error with a WhatsApp fallback. |

No fake success state exists in either mode.

---

## 2. Fields and validation

Validation runs on blur once a field is touched, on change after an error appears, and across the whole form on submit. `noValidate` is set so the custom messages and focus handling are used consistently.

| Field | Name | Required | Rule |
| --- | --- | --- | --- |
| Full name | `name` | Yes | At least 2 characters after trimming |
| Email address | `email` | Yes | Matches `^[^\s@]+@[^\s@]+\.[^\s@]{2,}$` |
| Instagram username | `instagram` | No | If present, `^@?[A-Za-z0-9._]{1,30}$` |
| Age | `age` | Yes | Number from 16 to 80 |
| Gender | `gender` | No | `Prefer not to say`, `Male`, or `Female`; defaults to `Prefer not to say` |
| Current weight | `weight` | Yes | Number from 30 to 250 kg, step 0.1 |
| Height | `height` | Yes | Number from 120 to 230 cm |
| Main goal | `goal` | Yes | One of the listed goals |
| Training experience | `experience` | Yes | One of the listed experience levels |
| Training frequency | `frequency` | Yes | One of the listed frequencies |
| Additional information | `message` | No | Maximum 1,000 characters |

On submit with errors:

1. All errors are computed.
2. Focus moves to the first invalid field (DOM order).
3. Each invalid field gets `aria-invalid="true"` and an `aria-describedby` pointing at its error message.
4. A summary with `role="alert"` appears above the fields.

The form does not collect payment details, medical records, or file uploads. The free-text field asks for relevant training context only.

---

## 3. Endpoint contract

Set the endpoint at build time:

```bash
# .env.local
VITE_COACHING_ENDPOINT=https://your-endpoint.example/apply
```

Vite exposes `VITE_*` values in the client bundle. **Never put an API secret in this variable** — the endpoint must be safe to call from a browser and should validate, rate-limit, and store data on the server side.

### Request

```
POST <VITE_COACHING_ENDPOINT>
Content-Type: application/json
```

Body (all values are strings, exactly as entered/selected):

```json
{
  "name": "Test Athlete",
  "email": "test@example.com",
  "instagram": "@testathlete",
  "age": "27",
  "gender": "Male",
  "weight": "82",
  "height": "178",
  "goal": "Build muscle",
  "experience": "3–5 years",
  "frequency": "4 days per week",
  "message": "I train four days a week and want to add size while staying lean.",
  "source": "anas-time-website",
  "submittedAt": "2026-11-15T18:00:00.000Z"
}
```

Notes:

- `age`, `weight`, and `height` are strings, not numbers.
- Empty optional fields are sent as empty strings.
- `source` is a fixed site identifier, not a domain claim.
- `submittedAt` is generated in the browser; do not treat it as tamper-proof.
- The response body is ignored. Any 2xx status counts as success.

### Failure handling

- Network failure, CORS failure, or any non-2xx response → error state.
- The error says the application didn't send and that nothing was lost.
- The WhatsApp fallback link is prefilled with the same application text.
- The visitor can retry by submitting again; form values remain in place.

### CORS

The endpoint must allow the site's production origin, the `Content-Type: application/json` request header, and `POST`. Test from the deployed origin, not only localhost.

---

## 4. Optional email fallback

```bash
VITE_CONTACT_EMAIL=name@confirmed-domain.example
```

If set, a **Send by email** button is added to the review panel with the application prefilled as the `mailto:` body. Leave it empty unless the address is confirmed and monitored. The site does not publish an email address on its own.

---

## 5. WhatsApp and Instagram fallbacks

The review panel builds:

- **WhatsApp:** `https://wa.me/212628344916?text=<encoded application>`
- **Instagram DM:** `https://ig.me/m/anas__time`
- **Copy:** writes the plain-text application to the clipboard; on failure it shows "Could not copy — select the text below instead." and the full `<pre>` preview remains selectable.

The review panel is keyboard-focusable, receives focus after render, and scrolls into view below the fixed navigation (`-96px` offset).

---

## 6. Accessibility details

- Every input has a visible `<label>`.
- Required fields are marked visually with `*` and the form explains "Fields marked * are required."
- Error text is associated with its field, not just colored.
- The error summary uses `role="alert"`; the review/success panel uses `role="status"` and `aria-live="polite"`.
- `aria-busy` is set while submitting.
- The submit button is disabled only during submission and shows a spinner plus text.
- Results receive focus so screen-reader users are not left at the old scroll position.
- The form works without JavaScript validation attributes because custom validation is authoritative.

---

## 7. Testing checklist

Run through both modes before launch.

**Fallback mode (no endpoint)**

- [ ] Submit empty → 8 invalid fields, summary visible, focus on the first field.
- [ ] Enter an invalid email, age 15, weight 20, height 100 → each message is specific.
- [ ] Enter a valid application → review panel appears, "Nothing has been sent yet." is visible.
- [ ] WhatsApp link opens with the full application prefilled.
- [ ] Copy writes the exact text, button changes to "Copied to clipboard", and reverts after 3 seconds.
- [ ] Edit application returns to the form with values intact and focus on the first input.
- [ ] At 390 px, the result panel is not hidden under the fixed nav and nothing overflows.

**Endpoint mode**

- [ ] A 2xx response shows "Application sent."
- [ ] A 500 response, a network failure, or a blocked CORS request shows the error state and WhatsApp fallback.
- [ ] Double-submit is prevented while `status === 'submitting'`.
- [ ] The endpoint receives the payload shape above.

**General**

- [ ] Keyboard-only completion works.
- [ ] Screen reader announces errors and the result.
- [ ] No console errors.
- [ ] axe-core reports no new violations.

---

## 8. Known limitations

- Validation is client-side only; the endpoint must validate again.
- There is no spam protection in the UI (no CAPTCHA, honeypot, or rate limit). Add server-side protection before exposing a public endpoint.
- There is no database, CRM, or email delivery in this repository.
- The form does not upload photos or documents.
- Data handling depends entirely on the configured endpoint. Update the privacy line if the endpoint's retention or sharing policy differs.
