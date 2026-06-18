// Node kinds for the story event graph.
export type NodeKind =
  | "prologue"
  | "main_event"
  | "sub_event"
  | "main_ending"
  | "sub_ending";

export interface StoryNode {
  id: string;
  kind: NodeKind;
  title: string;
  /** Event Trigger (이벤트 트리거) — the situation/condition that starts this event. */
  trigger: string;
  /** Director's Scene (연출 씬) — one line = one frame; supports {bg::name} / {media::name}. */
  scene: string;
  position: { x: number; y: number };
}

export interface StoryEdge {
  id: string;
  source: string;
  target: string;
}

/** Character (캐릭터) — main or sub. */
export interface Character {
  id: string;
  name: string;
  role: "main" | "sub";
  description: string;
  /** Status images (상태 이미지) keyed by state/emotion. */
  images: { id: string; state: string; url: string }[];
}

/** Media asset (에셋) — referenced in scenes as {bg::name} or {media::name}. */
export interface Asset {
  id: string;
  name: string;
  type: "background" | "situation" | "video";
  url: string;
  audioUrl?: string;
}

export interface AdvancedSettings {
  /** 주인공 대사 최소화 */
  minimizeProtagonistDialogue: boolean;
  /** 랜덤 주사위 사용 */
  randomDice: boolean;
}

export interface PublishMeta {
  previewImage: string;
  genres: string[];
  ageRating: "all" | "12" | "15" | "18";
  visibility: "public" | "private";
  published: boolean;
}

export interface Story {
  id: string;
  title: string;
  description: string;
  emoji: string;

  // STEP 1 — Worldview (세계관)
  worldview: string; // Basic Prompt (기본 프롬프트)
  endingPrompt: string;
  model: string; // AI model
  advanced: AdvancedSettings;

  // STEP 2 — Characters (캐릭터)
  characters: Character[];

  // STEP 3 — Media (미디어)
  assets: Asset[];

  // STEP 4 — Events (이벤트)
  nodes: StoryNode[];
  edges: StoryEdge[];

  // STEP 5 — Publish (발행)
  publish: PublishMeta;

  createdAt: number;
  updatedAt: number;
}

/** A single line in the play transcript. */
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const STUDIO_STEPS = [
  { key: "worldview", label: "Worldview", ko: "세계관", icon: "🌐" },
  { key: "characters", label: "Characters", ko: "캐릭터", icon: "👤" },
  { key: "media", label: "Media", ko: "미디어", icon: "🎬" },
  { key: "events", label: "Events", ko: "이벤트", icon: "🗺️" },
  { key: "publish", label: "Publish", ko: "발행", icon: "🚀" },
] as const;

export type StudioStepKey = (typeof STUDIO_STEPS)[number]["key"];

export const NODE_KIND_META: Record<
  NodeKind,
  { label: string; ko: string; icon: string; group: "main" | "sub" }
> = {
  prologue: { label: "PROLOGUE", ko: "프롤로그", icon: "📖", group: "main" },
  main_event: { label: "MAIN EVENT", ko: "메인 이벤트", icon: "📘", group: "main" },
  sub_event: { label: "SUB EVENT", ko: "서브 이벤트", icon: "📙", group: "sub" },
  main_ending: { label: "MAIN ENDING", ko: "메인 엔딩", icon: "🏁", group: "main" },
  sub_ending: { label: "SUB ENDING", ko: "서브 엔딩", icon: "🎴", group: "sub" },
};
