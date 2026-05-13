# react-stopwatch-pro

React stopwatch component with laps, merge/delete, manual time override, swipe hints on small screens, and a headless **`useStopwatch`** hook. Written in TypeScript.

**Live demo (GitHub Pages):** after you enable Pages (see below), your site will be at  
`https://<your-username>.github.io/<repository-name>/`  
For a repo named `react-stopwatch-pro` under user `myuser`, that is  
`https://myuser.github.io/react-stopwatch-pro/`.

## Features

- Start / stop / lap / reset with lap list and current split display  
- Optional **manual time override** (MM:SS:CS)  
- **Delete** or **merge** laps (with confirmation modals); swipe hints on narrow viewports  
- Callbacks: `onStart`, `onStop(time)`, `onReset`, `onLap(lapMs, totalMs)`  
- **`showLaps`** and **`className`** props  
- **`formatStopwatchTime`** helper (`MM:SS:CS`)

## Install

```bash
npm install react-stopwatch-pro
```

**Peer dependencies:** `react` and `react-dom` **18+**.

### Styling

The built-in UI uses [**Tailwind CSS**](https://tailwindcss.com/) utility classes. Your app must include Tailwind with `content` globs that cover **this library’s source** (or your bundled output), for example:

```js
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-stopwatch-pro/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "scale-in": "scale-in 0.2s ease-out forwards",
      },
    },
  },
};
```

Modal panels use the **`animate-scale-in`** animation; add the keyframes above if you do not already have them.

## Usage

### `<Stopwatch />`

```tsx
import { Stopwatch } from "react-stopwatch-pro";

export function App() {
  return (
    <Stopwatch
      className="max-w-md mx-auto"
      showLaps
      onStart={() => console.log("started")}
      onStop={(elapsedMs) => console.log("stopped at", elapsedMs)}
      onReset={() => console.log("reset")}
      onLap={(lapMs, totalMs) => console.log("lap", lapMs, "total", totalMs)}
    />
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `autoStart` | `boolean` | `false` | Start the timer on mount |
| `showLaps` | `boolean` | `true` | Render lap list UI |
| `className` | `string` | `""` | Extra classes on the root element |
| `onStart` | `() => void` | — | Fires when starting |
| `onStop` | `(timeMs: number) => void` | — | Fires when stopping; `timeMs` is elapsed |
| `onReset` | `() => void` | — | Fires when reset |
| `onLap` | `(lapMs: number, totalMs: number) => void` | — | Fires when a lap is recorded |

### `useStopwatch` hook

Use the same timing/lap logic with your own UI:

```tsx
import { useStopwatch, formatStopwatchTime } from "react-stopwatch-pro";

export function CustomUI() {
  const sw = useStopwatch({});

  return (
    <div>
      <output>{formatStopwatchTime(sw.time)}</output>
      {/* use sw.handleStart, sw.handleStop, sw.handleLap, sw.laps, … */}
    </div>
  );
}
```

## Repository layout

| Path | Role |
|------|------|
| `src/stopwatch/Stopwatch.tsx` | Composes UI |
| `src/stopwatch/useStopwatch.ts` | Timer state and lap logic |
| `src/stopwatch/formatStopwatchTime.ts` | Time formatter |
| `src/stopwatch/StopwatchDisplay.tsx` | Display + override panel |
| `src/stopwatch/StopwatchControls.tsx` | Control buttons |
| `src/stopwatch/StopwatchLapList.tsx` | Lap list + swipe |
| `src/stopwatch/DeleteLapModal.tsx` / `MergeLapModal.tsx` | Confirm dialogs |
| `demo/` | Vite + React demo site (GitHub Pages) |

## Demo site & GitHub Pages

The **`demo/`** app is a small Vite + React + Tailwind site that imports the library from `../src` via a Vite alias (no publish needed for the demo build).

### Run locally

From the repo root:

```bash
npm run demo:dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

To produce a production build of the library **and** the demo:

```bash
npm run demo:build
npm run demo:preview   # optional local check of demo/dist
```

### Deploy with GitHub Actions

1. Push this repo to GitHub (default branch **`main`** or **`master`** — both are wired in the workflow).
2. Open **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions** (not “Deploy from a branch”).
4. The workflow **Deploy demo to GitHub Pages** (`.github/workflows/deploy-pages.yml`) builds the library, builds `demo/` with the correct asset **`base`** path (`/<repository-name>/`), and publishes **`demo/dist`** to Pages.
5. After the first successful run, Pages shows your demo URL (typically `https://<user>.github.io/<repo>/`).

The demo’s “View on GitHub” link is set at build time via **`VITE_REPO_URL`** in the workflow. For local dev you can add a **`demo/.env`** file:

```bash
VITE_REPO_URL=https://github.com/you/react-stopwatch-pro
```

## Library development

```bash
npm install
npm run build      # tsup → dist/
npm run typecheck
npm run test       # Vitest + Testing Library
npm run test:watch
npm run dev        # tsup --watch
```

## License

MIT
