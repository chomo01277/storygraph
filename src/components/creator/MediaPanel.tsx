"use client";

import { useStore } from "@/lib/store";
import type { Asset, Story } from "@/lib/types";
import { StepHeader, TextInput } from "@/components/ui/kit";

const TYPES: { id: Asset["type"]; label: string; token: string }[] = [
  { id: "background", label: "Background", token: "{bg::name}" },
  { id: "situation", label: "Situation", token: "{media::name}" },
  { id: "video", label: "Video", token: "{media::name}" },
];

export default function MediaPanel({ story }: { story: Story }) {
  const addAsset = useStore((s) => s.addAsset);
  const patchAsset = useStore((s) => s.patchAsset);
  const removeAsset = useStore((s) => s.removeAsset);

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-7">
      <StepHeader title="Media" ko="미디어">
        Register background and situation assets. Reference them inside a Director&apos;s Scene as{" "}
        <code className="rounded bg-canvas px-1.5 py-0.5 text-[12px] text-blue-bright">{"{bg::name}"}</code>{" "}
        or{" "}
        <code className="rounded bg-canvas px-1.5 py-0.5 text-[12px] text-blue-bright">{"{media::name}"}</code>.
        The AI auto-selects matching assets by context.
      </StepHeader>

      {story.assets.length === 0 && (
        <div className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-faint">
          No media yet. Add a background to set the scene.
        </div>
      )}

      <div className="space-y-3">
        {story.assets.map((a) => (
          <div key={a.id} className="flex gap-3 rounded-2xl border border-line bg-surface p-4">
            <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-lg border border-line bg-canvas text-xl">
              {a.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.url} alt="" className="h-full w-full object-cover" />
              ) : (
                "🖼"
              )}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <TextInput
                  value={a.name}
                  placeholder="asset name (used as {bg::name})"
                  onChange={(e) =>
                    patchAsset(story.id, a.id, { name: e.target.value.replace(/\s+/g, "_") })
                  }
                />
                <select
                  value={a.type}
                  onChange={(e) => patchAsset(story.id, a.id, { type: e.target.value as Asset["type"] })}
                  className="shrink-0 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none focus:border-blue"
                >
                  {TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <TextInput
                value={a.url}
                placeholder="image / video URL"
                onChange={(e) => patchAsset(story.id, a.id, { url: e.target.value })}
              />
            </div>
            <button
              onClick={() => removeAsset(story.id, a.id)}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-faint hover:bg-elevated hover:text-ink"
              aria-label="Remove asset"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={() => addAsset(story.id)}
        className="w-full rounded-xl border border-dashed border-line py-3 text-sm font-semibold text-faint transition-colors hover:border-blue/50 hover:text-blue-bright"
      >
        + Add media
      </button>
    </div>
  );
}
