# ANAS_TIME — Design System

A dark, photographic, editorial system built around one idea: **the session is the proof.** The interface behaves like a training log — timestamps, technical labels, measured rules, and oversized type — rather than a generic fitness template.

---

## 1. Art direction

| Principle | Expression |
| --- | --- |
| Photography first | Full-bleed athlete imagery, dark gym shadows, blue equipment light |
| Editorial scale | Bebas Neue headlines at display size; tight leading; deliberate line breaks |
| Technical precision | Space Grotesk micro-labels, section timestamps, coordinates, rules, frame corners |
| Restraint | Two neutral families (ink + ice/silver) plus one blue accent; no decorative gradients beyond photographic glows |
| Motion as pacing | Reveals, a pinned horizontal process, parallax, and a session-time rail — all disabled or simplified for reduced motion |
| Honesty | No stock imagery, fake feeds, invented metrics, or guaranteed-results language |

The signature device is the **session rail**: a fixed right-side progress indicator that reads like a workout clock (`00:00` → `05:00`) and doubles as section navigation.

---

## 2. Color

Defined once in `src/styles/tokens.css`. Do not introduce off-palette colors.

| Token | Hex | Role |
| --- | --- | --- |
| `--c-black` | `#08090B` | Page canvas, deepest shadow |
| `--c-charcoal` | `#111418` | Raised surfaces, ticker, form fields |
| `--c-graphite` | `#202328` | Borders, secondary surfaces, scrollbar |
| `--c-ice` | `#E8E9E9` | Primary text, headlines |
| `--c-silver` | `#A9ADB4` | Body copy, secondary labels, **all small text** |
| `--c-steel` | `#686E77` | Decorative rules and large-only accents; never small text |
| `--c-blue` | `#174A9B` | Primary action, active state, accent light |
| `--c-blue-deep` | `#102B50` | Glow and depth behind blue accents |

### Derived lines

```css
--line: rgba(232, 233, 233, 0.12);
--line-strong: rgba(232, 233, 233, 0.24);
--line-blue: rgba(23, 74, 155, 0.65);
```

### Contrast rule

`--c-steel` on `--c-black` is roughly 3.9:1 — it fails WCAG AA for small text. Use `--c-silver` for anything readable at body or label size. `--c-steel` is reserved for non-text decoration, or text large enough to meet the 3:1 large-text threshold. This rule came out of the launch accessibility audit and is not optional.

---

## 3. Typography

| Token | Family | Use |
| --- | --- | --- |
| `--font-display` | Bebas Neue | H1/H2, oversized statements, numeric credentials |
| `--font-body` | Manrope | Body copy, descriptions, form values |
| `--font-mono` | Space Grotesk | Section labels, timestamps, captions, technical metadata |
| `--font-arabic` | Segoe UI / Geeza Pro / Noto Naskh Arabic | The Arabic phrase in Philosophy |

Fonts are self-hosted through `@fontsource` (Latin subsets) and loaded in `main.tsx`.

### Scale

```css
--fs-display: clamp(4.4rem, 10vw, 10.5rem);
--fs-h2:      clamp(3rem, 7vw, 7.4rem);
--fs-h3:      clamp(1.6rem, 2.4vw, 2.4rem);
--fs-lead:    clamp(1.05rem, 1.4vw, 1.3rem);
--fs-body:    clamp(0.95rem, 1vw, 1.05rem);
--fs-label:   0.6875rem;
--fs-micro:   0.625rem;
```

Headlines use line-height `0.92`, uppercase Bebas, and `text-wrap: balance`. Labels use uppercase, `0.18em` tracking, and a small blue dot. Body copy uses `text-wrap: pretty`.

---

## 4. Layout

| Token | Value | Use |
| --- | --- | --- |
| `--container` | `1480px` | Maximum content width |
| `--gutter` | `clamp(1.25rem, 4vw, 4.5rem)` | Horizontal page padding |
| `--section-y` | `clamp(5.5rem, 10vw, 10rem)` | Vertical section rhythm |
| `--nav-h` | `78px` | Fixed navigation height |
| `--radius` | `2px` | Nearly square corners, technical feel |

The `.container` and `.section` primitives live in `src/styles/base.css`. Sections use a consistent `SectionMeta` header: `NN / Section name` on the left, session time on the right.

### Responsive behavior

| Width | Behavior |
| --- | --- |
| `320px` | Minimum supported width; compact paddings, single column, mobile menu |
| `380px` | Small-phone typography adjustments |
| `600px` | Hero headline scales up; primary CTA becomes inline |
| `768px` | Two-column service/process layouts begin to expand |
| `900px` | Desktop hero layout and photo panel; hero parallax enabled |
| `1024px` | Fixed session rail, Lenis smooth scroll, pinned horizontal process |
| `1200px` | Larger editorial spacing and type |

Lenis is **desktop-only** (`min-width: 1024px`) and disabled under `prefers-reduced-motion`. Touch devices keep native momentum scrolling.

---

## 5. Components

### Section meta (`SectionMeta`)

Small uppercase section index plus a session timestamp. Both are decorative metadata; the timestamp is `aria-hidden`. Do not use it as the only heading for a section — every section has a real `h2`.

### Label

Blue dot + uppercase Space Grotesk text. Used for eyebrows, form headers, and small status lines. Color is `--c-silver` for legibility.

### Buttons

| Variant | Appearance | Use |
| --- | --- | --- |
| `.btn--primary` | Solid blue, ice text | Main conversion action |
| `.btn--outline` | Transparent, strong rule | Secondary action |
| `.btn--ghost` | Quiet text/rule action | Copy, WhatsApp, tertiary links |

All buttons share uppercase mono labels, a minimum 44px touch height, visible focus ring, and arrow icons where the action leaves the page or advances the flow.

### Media

`src/components/Picture.tsx` renders a `<picture>` with responsive WebP sources, a JPEG fallback, width/height to prevent layout shift, a blurred LQIP background, and a load-in class. `eager` is used only for the hero portrait.

### Fields

Dark charcoal inputs with a bottom or full rule, silver labels, blue focus state, inline error text, optional hints, and units (`kg`, `cm`) inside the field. Required fields carry a visible `*` and the form states that marked fields are required.

### Lightbox

Native `<dialog>` with a photo stage, title, counter, previous/next buttons, close button, keyboard arrows, Escape to close, scroll lock, and focus restoration. Mobile shows a tall single image with side arrows; the keyboard hint is hidden on touch layouts.

### Session rail (`PageRail`)

Fixed right-side navigation with nine section dots, active section label, progress fill, and a running time. It is hidden below `1024px`. Each dot is a real button with an accessible label and `aria-current`.

### Navigation

Fixed top bar. Desktop shows the wordmark, section links, Instagram, and Apply. Mobile collapses to wordmark, Instagram, Apply, and a menu button; the menu locks scroll, traps focus, closes on Escape, and returns focus to the trigger.

---

## 6. Motion

| Layer | Implementation |
| --- | --- |
| Smooth scroll | Lenis, `lerp: 0.1`, driven by the GSAP ticker; desktop only |
| Scroll orchestration | GSAP ScrollTrigger, refreshed on resize/font load/BFCache |
| Reveals | IntersectionObserver adds `y: 26 → 0`, `opacity: 0 → 1`, `1s`, stagger `0.08`, `power3.out` |
| Image reveals | Clip-path wipe `inset(0 0 100% 0)` → `inset(0)`, `1.25s`, `power4.inOut` |
| Hero | Photo parallax and ghost-type drift above `900px` |
| Process | Pinned horizontal track with scrub and progress bar at `≥1024px` |
| Hover | Short translate/color transitions using `--dur-fast` / `--dur-mid` |
| Reduced motion | All non-essential animation skipped; content is visible by default, with no pinning or smooth scroll |

Reveals use IntersectionObserver rather than ScrollTrigger batches so that direct anchor jumps, browser restoration, and fast scrolls never leave a section invisible.

### Easing

```css
--ease-out:   cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--dur-fast:  220ms;
--dur-mid:   480ms;
```

---

## 7. Accessibility

- Skip link to `#main`; `<main>` is focusable.
- Strong `:focus-visible` outline on every interactive element.
- All images have descriptive alt text; decorative frames/glows are `aria-hidden`.
- One `h1`; each section has an `h2` and `aria-labelledby`.
- The lightbox is a native dialog with keyboard controls and focus return.
- The mobile menu traps focus and restores it on close.
- Form labels are explicit; errors are associated via `aria-describedby`; the summary uses `role="alert"`; results use `role="status"`.
- Small text uses `--c-silver`; the launch axe scan reports 0 violations at desktop and mobile.
- `prefers-reduced-motion` disables Lenis, reveals, parallax, and the pinned process.

---

## 8. File map

```
src/
  App.tsx                 page assembly + reveal observers
  main.tsx                React bootstrap + font imports
  content/
    site.ts               all public copy and verified facts
    image-lqip.json       generated blurred placeholders
  components/
    Navbar / Hero / Ticker / About / Coaching / Process /
    Philosophy / Gallery / InstagramSection / Apply / Contact /
    Footer / PageRail / SectionMeta / Picture / Icons
    *.css                 component-scoped styles
  hooks/
    useSmoothScroll.ts    desktop Lenis + ScrollTrigger sync
    useScrollRefresh.ts   resize/font/BFCache refresh
  lib/
    gsap.ts               plugin registration
    scroll.ts             lock/unlock + anchor scrolling
  styles/
    tokens.css            palette, type, layout, motion
    base.css              reset, primitives, focus, scrollbar
public/
  images/                 responsive athlete photography
  og-image.jpg            1200×630 share image
  favicon.svg, brand/     monogram assets
```

When adding a section: use the `.section` + `.container` pattern, add `SectionMeta`, give it a real `h2` and `aria-labelledby`, add a rail entry with a timestamp, and keep the palette rules above.
