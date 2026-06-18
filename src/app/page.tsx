"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

export default function Dashboard() {
  const router = useRouter();
  const hydrated = useStore((s) => s.hydrated);
  const stories = useStore((s) => s.stories);
  const createStory = useStore((s) => s.createStory);
  const deleteStory = useStore((s) => s.deleteStory);

  const list = Object.values(stories).sort((a, b) => b.updatedAt - a.updatedAt);

  const onCreate = () => router.push(`/studio/${createStory()}`);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-7">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-lg shadow-[0_6px_20px_-6px_rgba(188,30,81,0.8)]">
              📖
            </span>
            <h1 className="text-2xl font-bold tracking-tight">StoryGraph</h1>
            <span className="ml-1 rounded-full border border-blue/40 bg-blue/10 px-2.5 py-0.5 text-[11px] font-semibold text-blue-bright">
              Claude Opus 4.6
            </span>
          </div>
          <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-faint">
            Design branching story games as a visual node graph, then play them
            like a visual novel — narrated live by AI.
          </p>
        </div>
        <button
          onClick={onCreate}
          className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow transition-colors hover:bg-primary-bright"
        >
          + New Story
        </button>
      </header>

      {!hydrated ? (
        <div className="grid grid-cols-1 gap-4 pt-8 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-44 animate-pulse rounded-2xl border border-line bg-surface" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 pt-8 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s) => (
            <div
              key={s.id}
              className="group relative flex flex-col rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-line-strong"
            >
              <button
                onClick={() => {
                  if (confirm(`Delete "${s.title}"?`)) deleteStory(s.id);
                }}
                className="absolute right-3 top-3 hidden h-7 w-7 place-items-center rounded-lg text-faint hover:bg-elevated hover:text-ink group-hover:grid"
                aria-label="Delete story"
              >
                ✕
              </button>
              <div className="text-3xl">{s.emoji}</div>
              <h3 className="mt-3 line-clamp-1 text-lg font-semibold">{s.title}</h3>
              <p className="mt-1 line-clamp-2 min-h-[2.5rem] text-[13px] leading-relaxed text-faint">
                {s.description || "No description yet."}
              </p>
              <div className="mt-3 flex items-center gap-3 text-[11px] text-fainter">
                <span>{s.nodes.length} events</span>
                <span>•</span>
                <span>{s.edges.length} links</span>
              </div>
              <div className="mt-4 flex gap-2">
                <Link
                  href={`/play/${s.id}`}
                  className="flex-1 rounded-lg bg-primary px-3 py-2 text-center text-[13px] font-semibold text-white transition-colors hover:bg-primary-bright"
                >
                  ▶ Play
                </Link>
                <Link
                  href={`/studio/${s.id}`}
                  className="flex-1 rounded-lg border border-line bg-panel px-3 py-2 text-center text-[13px] font-semibold text-muted transition-colors hover:border-line-strong hover:text-ink"
                >
                  ✎ Edit
                </Link>
              </div>
            </div>
          ))}

          <button
            onClick={onCreate}
            className="grid min-h-[11rem] place-items-center rounded-2xl border border-dashed border-line text-faint transition-colors hover:border-blue/50 hover:text-blue-bright"
          >
            <span className="flex flex-col items-center gap-2">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-blue text-2xl text-white">
                +
              </span>
              <span className="text-sm font-medium">Create a new story</span>
            </span>
          </button>
        </div>
      )}
    </main>
  );
}
