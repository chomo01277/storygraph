"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import type { Story } from "@/lib/types";
import { StepHeader, TextArea, Toggle } from "@/components/ui/kit";

const MODELS = [
  { id: "claude-opus-4-6", name: "Claude Opus 4.6", stars: 72, desc: "Richest prose, deepest reasoning. Our pick.", tag: "NEW" },
  { id: "claude-sonnet-4-6", name: "Claude Sonnet 4.6", stars: 30, desc: "Balanced speed and quality." },
  { id: "claude-haiku-4-5", name: "Claude Haiku 4.5", stars: 10, desc: "Fast and lightweight." },
];

const PLACEHOLDER = `e.g.
1. GENRE
After awakening, {user} is suddenly attacked by classmates and must survive using a regression power. School action / thriller / loop.

2. CORE SETTING
1) {user}'s power: DEATH LOOP. On death, keep memories and return to the save point. Max 10 loops.
2) The classmates: all 30 are highly trained killing weapons.

3. NARRATION STYLE
1) Second person, from {user}'s POV.   2) Terse, hardboiled prose.

4. RESPONSE RULES
1) Obey the loop mechanic. 2) The school is sealed; don't force impossible areas.`;

export default function WorldviewPanel({ story }: { story: Story }) {
  const patchStory = useStore((s) => s.patchStory);
  const [tab, setTab] = useState<"basic" | "ending">("basic");

  return (
    <div className="mx-auto max-w-3xl space-y-7 p-7">
      <StepHeader title="Worldview" ko="세계관">
        Write the world, background, story-progression method and rules. The AI references this to
        run the episode the way you, the Director, intend.
      </StepHeader>

      <div className="flex gap-5 text-sm font-semibold">
        <button onClick={() => setTab("basic")} className={tab === "basic" ? "text-ink" : "text-fainter hover:text-faint"}>
          Basic Prompt · 기본 프롬프트
        </button>
        <button onClick={() => setTab("ending")} className={tab === "ending" ? "text-ink" : "text-fainter hover:text-faint"}>
          Ending Prompt · 엔딩 프롬프트
        </button>
      </div>

      {tab === "basic" ? (
        <div>
          <TextArea
            rows={16}
            value={story.worldview}
            placeholder={PLACEHOLDER}
            onChange={(e) => patchStory(story.id, { worldview: e.target.value })}
          />
          <p className="mt-1.5 text-right text-xs text-fainter">{story.worldview.length} / 3000</p>
        </div>
      ) : (
        <div>
          <p className="mb-2 text-xs text-faint">Applied to free-play after an ending. Leave empty to keep the base worldview.</p>
          <TextArea
            rows={10}
            value={story.endingPrompt}
            placeholder="Worldview to swap in after the ending…"
            onChange={(e) => patchStory(story.id, { endingPrompt: e.target.value })}
          />
        </div>
      )}

      <div>
        <h3 className="text-base font-bold">Recommended AI Model · 추천 AI 모델</h3>
        <p className="mt-1 text-xs text-faint">The default model the protagonist plays with. Changeable mid-play.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {MODELS.map((m) => {
            const active = story.model === m.id;
            return (
              <button
                key={m.id}
                onClick={() => patchStory(story.id, { model: m.id })}
                className={`rounded-xl border p-3.5 text-left transition-colors ${
                  active ? "border-blue/70 bg-blue/10" : "border-line bg-canvas hover:border-line-strong"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-ink">{m.name}</span>
                  {m.tag && <span className="rounded bg-blue px-1.5 py-0.5 text-[9px] font-bold text-white">{m.tag}</span>}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-faint">{m.desc}</p>
                <p className="mt-2 text-[11px] text-fainter">⭐ {m.stars} / scene</p>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-base font-bold">Advanced Settings · 고급 설정</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Toggle
            checked={story.advanced.minimizeProtagonistDialogue}
            onChange={(v) => patchStory(story.id, { advanced: { ...story.advanced, minimizeProtagonistDialogue: v } })}
            title="Minimize protagonist dialogue"
            desc="주인공 대사 최소화 — let the world react instead of speaking for the player."
          />
          <Toggle
            checked={story.advanced.randomDice}
            onChange={(v) => patchStory(story.id, { advanced: { ...story.advanced, randomDice: v } })}
            title="Random dice"
            desc="랜덤 주사위 — uncertain actions resolve as risky rolls."
          />
        </div>
      </div>
    </div>
  );
}
