# 📖 StoryGraph

**Build interactive story games as a visual node graph — then play them like a visual novel, narrated live by Claude Opus 4.6.**

A hackathon prototype (built in ~2 hours). Authors design a branching story; players live it out, with an AI Director narrating every scene.

![Claude Opus 4.6](https://img.shields.io/badge/AI-Claude%20Opus%204.6-007aff) ![Next.js 15](https://img.shields.io/badge/Next.js-15-black) ![License MIT](https://img.shields.io/badge/license-MIT-bc1e51)

---

## What it does

### 🛠 Creator — a 5-step Studio
A guided creation pipeline:

1. **Worldview (세계관)** — the Basic Prompt (genre, setting, narration style, rules) that becomes the AI's system prompt, an AI-model picker, and Advanced Settings (*minimize protagonist dialogue*, *random dice*).
2. **Characters (캐릭터)** — main/sub characters with descriptions and status images.
3. **Media (미디어)** — background / situation / video assets, referenced in scenes as `{bg::name}` and `{media::name}`.
4. **Events (이벤트)** — a drag-and-connect **node graph** of `Prologue → Main/Sub Events → Main/Sub Endings`. Each event has a **Trigger** and a **Director's Scene (연출 씬)** (one line = one frame). Branch and loop freely.
5. **Publish (발행)** — title, description, preview image, genre tags, age rating, visibility, and a publish checklist.

### ▶ Player — play it like a game
- Plays each event's authored **Director's Scene** as a click-through cinematic (with background art).
- Then hands off to the **AI Director** (Claude Opus 4.6) for live, streamed, second-person narration.
- Make a move via **choice chips** or free text.
- **Graph-driven branching**: finishing an event follows its edges — multiple edges show a "where does the story go?" picker.

The bundled sample story, **"The Crimson Classroom,"** is playable immediately.

---

## Run it locally

```bash
npm install
cp .env.example .env.local      # optional — see below
npm run dev                     # → http://localhost:3000
```

### LLM configuration
StoryGraph calls Claude via the Anthropic SDK, streamed over SSE, using model **`claude-opus-4-6`**.

- **Demo mode (default):** with no key, the play endpoint streams a worldview-aware **mock** narrator — the entire app is fully playable offline. Perfect for screen recordings.
- **Live mode:** put a real key in `.env.local`:
  ```
  ANTHROPIC_API_KEY=sk-ant-...
  CLAUDE_MODEL=claude-opus-4-6
  ```

> **Vertex AI (optional):** you can route Claude through Google Vertex AI instead, using the public `@anthropic-ai/vertex-sdk` (`AnthropicVertex`) with a service-account JSON. It's a one-client swap in `src/lib/llm.ts`; the streaming relay is identical.

**No credentials are committed to this repo** — `.env.local` is gitignored; only `.env.example` placeholders ship.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript) |
| Node editor | React Flow (`@xyflow/react`) |
| State | Zustand + `persist` (localStorage — no backend DB) |
| Styling | Tailwind v4, dark theme |
| LLM | `@anthropic-ai/sdk`, streamed over SSE |

## Project layout

```
src/
  app/
    page.tsx              # dashboard (story list)
    studio/[id]/page.tsx  # 5-step creator
    play/[id]/page.tsx    # player
    api/play/route.ts     # SSE streaming endpoint (Claude + mock fallback)
  components/creator/      # FlowEditor, EventNode, EventPanel, Worldview/Characters/Media/Events/Publish panels
  components/player/        # PlayScreen
  lib/                      # types, store, sample story, prompt builder, llm client
```

See [`DESIGN.md`](./DESIGN.md) for the full design doc.

---

*Built as an original hackathon prototype.*
