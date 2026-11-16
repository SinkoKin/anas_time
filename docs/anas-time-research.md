# Anasse Time — Research and Content Verification

**Status:** launch-ready, with the open items below
**Last verified:** 15 November 2026
**Purpose:** record what is known about Anasse Time, where each public claim came from, and what this website deliberately does not say.

---

## 1. Sources reviewed

| Source | What it established | Notes |
| --- | --- | --- |
| Instagram profile [@anas__time](https://www.instagram.com/anas__time) | Name, verified status, location, disciplines, federations, competition record, bio themes | Public profile, captured 15 November 2026 |
| Public coaching posts on the same account | Coaching offer, delivery modes, WhatsApp contact, poster wording | Individual post permalinks were not retained during capture |
| Four supplied JPEG photographs | All athlete imagery used on the site | Originals: `profil.jpeg`, `WhatsApp Image 2026-11-15 at 19.00.40.jpeg`, `… (1).jpeg`, `… (2).jpeg` |
| This repository | Copy, layout, and form behavior | Built from the verified items above |

No official federation results page, personal website, published price list, certification page, testimonial, transformation gallery, or public email address was found or verified.

---

## 2. Profile snapshot

Captured 15 November 2026. Follower and post counts change constantly and are **not published on the site**.

- **Name:** Anasse Time
- **Handle:** `@anas__time` (verified account)
- **Audience at capture:** 2,168 followers, 223 posts
- **Location:** Marrakech, Morocco
- **Role:** Bodybuilding athlete and coach
- **Disciplines:** Men's Physique and Classic Physique
- **Federations:** PCA and NPC
- **Bio lines used as source for the record:** ×3 PCA 2024 · ×1 NPC Classic Physique 2024 · ×1 PCA Men's Physique 2023 · ×4 Casa Force 24/25 · ×3 Night of Glory 25
- **Bio themes:** `الحمد لله` ("praise be to God"), "start today win tomorrow", "we have work to do"

The age indicator visible in the profile ("26") was **not confirmed** as an age and is not published.

---

## 3. Competition record

The site reproduces the athlete's own bio lines verbatim:

| Bio line | Where it appears |
| --- | --- |
| ×3 PCA 2024 | Hero credential, ticker, About record |
| ×1 NPC Classic Physique 2024 | Hero credential, ticker, About record |
| ×1 PCA Men's Physique 2023 | Hero credential, ticker, About record |
| ×4 Casa Force 24/25 | Ticker, About record |
| ×3 Night of Glory 25 | Ticker, About record |

**Verification level:** athlete-stated, not independently cross-checked against a federation database.

The site does **not** expand these abbreviations into placings, titles, or "wins" beyond the athlete's own wording. The About paragraph says only that the record spans PCA and NPC stages from 2023 through 2025. Any future claim such as "3× champion" should be confirmed with the athlete or a federation source first.

---

## 4. Coaching offer

The public coaching poster establishes:

- Personalized training program
- Nutrition plan for mass, cut, or body recomposition
- Regular check-ins and plan adjustments
- Continuous advice and motivation
- Private coaching in Marrakech
- Online coaching delivered remotely
- WhatsApp as the published contact route

The poster also used a "guaranteed results" style claim. **That claim is deliberately excluded** — results cannot be guaranteed, and the site avoids promising them.

The site maps the verified offer to four services: training program, nutrition plan, regular check-ins, and continuous support.

---

## 5. Contact details

| Channel | Value | Source | Status |
| --- | --- | --- | --- |
| WhatsApp | `+212 628 344 916` (`wa.me/212628344916`) | Published on public coaching posts | Used on site, with a note explaining the source |
| Instagram | [@anas__time](https://www.instagram.com/anas__time) | Public profile | Used on site |
| Instagram DM | `https://ig.me/m/anas__time` | Standard Instagram DM link built from the handle | Used in the form fallback |
| Email | — | Not published or verified | Omitted; optional deployment setting only |
| Domain | — | Not verified | No canonical URL or `og:url` asserted |

The WhatsApp number is the honest fallback for every form state. It should be re-checked with the athlete before launch and periodically afterward.

---

## 6. Content decisions

### Included

- Name, handle, location, disciplines, federations
- Competition record exactly as stated in the bio
- Verified coaching offer from the public poster
- Public WhatsApp contact, with source note
- Supplied athlete photography only
- Clearly labelled application flow that does not pretend to send when no endpoint exists

### Deliberately omitted

| Item | Reason |
| --- | --- |
| Prices and packages | No verified price list; site says pricing is confirmed after review |
| Testimonials | None verified |
| Transformation photos / before-and-after claims | None verified; would imply results |
| Certifications and qualifications | None verified |
| Email address | None published; not invented |
| Custom domain / canonical URL | Not verified; `anastime.com` was removed |
| Live Instagram feed embed | Would be fake or unstable without an API integration |
| "Guaranteed results" | Unsupported and unethical |
| Age, follower count, personal details | Not necessary or not confirmed |
| Federation ranking claims | No federation page was verified |

### Honesty rules applied to the UI

1. With no form endpoint configured, the form shows a review panel and says **"Nothing has been sent yet."**
2. With an endpoint configured, success is shown only after a 2xx response.
3. A failed request shows an error with a WhatsApp escape route.
4. The Instagram section is described as selected archive photography, not a live feed.
5. Submission copy is labelled as an application, not a booked coaching place.

---

## 7. Photography

All imagery comes from four files supplied for this project. They were cropped and converted to responsive WebP/JPEG sizes; no stock or AI-generated athlete imagery is used.

Names, descriptions, and alt text are written from what is visible in each frame. The footer credits the **@anas__time archive** rather than asserting a specific photographer.

If the athlete wants a named photographer credit, collect the correct name and replace the footer line.

---

## 8. Open items for the athlete

Before or immediately after launch, confirm:

1. **Final domain** — add `canonical`, absolute `og:url`, and absolute `og:image` once confirmed.
2. **Public email** — only if the athlete wants email as a contact route.
3. **Pricing and availability wording** — currently deferred until after application review.
4. **Competition record interpretation** — confirm that the bio counts may be published as shown.
5. **Photography credit** — confirm whether a named photographer should replace the archive credit.
6. **Form endpoint** — supply a real endpoint if applications should be delivered automatically; otherwise the WhatsApp/Instagram/copy fallback remains.
7. **Post links** — optional permalinks for the coaching poster and competition posts, to keep this research auditable.
8. **WhatsApp number** — confirm it is still the correct public contact.

---

## 9. Verification log

- **15 Nov 2026** — Instagram profile and public coaching posts reviewed; profile snapshot recorded; four supplied images reviewed; all site claims cross-checked against this document.
- **15 Nov 2026** — copy audit removed "multiple first-place finishes" in favour of the narrower, source-safe "competition record spanning PCA and NPC stages." Footer credit changed from an implied photographer credit to "Imagery — @anas__time archive."
- **15 Nov 2026** — axe-core scan (desktop and mobile): 0 WCAG A/AA or best-practice violations. Browser QA covered 320, 390, 834, 900, 1024, 1280, and 1440 px.
