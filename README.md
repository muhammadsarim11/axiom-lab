# Axiom Tutoring: website

Maths · Physics · Chemistry tutoring (Years 7–12) for Syed Mannan Ali. Perth-based, online worldwide.

**Stack:** Next.js 16 (App Router) · React 19 · GSAP + ScrollTrigger + SplitText · Lenis smooth scroll · plain CSS.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
npm run lint
```

## Pages

| Route    | What                                                                                            |
| -------- | ----------------------------------------------------------------------------------------------- |
| `/`      | Home: hero, approach, subjects & services, exam prep, pricing, free resources, testimonials, FAQ, booking form |
| `/about` | Tutor profile, what to expect, contact details (phone / WhatsApp / email / socials)             |

Also generated: `sitemap.xml`, `robots.txt`, Open Graph images, favicon, JSON-LD (organisation, FAQ, person, breadcrumbs).

## Before going live: replace the placeholders

Almost everything lives in [`lib/site.js`](lib/site.js). Contact details come from env variables
(copy [`.env.example`](.env.example) to `.env.local`, or set them in the host's dashboard).

| What                         | Where                                                         |
| ---------------------------- | ------------------------------------------------------------- |
| Live domain                  | `NEXT_PUBLIC_SITE_URL` (canonical URLs, sitemap, social cards) |
| Phone / WhatsApp / email     | `NEXT_PUBLIC_PHONE_DISPLAY`, `NEXT_PUBLIC_WHATSAPP_NUMBER` (digits only, e.g. `61412345678`), `NEXT_PUBLIC_CONTACT_EMAIL` |
| Social profiles              | `NEXT_PUBLIC_INSTAGRAM_URL`, `..._LINKEDIN_URL`, `..._FACEBOOK_URL`, `..._YOUTUBE_URL` |
| Brand name                   | `site.name` / `site.shortName` in `lib/site.js` (also the logo text in `components/Logo.jsx`) |
| Prices                       | `packages[].price` (`null` shows "Enquire for rates")         |
| Testimonials                 | `testimonials` array (empty shows a "coming soon" card). Add only genuine reviews. |
| Tutor photo                  | Put a file in `public/images/` and set `tutor.photo` (e.g. `"/images/tutor.jpg"`) |
| Qualifications / experience  | `tutor.credentials`                                           |
| Syllabus topics, FAQ, resources | `subjects`, `faqs`, `resources`                            |

Until a WhatsApp number is set, every WhatsApp button falls back to scrolling to the booking form.

## Enquiry form

The booking form (state, year level and subjects are dropdowns) posts to `/api/enquiry`.

- With `RESEND_API_KEY`, `ENQUIRY_TO_EMAIL` and `ENQUIRY_FROM_EMAIL` set, the enquiry is emailed via
  [Resend](https://resend.com) (the sending domain must be verified there).
- Without them, the visitor gets a "ready to send" screen with one-tap **WhatsApp** and **email** buttons
  carrying the pre-filled enquiry, so no lead is lost.

Includes server-side validation, a honeypot field and a basic per-IP throttle.

## Animation & interaction notes

Page motion lives in [`components/Motion.jsx`](components/Motion.jsx) and is driven by `data-*` attributes
(`data-reveal`, `data-split`, `data-draw`, `data-tilt`, `data-spot`, …) so sections stay server-rendered:
scroll reveals, the always-moving marquee (speeds up with scroll, slows on hover), magnetic buttons,
3D tilt, cursor glow on cards and a top scroll-progress bar.

**3D models** (the hero projectile drawing, plus Maths surface, Physics Newton's cradle, Chemistry phenol molecule) are in
[`lib/scenes.js`](lib/scenes.js) and mount from [`components/Scene3D.jsx`](components/Scene3D.jsx). three.js is a
separate lazy chunk (the hero loads it right after first paint; the subject cards when they near the viewport). Visitors can drag to rotate;
without WebGL the original 2D line art / SVG drawing is shown instead.

**Reduced motion:** visitors whose operating system has animations turned off (Windows: Settings →
Accessibility → Visual effects → Animation effects) get a calm site: no scroll/hover animation, a *still*
(but draggable) 3D model, and a small **"Turn on animations"** notice. One click enables the full
experience and is remembered in that browser (`localStorage`); `?motion=on` / `?motion=off` do the same
from the URL. To run the animated site for everyone regardless, set `respectReducedMotion = false` in
`lib/site.js`. Content always stays visible if JavaScript fails.

## Deploying

Any Next.js host works (Vercel is the simplest). Set the env variables above, point the domain at it,
then submit `https://<domain>/sitemap.xml` to Google Search Console.
