"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import type {
  Story,
  StoryNode,
  StoryEdge,
  NodeKind,
  Character,
  Asset,
} from "./types";
import { NODE_KIND_META } from "./types";
import { SAMPLE_STORY } from "./sample";

function blankStory(): Story {
  const t = Date.now();
  return {
    id: nanoid(10),
    title: "Untitled Story",
    description: "",
    emoji: "📖",
    worldview: "",
    endingPrompt: "",
    model: "claude-opus-4-6",
    advanced: { minimizeProtagonistDialogue: false, randomDice: false },
    characters: [],
    assets: [],
    nodes: [
      {
        id: nanoid(8),
        kind: "prologue",
        title: "Prologue",
        trigger: "",
        scene: "",
        position: { x: 0, y: 180 },
      },
    ],
    edges: [],
    publish: {
      previewImage: "",
      genres: [],
      ageRating: "all",
      visibility: "public",
      published: false,
    },
    createdAt: t,
    updatedAt: t,
  };
}

interface StoreState {
  stories: Record<string, Story>;
  hydrated: boolean;

  createStory: () => string;
  deleteStory: (id: string) => void;
  patchStory: (id: string, patch: Partial<Story>) => void;

  addNode: (storyId: string, kind: NodeKind) => string;
  patchNode: (storyId: string, nodeId: string, patch: Partial<StoryNode>) => void;
  removeNode: (storyId: string, nodeId: string) => void;
  setNodePositions: (storyId: string, positions: Record<string, { x: number; y: number }>) => void;
  setEdges: (storyId: string, edges: StoryEdge[]) => void;

  addCharacter: (storyId: string) => string;
  patchCharacter: (storyId: string, charId: string, patch: Partial<Character>) => void;
  removeCharacter: (storyId: string, charId: string) => void;

  addAsset: (storyId: string) => string;
  patchAsset: (storyId: string, assetId: string, patch: Partial<Asset>) => void;
  removeAsset: (storyId: string, assetId: string) => void;
}

function touch(stories: Record<string, Story>, id: string, mut: (s: Story) => void) {
  const s = stories[id];
  if (!s) return stories;
  const next = { ...s };
  mut(next);
  next.updatedAt = Date.now();
  return { ...stories, [id]: next };
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      stories: {},
      hydrated: false,

      createStory: () => {
        const story = blankStory();
        set((st) => ({ stories: { ...st.stories, [story.id]: story } }));
        return story.id;
      },

      deleteStory: (id) =>
        set((st) => {
          const next = { ...st.stories };
          delete next[id];
          return { stories: next };
        }),

      patchStory: (id, patch) =>
        set((st) => ({ stories: touch(st.stories, id, (s) => Object.assign(s, patch)) })),

      addNode: (storyId, kind) => {
        const id = nanoid(8);
        set((st) => ({
          stories: touch(st.stories, storyId, (s) => {
            const count = s.nodes.filter((n) => n.kind === kind).length + 1;
            const offset = s.nodes.length * 36;
            s.nodes = [
              ...s.nodes,
              {
                id,
                kind,
                title: `New ${NODE_KIND_META[kind].label.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())} ${count}`,
                trigger: "",
                scene: "",
                position: { x: 340 + offset, y: 400 + offset },
              },
            ];
          }),
        }));
        return id;
      },

      patchNode: (storyId, nodeId, patch) =>
        set((st) => ({
          stories: touch(st.stories, storyId, (s) => {
            s.nodes = s.nodes.map((n) => (n.id === nodeId ? { ...n, ...patch } : n));
          }),
        })),

      removeNode: (storyId, nodeId) =>
        set((st) => ({
          stories: touch(st.stories, storyId, (s) => {
            if (s.nodes.find((n) => n.id === nodeId)?.kind === "prologue") return;
            s.nodes = s.nodes.filter((n) => n.id !== nodeId);
            s.edges = s.edges.filter((e) => e.source !== nodeId && e.target !== nodeId);
          }),
        })),

      setNodePositions: (storyId, positions) =>
        set((st) => ({
          stories: touch(st.stories, storyId, (s) => {
            s.nodes = s.nodes.map((n) =>
              positions[n.id] ? { ...n, position: positions[n.id] } : n
            );
          }),
        })),

      setEdges: (storyId, edges) =>
        set((st) => ({ stories: touch(st.stories, storyId, (s) => (s.edges = edges)) })),

      addCharacter: (storyId) => {
        const id = nanoid(8);
        set((st) => ({
          stories: touch(st.stories, storyId, (s) => {
            s.characters = [
              ...s.characters,
              { id, name: "", role: s.characters.length === 0 ? "main" : "sub", description: "", images: [] },
            ];
          }),
        }));
        return id;
      },

      patchCharacter: (storyId, charId, patch) =>
        set((st) => ({
          stories: touch(st.stories, storyId, (s) => {
            s.characters = s.characters.map((c) => (c.id === charId ? { ...c, ...patch } : c));
          }),
        })),

      removeCharacter: (storyId, charId) =>
        set((st) => ({
          stories: touch(st.stories, storyId, (s) => {
            s.characters = s.characters.filter((c) => c.id !== charId);
          }),
        })),

      addAsset: (storyId) => {
        const id = nanoid(8);
        set((st) => ({
          stories: touch(st.stories, storyId, (s) => {
            s.assets = [...s.assets, { id, name: "", type: "background", url: "" }];
          }),
        }));
        return id;
      },

      patchAsset: (storyId, assetId, patch) =>
        set((st) => ({
          stories: touch(st.stories, storyId, (s) => {
            s.assets = s.assets.map((a) => (a.id === assetId ? { ...a, ...patch } : a));
          }),
        })),

      removeAsset: (storyId, assetId) =>
        set((st) => ({
          stories: touch(st.stories, storyId, (s) => {
            s.assets = s.assets.filter((a) => a.id !== assetId);
          }),
        })),
    }),
    {
      name: "storygraph:v2",
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (Object.keys(state.stories).length === 0) {
          state.stories = {
            [SAMPLE_STORY.id]: { ...SAMPLE_STORY, createdAt: Date.now(), updatedAt: Date.now() },
          };
        }
        state.hydrated = true;
      },
    }
  )
);
