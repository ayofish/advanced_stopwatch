import { Stopwatch } from "advanced-stopwatch";

const repoUrl =
  import.meta.env.VITE_REPO_URL ??
  "https://github.com/YOUR_USERNAME/advanced-stopwatch";

export function App() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl flex-col gap-2 px-4 py-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
              Demo
            </p>
            <h1 className="text-2xl font-bold tracking-tight">advanced-stopwatch</h1>
            <p className="mt-1 max-w-xl text-sm text-slate-600">
              React stopwatch with laps, merge/delete, manual time override, and swipe hints on
              mobile.
            </p>
          </div>
          <a
            href={repoUrl}
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            View on GitHub
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <Stopwatch className="mx-auto" />
        </div>
        <p className="mt-8 text-center text-xs text-slate-500">
          Install via npm:{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-700">
            npm install advanced-stopwatch
          </code>
        </p>
      </main>
    </div>
  );
}
