# NT® — With your headphones on

Landing page for **NT®**, a fictional headphone brand. A design exercise: there
is no real product behind it.

**[landing-gorila.netlify.app](https://landing-gorila.netlify.app)**

**Stack:** React 18 + Vite 6 + TypeScript + Tailwind CSS + shadcn/ui

## Getting started

```bash
npm install     # once
npm run dev     # dev server → http://localhost:5173
npm run build   # production build → dist/
npm run preview # preview the build
npm run lint    # type check
```

> **Cloned fresh, the page loads without video or music.** `public/video/` and
> `public/audio/` are gitignored on purpose — see [notas/ESTADO.md](notas/ESTADO.md)
> for where each file comes from.

## The sequence

Four blocks chained together with no visible seam, all on the same green:

| # | Section | What happens |
|---|---|---|
| 1 | `VideoPanel` + `Hero` | The gorilla in profile, looping; text on the left |
| 2 | `Interludio` | A breath: "It isn't the absence of sound" |
| 3 | `ScrollStory` | Scrolling drives the gorilla's turn |
| 4 | `Transicion` + `Cierre` | Bridge and closing shot over the product |

Plus the fixed `Reproductor` in the bottom left: seven bars reacting to the
real audio through an `AnalyserNode` — not a canned animation.

## Structure

```
src/
├── components/
│   ├── ui/button.tsx        shadcn button with a "glass" variant
│   ├── ui/text-animate.tsx  letter-by-letter text (cult-ui, adapted)
│   ├── Hero.tsx  Navigation.tsx  Logo.tsx  VideoPanel.tsx
│   ├── Interludio.tsx  ScrollStory.tsx  Transicion.tsx  Cierre.tsx
│   ├── Estelas.tsx          light trails reacting to the audio
│   └── Reproductor.tsx      local audio + frequency analysis
├── lib/
│   ├── audio.tsx            shared audio context
│   ├── useEnVista.ts        viewport-entry hook
│   └── utils.ts             cn() helper
├── App.tsx  index.css  main.tsx

public/          favicon, img/ (posters) — video/ and audio/ stay out of Git

notas/           written in Spanish
├── ESTADO.md      where things stand today
├── DECISIONES.md  why things are the way they are
└── CONTEXTO.md    how we work on this
```

## Customising

- **Colours:** HSL variables in `:root`, inside `src/index.css`
- **Typefaces:** imported from `index.html`

## Deploying

```bash
npm run build
npx netlify deploy --prod --dir=dist
```

**Deployment is manual, deliberately.** The repository is not wired to Netlify
for automatic builds: since the video and audio never go into Git, a build run
by Netlify from GitHub would produce a landing page with no material. Uploading
the `dist` built locally is what guarantees the 38 MB actually arrive.

For the same reason, **pushing to GitHub does not update the site.**

## Security

A code review on 3 September 2026 found nothing: no XSS sinks, no secrets, no
network calls, no storage, and `npm audit` reports 0 vulnerabilities. The
reasoning is in [notas/DECISIONES.md](notas/DECISIONES.md).

Security headers live in [netlify.toml](netlify.toml). The CSP was **measured
against the running site**, not copied from a template — which is why
`style-src` carries `'unsafe-inline'`: the page has 70 elements with a `style`
attribute (the animations), and without it nothing renders. That is the only
concession. `default-src 'none'` means any third party added from here on fails
loudly instead of slipping in unnoticed.

Google Fonts is the one remaining runtime dependency on someone else's server.
Self-hosting it is still open in `ESTADO.md`; the day it happens, two lines
come out of the CSP and no third-party origin is left.
