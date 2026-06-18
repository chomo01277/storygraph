# StoryGraph — Design Doc

> Build interactive story games visually. Play them like a game.
> Hackathon prototype — 2026-06-18. Powered by Claude Opus 4.6.

## 1. Vision

StoryGraph is a two-in-one tool for AI-driven interactive fiction:

1. **Creator** — design a branching story as a visual **node graph** (Prologue → Events → Endings). Drag nodes, connect them, and write each scene's *trigger* and *director's direction*. Define a **Worldview** (the system prompt: genre, characters, rules).
2. **Player** — *play* the story like a visual novel. An AI game-master (Claude Opus 4.6) narrates each scene from your worldview, you make choices or type free actions, and the story streams back in real time, branching through the graph you built.

The pitch: **anyone can author an AI-driven interactive novel in minutes, and anyone can play it.**

## 2. The two modes

### Creator (`/studio/[id]`)
A guided 5-step pipeline: **Worldview → Characters → Media → Events → Publish.**
- **Node graph canvas** (React Flow): `Prologue`, `Main/Sub Event`, `Main/Sub Ending` node types. Drag to reposition, drag handles to connect.
- **Event panel** (click a node): edit Title, **Trigger** (the condition that starts this beat) and **Director's Scene** (narration + beats, one line = one frame, with `{bg::}` / `{media::}` assets).
- **Worldview**: the Basic Prompt (genre, core setting, narration style, rules) + optional Ending Prompt + model picker + advanced toggles.
- Autosaves to `localStorage` (no backend DB needed for the demo).

### Player (`/play/[id]`)
- Visual-novel UI: streamed narration in second person, the current scene title, and **choice chips** the AI proposes (+ a free-text "what do you do?" box).
- **Graph-driven progression**: finishing an event follows its outgoing edges. A branch (multiple edges) shows a "where does the story go?" picker.
- Ending nodes show the finale + "play again."

## 3. Data model (`src/lib/types.ts`)

```ts
type NodeKind = 'prologue' | 'main_event' | 'sub_event' | 'main_ending' | 'sub_ending';

interface StoryNode { id; kind; title; trigger; scene; position }
interface StoryEdge { id; source; target }

interface Story {
  id; title; description; emoji;
  worldview;            // Basic Prompt → system prompt
  endingPrompt; model;  // 'claude-opus-4-6'
  advanced;             // minimizeProtagonistDialogue, randomDice
  characters; assets;   // roster + media
  nodes; edges;
  publish;              // metadata
  createdAt; updatedAt;
}
```

State lives in a Zustand store persisted to `localStorage`. Ships with one **seed story** (a death-loop thriller) so it's demoable instantly.

## 4. LLM integration

StoryGraph calls Claude via the **Anthropic SDK**, model **`claude-opus-4-6`**, streamed to the client over **SSE**:

- `POST /api/play` → a server route handler opens `anthropic.messages.stream(...)` and relays text deltas as SSE.
- The route reads `ANTHROPIC_API_KEY` + `CLAUDE_MODEL` from a **gitignored** `.env.local`.
- **No secrets in the repo** — only `.env.example` placeholders.
- **Mock fallback**: if no key is configured, the route streams a worldview-aware canned narration, so the full UX is demoable offline and never hard-crashes. Drop in a real key → real Claude Opus 4.6.

> **Vertex AI (optional):** the same streaming relay works against Google Vertex AI using the public `@anthropic-ai/vertex-sdk` (`AnthropicVertex`) with a service-account JSON — a one-client swap in `src/lib/llm.ts`.

### Prompt shape
- **System** = Worldview (Basic Prompt) + character roster + current node's trigger & scene direction + narration rules.
- **Messages** = running transcript (player actions ↔ AI narration). Node transitions inject a short "(the story now moves to: …)" note so context stays continuous.
- The AI ends each turn with `CHOICES: a | b | c`, parsed client-side into choice chips (free text still works).

## 5. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (App Router, TS) | One repo, one `npm run dev`, API routes for SSE |
| Node editor | React Flow (`@xyflow/react`) | The visual graph is the centerpiece; drag-connect out of the box |
| State | Zustand + `persist` | Tiny, localStorage persistence, no backend needed |
| Styling | Tailwind v4 | Fast dark UI |
| LLM | `@anthropic-ai/sdk`, streamed via SSE | Vertex-swappable |

## 6. File map

```
src/
  app/
    page.tsx                 # dashboard: story list + "new"
    studio/[id]/page.tsx     # Creator (5-step pipeline)
    play/[id]/page.tsx       # Player
    api/play/route.ts        # SSE streaming endpoint (Claude + mock fallback)
    layout.tsx, globals.css  # dark theme
  components/
    creator/  FlowEditor, EventNode, EventPanel, Worldview/Characters/Media/Events/Publish panels
    player/   PlayScreen
    ui/       shared kit
  lib/  types, store, sample, llm, prompt
```

## 7. Scope (2 hours)

**MVP (built):** dashboard • 5-step node-graph creator with editable events, worldview, characters, media, publish • player with streamed AI narration, choice chips, graph branching • seed story • mock fallback • public repo, no secrets, README.

**Stretch:** real asset uploads • multiple-ending polish • export/import story JSON • model picker live-swap • Vertex provider toggle.

**Out of scope:** auth, real DB, image generation, mobile app.
