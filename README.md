# Retro Cartridge Portfolio

A tactile, browser-based portfolio built with React, TypeScript, Vite, CSS, and SVG. No paid assets, runtime API calls, external fonts, or animation libraries are required.

**Live:** https://potatoheadkim.github.io/retro-portfolio/

## Run locally

Use Node.js 24 (the CI version), then:

```sh
npm ci
npm run dev
```

Open the URL printed by Vite, normally `http://127.0.0.1:5173/retro-portfolio/`.

```sh
npm run typecheck
npm test
npm run build
npm run preview
```

## Interaction

- Drag a cartridge into the console slot, or click/tap it to insert.
- Insertion enables **START** and **EJECT**; it never launches a project automatically.
- **START** plays a CRT boot effect and expands a project screen from the measured TV screen rectangle.
- **← BACK / CONSOLE** or **Escape** reverses the animation and keeps the cartridge inserted.
- **EJECT** lifts the cartridge out and returns it to the shelf.
- Tab / Shift+Tab and Enter / Space operate the cartridge and console buttons. Focus returns to START after inserting/back, and to the cartridge after ejecting.
- Pointer Events support mouse, pen, and touch. On narrow screens the shelf moves below the console; tapping is an alternative to dragging.
- Input is locked during transitions. Reduced-motion preferences shorten movement and remove flashing. The project dialog traps focus, and the background is inert.

## Edit project data

Change only `src/data/projects.ts` to add or remove cartridges. Each item uses `PortfolioProject` from `src/types/project.ts`:

```ts
{
  id: 'unique-id',
  title: 'Project title',
  description: 'Verified project description.',
  technologies: ['Actual stack'],
  cartridgeColor: '#afc6b5',
  // image: `${import.meta.env.BASE_URL}project-image.png`,
  // githubUrl: 'https://github.com/owner/repository',
}
```

The four included cartridges — LLM Fine-tuning, RAG System, Multi-Agent, Research — are explicitly placeholders. Their descriptions are not claims of completed projects or experiments. GitHub buttons appear only when `githubUrl` exists. Without an image, a local SVG pixel cartridge is displayed.

## Structure

```text
src/
  components/       # TV, console, cartridges, shelf, project dialog
  data/projects.ts  # Editable project content
  types/project.ts  # Shared data interface
  hooks/            # Console state machine and transition tests
  App.tsx           # Pointer drag and cartridge flight orchestration
  App.css           # Original CSS hardware design and responsive layout
```

## GitHub Pages

`vite.config.ts` sets `base: '/retro-portfolio/'`. The app has no client-side route dependency. In repository **Settings → Pages**, select **GitHub Actions** as the source. `.github/workflows/deploy.yml` installs locked dependencies, runs tests and the TypeScript/build checks, uploads `dist`, and deploys Pages on pushes to `main`.

If you rename the repository, update Vite's `base` and the live URL in this README.

## Validation

- TypeScript strict checks and Vite production build.
- State-machine tests cover the complete flow, occupied-slot protection, duplicate-input guards, and START-only launch.
- Desktop browser: real pointer drag/drop, START, ESC and BACK, re-entry with the same cartridge, EJECT, replacement, keyboard selection.
- Mobile browser viewport (390 × 844): stacked layout, click/tap-equivalent selection, project view, back navigation, no horizontal overflow.
- Real physical touchscreen hardware has not been tested in this workspace.

## Design

Original CSS/SVG hardware inspired by late-1980s consoles: warm ivory CRT, gray plastic console, pastel cartridge labels, and a dark green display. The cartridge insertion concept references KOBU Foundry; no source code or assets were copied.
