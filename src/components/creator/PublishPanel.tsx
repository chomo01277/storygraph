"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import type { PublishMeta, Story } from "@/lib/types";
import { StepHeader, Label, TextInput, TextArea } from "@/components/ui/kit";

const AGES: { id: PublishMeta["ageRating"]; label: string }[] = [
  { id: "all", label: "All" },
  { id: "12", label: "12+" },
  { id: "15", label: "15+" },
  { id: "18", label: "18+" },
];

export default function PublishPanel({ story }: { story: Story }) {
  const patchStory = useStore((s) => s.patchStory);
  const [genre, setGenre] = useState("");
  const setPub = (patch: Partial<PublishMeta>) =>
    patchStory(story.id, { publish: { ...story.publish, ...patch } });

  const checklist = [
    { ok: story.worldview.trim().length > 0, label: "Basic prompt written" },
    { ok: (story.nodes.find((n) => n.kind === "prologue")?.scene.trim().length ?? 0) > 0, label: "Prologue directed" },
    { ok: story.assets.some((a) => a.type === "background" && a.url), label: "≥1 background image" },
    { ok: story.title.trim().length > 0, label: "Title & description set" },
  ];
  const ready = checklist.every((c) => c.ok);

  const addGenre = () => {
    const g = genre.trim();
    if (g && story.publish.genres.length < 3 && !story.publish.genres.includes(g)) {
      setPub({ genres: [...story.publish.genres, g] });
    }
    setGenre("");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-7">
      <StepHeader title="Publish" ko="발행">
        Set the metadata players see, then publish your episode.
      </StepHeader>

      <div className="flex gap-3">
        <div className="w-24 shrink-0">
          <Label>Emoji</Label>
          <TextInput
            value={story.emoji}
            maxLength={2}
            className="text-center text-xl"
            onChange={(e) => patchStory(story.id, { emoji: e.target.value })}
          />
        </div>
        <div className="flex-1">
          <Label required>Title</Label>
          <TextInput
            value={story.title}
            maxLength={60}
            onChange={(e) => patchStory(story.id, { title: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label required>Description</Label>
        <TextArea
          rows={2}
          value={story.description}
          placeholder="A one-line hook for players."
          onChange={(e) => patchStory(story.id, { description: e.target.value })}
        />
      </div>

      <div>
        <Label>Preview image URL</Label>
        <TextInput
          value={story.publish.previewImage}
          placeholder="https://…"
          onChange={(e) => setPub({ previewImage: e.target.value })}
        />
      </div>

      <div>
        <Label>Genre · up to 3</Label>
        <div className="flex flex-wrap items-center gap-2">
          {story.publish.genres.map((g) => (
            <span key={g} className="flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-[13px] font-medium text-primary-bright">
              {g}
              <button onClick={() => setPub({ genres: story.publish.genres.filter((x) => x !== g) })}>✕</button>
            </span>
          ))}
          {story.publish.genres.length < 3 && (
            <input
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addGenre())}
              onBlur={addGenre}
              placeholder="+ add genre"
              className="w-32 rounded-full border border-line bg-canvas px-3 py-1 text-[13px] text-ink outline-none focus:border-blue"
            />
          )}
        </div>
      </div>

      <div className="flex gap-8">
        <div>
          <Label>Age rating</Label>
          <div className="flex overflow-hidden rounded-lg border border-line">
            {AGES.map((a) => (
              <button
                key={a.id}
                onClick={() => setPub({ ageRating: a.id })}
                className={`px-3.5 py-2 text-xs font-semibold transition-colors ${
                  story.publish.ageRating === a.id ? "bg-primary text-white" : "bg-canvas text-faint hover:text-ink"
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label>Visibility</Label>
          <div className="flex overflow-hidden rounded-lg border border-line">
            {(["public", "private"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setPub({ visibility: v })}
                className={`px-3.5 py-2 text-xs font-semibold capitalize transition-colors ${
                  story.publish.visibility === v ? "bg-primary text-white" : "bg-canvas text-faint hover:text-ink"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-5">
        <h3 className="text-sm font-bold">Publish checklist</h3>
        <ul className="mt-3 space-y-2">
          {checklist.map((c) => (
            <li key={c.label} className="flex items-center gap-2.5 text-sm">
              <span className={`grid h-5 w-5 place-items-center rounded-full text-[11px] ${c.ok ? "bg-emerald-500 text-white" : "bg-line text-fainter"}`}>
                {c.ok ? "✓" : ""}
              </span>
              <span className={c.ok ? "text-muted" : "text-fainter"}>{c.label}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={() => setPub({ published: !story.publish.published })}
            disabled={!ready}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
              story.publish.published
                ? "border border-emerald-500/50 bg-emerald-500/15 text-emerald-300"
                : ready
                ? "bg-primary text-white hover:bg-primary-bright"
                : "cursor-not-allowed bg-line text-fainter"
            }`}
          >
            {story.publish.published ? "✓ Published" : "Publish episode"}
          </button>
          <Link
            href={`/play/${story.id}`}
            className="rounded-xl border border-blue/50 bg-blue/10 px-4 py-2.5 text-sm font-semibold text-blue-bright transition-colors hover:bg-blue/20"
          >
            ▶ Play test
          </Link>
        </div>
      </div>
    </div>
  );
}
