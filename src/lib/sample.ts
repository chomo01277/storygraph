import type { Story } from "./types";

/**
 * Seed story shipped with the app so the full Studio + Player are demoable instantly.
 * A death-loop survival thriller.
 */
export const SAMPLE_STORY: Story = {
  id: "sample-crimson-classroom",
  title: "The Crimson Classroom",
  description:
    "You wake to find your 30 classmates have become trained killers — and the school is sealed. Die, and you loop back. You have 10 lives.",
  emoji: "🩸",
  model: "claude-opus-4-6",
  advanced: { minimizeProtagonistDialogue: true, randomDice: false },

  worldview: `1. GENRE
A loop-based survival thriller. After "awakening," {user} is suddenly hunted by their own classmates and must survive and escape a sealed school. Hardboiled, tense, cinematic.

2. CORE SETTING
- {user}'s power: DEATH LOOP. On death, {user} keeps their memories and is forced back to the last "save point." Max 10 loops — at 0, death is permanent.
- The classmates: all 30 are highly trained killing-weapons in disguise.
- The school is locked down; physically sealed zones (shutters, blast doors) cannot simply be forced open.

3. NARRATION STYLE
- Second person, present tense, from {user}'s point of view.
- Terse, punchy, hardboiled prose. Lean into sound and sensation.
- Concretely depict the betrayal of friends turning to killers, the suffocating cat-and-mouse, the noir action.

4. RESPONSE RULES
- Obey the loop mechanic: the instant {user} dies, cut the description and return them to the save point, decrementing the loop count.
- Respect cause and effect: do not let the player magically break sealed areas.
- Keep each turn to 1–3 short paragraphs and end at a decision point.`,
  endingPrompt: "",

  characters: [
    {
      id: "c_jiwon",
      name: "Jiwon",
      role: "sub",
      description:
        "Your deskmate. Quick smile, quicker hands. The first to turn — and the most precise. Treats the hunt like a graded exam.",
      images: [],
    },
    {
      id: "c_haeun",
      name: "Haeun",
      role: "sub",
      description:
        "The quiet one by the window. Something behind her eyes still flickers human. She may remember a way out — if you can reach her before the others reach you.",
      images: [],
    },
  ],

  assets: [
    {
      id: "a_classroom",
      name: "classroom",
      type: "background",
      url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "a_corridor",
      name: "corridor",
      type: "background",
      url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
    },
  ],

  nodes: [
    {
      id: "n_prologue",
      kind: "prologue",
      title: "The Awakening",
      trigger: "{user} comes to at their desk as 5th period bleeds into something wrong.",
      scene: `{bg::classroom}
The fluorescent lights hum. The smell of iron.
Every classmate is staring at you in dead silence.
Jiwon, beside you, smiles — and slides a box cutter from their sleeve.
"Don't take it personally," she whispers. "It's just the exam."`,
      position: { x: 0, y: 200 },
    },
    {
      id: "n_event1",
      kind: "main_event",
      title: "First Blood",
      trigger: "The first classmate lunges at {user}.",
      scene:
        "The attack is fast and practiced. {user} likely dies here the first time — use it to reveal the DEATH LOOP: snap back to the save point with the memory intact, loop count ticking down.",
      position: { x: 320, y: 300 },
    },
    {
      id: "n_event2",
      kind: "main_event",
      title: "The Locked Wing",
      trigger: "{user} slips into the east corridor looking for a way out.",
      scene: `{bg::corridor}
Shutters sealed. A bloodied hall.
You find either a clue about WHO started this, or Haeun — wavering, maybe still human.
A real fork: push deeper toward the ringleader, or gamble on the locked fire exit.`,
      position: { x: 640, y: 200 },
    },
    {
      id: "n_event3",
      kind: "main_event",
      title: "The Ringleader",
      trigger: "{user} confronts the one orchestrating the hunt.",
      scene:
        "The mastermind reveals why the class was turned into weapons. The save point is close. Every wrong word can cost a loop. Build to the final choice.",
      position: { x: 960, y: 300 },
    },
    {
      id: "n_ending_main",
      kind: "main_ending",
      title: "Breakout",
      trigger: "{user} reaches the roof access with the override key.",
      scene:
        "Dawn over a silent city. The lockdown lifts. {user} steps out, loops to spare, carrying what they now know. Land the catharsis.",
      position: { x: 1280, y: 200 },
    },
    {
      id: "n_ending_loop",
      kind: "sub_ending",
      title: "Eternal Loop",
      trigger: "{user} burns the last loop on the sealed fire exit.",
      scene:
        "The counter hits zero. The save point does not come. The hum of the fluorescents goes on without them. A cold, quiet bad-end.",
      position: { x: 960, y: 480 },
    },
  ],
  edges: [
    { id: "e1", source: "n_prologue", target: "n_event1" },
    { id: "e2", source: "n_event1", target: "n_event2" },
    { id: "e3", source: "n_event2", target: "n_event3" },
    { id: "e4", source: "n_event3", target: "n_ending_main" },
    { id: "e5", source: "n_event2", target: "n_ending_loop" },
  ],

  publish: {
    previewImage: "",
    genres: ["Thriller", "Survival", "Loop"],
    ageRating: "15",
    visibility: "public",
    published: true,
  },

  createdAt: 0,
  updatedAt: 0,
};
