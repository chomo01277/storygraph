"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { STUDIO_STEPS, type StudioStepKey } from "@/lib/types";
import WorldviewPanel from "@/components/creator/WorldviewPanel";
import CharactersPanel from "@/components/creator/CharactersPanel";
import MediaPanel from "@/components/creator/MediaPanel";
import EventsPanel from "@/components/creator/EventsPanel";
import PublishPanel from "@/components/creator/PublishPanel";

export default function StudioPage() {
  const { id } = useParams<{ id: string }>();
  const hydrated = useStore((s) => s.hydrated);
  const story = useStore((s) => s.stories[id]);
  const [step, setStep] = useState<StudioStepKey>("worldview");

  // Deep-linkable steps: /studio/[id]?step=events
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("step");
    if (p && STUDIO_STEPS.some((s) => s.key === p)) setStep(p as StudioStepKey);
  }, []);

  if (!hydrated)
    return <div className="grid h-screen place-items-center text-sm text-faint">Loading…</div>;
  if (!story)
    return (
      <div className="grid h-screen place-items-center text-sm text-faint">
        Story not found.{" "}
        <Link href="/" className="ml-1 text-blue-bright underline">
          Back to dashboard
        </Link>
      </div>
    );

  return (
    <div className="flex h-screen flex-col bg-canvas">
      <header className="flex items-center gap-3 border-b border-line px-4 py-3">
        <Link
          href="/"
          className="grid h-8 w-8 place-items-center rounded-lg text-faint transition-colors hover:bg-elevated hover:text-ink"
        >
          ←
        </Link>
        <span className="text-xl">{story.emoji}</span>
        <span className="font-semibold">{story.title || "Untitled Story"}</span>
        <span className="rounded-full border border-blue/40 bg-blue/10 px-2 py-0.5 text-[11px] font-semibold text-blue-bright">
          {story.model}
        </span>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-[11px] text-fainter">● Autosaved</span>
          <Link
            href={`/play/${id}`}
            className="rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-bright"
          >
            ▶ Play test
          </Link>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <nav className="w-56 shrink-0 space-y-1 border-r border-line p-3">
          {STUDIO_STEPS.map((s, i) => (
            <button
              key={s.key}
              onClick={() => setStep(s.key)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                step === s.key ? "bg-primary/15 text-ink" : "text-faint hover:bg-elevated hover:text-ink"
              }`}
            >
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                  step === s.key ? "bg-primary text-white" : "bg-elevated text-fainter"
                }`}
              >
                {i + 1}
              </span>
              <span>
                <span className="font-semibold">{s.label}</span>
                <span className="ml-1 text-[11px] text-fainter">{s.ko}</span>
              </span>
            </button>
          ))}
        </nav>

        <main className="min-w-0 flex-1 overflow-hidden bg-canvas">
          {step === "events" ? (
            <EventsPanel story={story} />
          ) : (
            <div className="h-full overflow-y-auto">
              {step === "worldview" && <WorldviewPanel story={story} />}
              {step === "characters" && <CharactersPanel story={story} />}
              {step === "media" && <MediaPanel story={story} />}
              {step === "publish" && <PublishPanel story={story} />}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
