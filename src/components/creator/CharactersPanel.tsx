"use client";

import { nanoid } from "nanoid";
import { useStore } from "@/lib/store";
import type { Story } from "@/lib/types";
import { StepHeader, TextInput, TextArea } from "@/components/ui/kit";

export default function CharactersPanel({ story }: { story: Story }) {
  const addCharacter = useStore((s) => s.addCharacter);
  const patchCharacter = useStore((s) => s.patchCharacter);
  const removeCharacter = useStore((s) => s.removeCharacter);

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-7">
      <StepHeader title="Characters" ko="캐릭터">
        Define the NPCs and entities the protagonist meets. Their description shapes how the AI
        voices them. Mark one as the Main character; the rest are Sub.
      </StepHeader>

      {story.characters.length === 0 && (
        <div className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-faint">
          No characters yet. Add the people your protagonist will meet.
        </div>
      )}

      <div className="space-y-4">
        {story.characters.map((c) => (
          <div key={c.id} className="rounded-2xl border border-line bg-surface p-5">
            <div className="flex items-start gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full border border-line bg-canvas text-lg">
                {c.images[0]?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.images[0].url} alt="" className="h-full w-full object-cover" />
                ) : (
                  "👤"
                )}
              </div>
              <div className="flex-1">
                <div className="flex gap-2">
                  <TextInput
                    value={c.name}
                    placeholder="Character name"
                    onChange={(e) => patchCharacter(story.id, c.id, { name: e.target.value })}
                  />
                  <div className="flex shrink-0 overflow-hidden rounded-lg border border-line">
                    {(["main", "sub"] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => patchCharacter(story.id, c.id, { role: r })}
                        className={`px-3 py-2 text-xs font-semibold capitalize transition-colors ${
                          c.role === r ? "bg-primary text-white" : "bg-canvas text-faint hover:text-ink"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeCharacter(story.id, c.id)}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-faint hover:bg-elevated hover:text-ink"
                aria-label="Remove character"
              >
                ✕
              </button>
            </div>

            <div className="mt-3">
              <TextArea
                rows={3}
                value={c.description}
                placeholder="Appearance, personality, speech patterns, background…"
                onChange={(e) => patchCharacter(story.id, c.id, { description: e.target.value })}
              />
            </div>

            <div className="mt-3">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[12px] font-semibold text-muted">Status images · 상태 이미지</span>
                <button
                  onClick={() =>
                    patchCharacter(story.id, c.id, {
                      images: [...c.images, { id: nanoid(6), state: "", url: "" }],
                    })
                  }
                  className="text-[12px] font-semibold text-blue-bright hover:underline"
                >
                  + add state
                </button>
              </div>
              <div className="space-y-2">
                {c.images.map((img, i) => (
                  <div key={img.id} className="flex gap-2">
                    <TextInput
                      value={img.state}
                      placeholder="state (e.g. smiling)"
                      className="!w-40 shrink-0"
                      onChange={(e) => {
                        const images = [...c.images];
                        images[i] = { ...img, state: e.target.value };
                        patchCharacter(story.id, c.id, { images });
                      }}
                    />
                    <TextInput
                      value={img.url}
                      placeholder="image URL"
                      onChange={(e) => {
                        const images = [...c.images];
                        images[i] = { ...img, url: e.target.value };
                        patchCharacter(story.id, c.id, { images });
                      }}
                    />
                    <button
                      onClick={() =>
                        patchCharacter(story.id, c.id, {
                          images: c.images.filter((x) => x.id !== img.id),
                        })
                      }
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-faint hover:bg-elevated hover:text-ink"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => addCharacter(story.id)}
        className="w-full rounded-xl border border-dashed border-line py-3 text-sm font-semibold text-faint transition-colors hover:border-blue/50 hover:text-blue-bright"
      >
        + Add character
      </button>
    </div>
  );
}
