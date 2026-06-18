"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { ChatMessage, Story, StoryNode } from "@/lib/types";
import { NODE_KIND_META } from "@/lib/types";
import { buildSystemPrompt, transitionNote, parseChoices, parseScene } from "@/lib/prompt";

type Phase = "title" | "scene" | "play" | "branch" | "end";

export default function PlayScreen({ story }: { story: Story }) {
  const prologue = useMemo(
    () => story.nodes.find((n) => n.kind === "prologue") ?? story.nodes[0],
    [story.nodes]
  );

  const [phase, setPhase] = useState<Phase>("title");
  const [playerName, setPlayerName] = useState("You");
  const [nodeId, setNodeId] = useState(prologue?.id ?? "");
  const [frames, setFrames] = useState<ReturnType<typeof parseScene>>([]);
  const [frameIdx, setFrameIdx] = useState(0);
  const [bg, setBg] = useState<string | undefined>();
  const [prose, setProse] = useState("");
  const [choices, setChoices] = useState<string[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [input, setInput] = useState("");
  const messagesRef = useRef<ChatMessage[]>([]);

  const node = story.nodes.find((n) => n.id === nodeId) ?? prologue;
  const assetUrl = useCallback(
    (name?: string) => (name ? story.assets.find((a) => a.name === name)?.url : undefined),
    [story.assets]
  );
  const outEdges = useMemo(
    () => story.edges.filter((e) => e.source === nodeId),
    [story.edges, nodeId]
  );

  // ── Streaming AI turn ──────────────────────────────────────
  const runTurn = useCallback(
    async (forNode: StoryNode, userText?: string) => {
      const msgs = [...messagesRef.current];
      if (userText !== undefined) msgs.push({ role: "user", content: userText });
      messagesRef.current = msgs;

      setStreaming(true);
      setProse("");
      setChoices([]);

      let acc = "";
      try {
        const res = await fetch("/api/play", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system: buildSystemPrompt(story, forNode, playerName),
            messages: msgs,
            model: story.model,
          }),
        });
        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop() ?? "";
          for (const part of parts) {
            const line = part.trim();
            if (!line.startsWith("data:")) continue;
            const payload = JSON.parse(line.slice(5).trim());
            if (payload.text) {
              acc += payload.text;
              setProse(parseChoices(acc).prose);
            }
          }
        }
      } catch {
        acc += "\n\n*(The connection faltered. Try again.)*";
      }

      const { prose: finalProse, choices: finalChoices } = parseChoices(acc);
      messagesRef.current = [...msgs, { role: "assistant", content: acc }];
      setProse(finalProse);
      setChoices(finalChoices);
      setStreaming(false);
    },
    [story, playerName]
  );

  // ── Scene (Director's Scene) playback ──────────────────────
  const enterPlay = useCallback(
    (forNode: StoryNode, firstTurn: boolean) => {
      setPhase("play");
      if (firstTurn) {
        const note =
          forNode.kind === "prologue"
            ? "(Begin the scene now and make it interactive.)"
            : transitionNote(forNode, playerName);
        runTurn(forNode, note);
      }
    },
    [playerName, runTurn]
  );

  const beginNode = useCallback(
    (target: StoryNode) => {
      setNodeId(target.id);
      const f = parseScene(target.scene, playerName);
      if (f.length === 0) {
        enterPlay(target, true);
        return;
      }
      setFrames(f);
      setFrameIdx(0);
      setBg(assetUrl(f[0].bg ?? f[0].media) ?? bg);
      setPhase("scene");
    },
    [playerName, assetUrl, enterPlay, bg]
  );

  const advanceFrame = useCallback(() => {
    const next = frameIdx + 1;
    if (next >= frames.length) {
      enterPlay(node!, true);
      return;
    }
    setFrameIdx(next);
    const f = frames[next];
    const url = assetUrl(f.bg ?? f.media);
    if (url) setBg(url);
  }, [frameIdx, frames, node, enterPlay, assetUrl]);

  // ── Graph progression ──────────────────────────────────────
  const continueStory = useCallback(() => {
    if (outEdges.length === 0) {
      setPhase("end");
    } else if (outEdges.length === 1) {
      const target = story.nodes.find((n) => n.id === outEdges[0].target);
      if (target) beginNode(target);
      else setPhase("end");
    } else {
      setPhase("branch");
    }
  }, [outEdges, story.nodes, beginNode]);

  const start = () => {
    messagesRef.current = [];
    if (prologue) beginNode(prologue);
  };
  const restart = () => {
    messagesRef.current = [];
    setProse("");
    setChoices([]);
    setBg(undefined);
    setPhase("title");
    setNodeId(prologue?.id ?? "");
  };

  const branchTargets = outEdges
    .map((e) => story.nodes.find((n) => n.id === e.target))
    .filter(Boolean) as StoryNode[];

  const isEnding = node?.kind === "main_ending" || node?.kind === "sub_ending";

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black text-ink">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: bg ? `url(${bg})` : undefined,
          backgroundColor: bg ? undefined : "#141517",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />

      {/* HUD */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center gap-3 p-4">
        <Link
          href={`/studio/${story.id}`}
          className="rounded-lg bg-black/40 px-3 py-1.5 text-sm text-muted backdrop-blur transition-colors hover:text-ink"
        >
          ← Studio
        </Link>
        <span className="rounded-lg bg-black/40 px-3 py-1.5 text-sm font-semibold backdrop-blur">
          {story.emoji} {story.title}
        </span>
        {node && phase !== "title" && (
          <span className="rounded-full border border-blue/40 bg-blue/10 px-2.5 py-1 text-[11px] font-semibold text-blue-bright backdrop-blur">
            {NODE_KIND_META[node.kind].icon} {node.title}
          </span>
        )}
        <button
          onClick={restart}
          className="ml-auto rounded-lg bg-black/40 px-3 py-1.5 text-sm text-muted backdrop-blur transition-colors hover:text-ink"
        >
          ↻ Restart
        </button>
      </div>

      {/* TITLE */}
      {phase === "title" && (
        <div className="absolute inset-0 z-10 grid place-items-center p-6">
          <div className="w-full max-w-md rounded-3xl border border-line bg-surface/90 p-8 text-center backdrop-blur">
            <div className="text-5xl">{story.emoji}</div>
            <h1 className="mt-4 text-2xl font-bold">{story.title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-faint">{story.description}</p>
            <div className="mt-6 text-left">
              <label className="mb-1.5 block text-[13px] font-semibold text-muted">
                Your name (the protagonist)
              </label>
              <input
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value || "You")}
                className="w-full rounded-xl border border-line-strong bg-canvas px-3.5 py-2.5 text-sm outline-none focus:border-blue"
              />
            </div>
            <button
              onClick={start}
              className="mt-5 w-full rounded-xl bg-primary py-3 text-sm font-bold text-white transition-colors hover:bg-primary-bright"
            >
              ▶ Begin Story
            </button>
            <p className="mt-3 text-[11px] text-fainter">Narrated by {story.model}</p>
          </div>
        </div>
      )}

      {/* SCENE — authored Director's Scene frames */}
      {phase === "scene" && (
        <button
          onClick={advanceFrame}
          className="absolute inset-0 z-10 flex cursor-pointer flex-col justify-end p-6 text-left"
        >
          {frames[frameIdx]?.text && (
            <div className="mx-auto w-full max-w-3xl rounded-2xl border border-white/10 bg-black/55 p-6 backdrop-blur-sm">
              <p className="text-lg leading-relaxed">{frames[frameIdx].text}</p>
            </div>
          )}
          <p className="mt-4 text-center text-xs text-white/50">tap to continue ›</p>
        </button>
      )}

      {/* PLAY — interactive AI narration */}
      {phase === "play" && (
        <div className="absolute inset-x-0 bottom-0 z-10 p-6">
          <div className="mx-auto w-full max-w-3xl">
            <div className="max-h-[46vh] overflow-y-auto rounded-2xl border border-white/10 bg-black/60 p-6 backdrop-blur-sm">
              <p className="prose-narration whitespace-pre-wrap text-[15px] leading-relaxed">
                {prose}
                {streaming && <span className="ml-0.5 animate-pulse">▋</span>}
              </p>
            </div>

            {!streaming && (
              <div className="mt-3 space-y-3">
                {choices.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {choices.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => runTurn(node!, c)}
                        className="rounded-xl border border-blue/40 bg-blue/10 px-3.5 py-2 text-left text-sm text-blue-bright transition-colors hover:bg-blue/20"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && input.trim()) {
                        runTurn(node!, input.trim());
                        setInput("");
                      }
                    }}
                    placeholder="…or type what you do"
                    className="flex-1 rounded-xl border border-line-strong bg-black/50 px-4 py-2.5 text-sm outline-none backdrop-blur focus:border-blue"
                  />
                  <button
                    onClick={() => {
                      if (input.trim()) {
                        runTurn(node!, input.trim());
                        setInput("");
                      }
                    }}
                    className="rounded-xl bg-elevated px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-line-strong"
                  >
                    Send
                  </button>
                  <button
                    onClick={continueStory}
                    className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-bright"
                  >
                    {isEnding ? "Finish ▸" : "Continue ▸"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* BRANCH — choose the next event */}
      {phase === "branch" && (
        <div className="absolute inset-0 z-10 grid place-items-center p-6">
          <div className="w-full max-w-lg rounded-3xl border border-line bg-surface/90 p-8 backdrop-blur">
            <h2 className="text-center text-lg font-bold">Where does the story go?</h2>
            <div className="mt-5 space-y-3">
              {branchTargets.map((t) => (
                <button
                  key={t.id}
                  onClick={() => beginNode(t)}
                  className="flex w-full items-center gap-3 rounded-xl border border-line bg-canvas p-4 text-left transition-colors hover:border-blue/60 hover:bg-blue/5"
                >
                  <span className="text-lg">{NODE_KIND_META[t.kind].icon}</span>
                  <span>
                    <span className="block text-sm font-semibold">{t.title}</span>
                    <span className="mt-0.5 block text-xs text-faint">{t.trigger}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* END */}
      {phase === "end" && (
        <div className="absolute inset-0 z-10 grid place-items-center p-6">
          <div className="w-full max-w-md rounded-3xl border border-line bg-surface/90 p-8 text-center backdrop-blur">
            <div className="text-4xl">{node ? NODE_KIND_META[node.kind].icon : "🏁"}</div>
            <h2 className="mt-4 text-2xl font-bold">The End</h2>
            <p className="mt-1 text-sm text-faint">{node?.title}</p>
            <div className="mt-6 flex gap-2">
              <button
                onClick={restart}
                className="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-white transition-colors hover:bg-primary-bright"
              >
                ↻ Play again
              </button>
              <Link
                href="/"
                className="flex-1 rounded-xl border border-line bg-panel py-3 text-center text-sm font-semibold text-muted transition-colors hover:text-ink"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
