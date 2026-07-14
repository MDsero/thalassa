# Thalassa — Luxury Yacht & Speed Boat Website

A single-page, no-build website matching the brief: cinematic hero, glassmorphism cards,
scroll-triggered animation, an interactive boat showcase with modal detail views, a live
"Build Your Dream Yacht" configurator, animated stats, a testimonial carousel, and a
full contact + footer section.

## Run it
No build step needed — it's plain HTML/CSS/JS.
1. Unzip the folder.
2. Open `index.html` directly in a browser, **or** serve it locally for the smoothest
   experience (some browsers throttle canvas/fonts on `file://`):
   ```
   cd thalassa
   python3 -m http.server 8080
   ```
   then visit `http://localhost:8080`.

## What's inside
- `index.html` — all page content and sections
- `style.css` — design tokens (colors/type/spacing) + all styling
- `script.js` — loader, smooth scroll (Lenis), scroll-reveals (GSAP/ScrollTrigger),
  animated ocean canvas, fleet filtering, boat detail modal, configurator logic with
  live price calculation, animated stat counters, and testimonial carousel
- Fonts: Fraunces (display) + Inter (body) via Google Fonts
- Libraries loaded via CDN: GSAP + ScrollTrigger, Lenis smooth scroll — no npm install required

## Design notes
- Palette: abyss navy, midnight teal, brass/gold accent, foam white, silver — a
  Rolls‑Royce-meets-marine-craft palette instead of the generic "ocean blue" gradient.
  Hex values are set as CSS variables at the top of `style.css` (`:root`) if you want
  to retheme.
- The signature motif is the "wake line": a thin brass scroll-progress bar plus a
  hand-drawn canvas wave animation in the hero, standing in for the video background
  described in the original brief (see note below).
- Photography is placeholder imagery (Lorem Picsum, seeded so it's stable/consistent),
  toned with the site's navy/brass color treatment. **Swap these for real, licensed
  yacht/marina/craftsmanship photography and video before shipping to production** —
  search `data-img` / `src` / `background-image` in `index.html` to find every
  placeholder in one pass.

## What's simplified vs. the original brief
The brief asked for a full React/Next.js/Three.js build with autoplay 4K drone
video and true 3D boat models. This build delivers the same *experience* — cinematic
hero, glass UI, scroll storytelling, interactive configurator and showcase — as a
lightweight static site so it runs anywhere with zero setup. If you want the full
React/Next.js/Three.js stack (real video hero, WebGL 3D boat viewer, page-transition
routing), this HTML/CSS/JS version is a solid spec to hand to a frontend team, or I
can scaffold the Next.js version next — just ask.

## Forms
The contact form and newsletter field are front-end only (no backend). Wire
`#contact-form` and `#newsletter-form` in `script.js` up to your email service,
CRM, or serverless function of choice.
