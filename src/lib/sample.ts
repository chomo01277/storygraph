import type { Story } from "./types";

const bg = (q: string, lock: number) =>
  `https://loremflickr.com/1280/720/${q}?lock=${lock}`;

/**
 * Seed story shipped with the app so the full Studio + Player are demoable instantly.
 * A branching zombie-outbreak survival escape.
 */
export const SAMPLE_STORY: Story = {
  id: "sample-outbreak",
  title: "Outbreak: Last Bell",
  description:
    "A zombie infection erupts during 5th period. Fight through the halls, choose who to trust, and escape Northwood High — before the bell tolls for you.",
  emoji: "🧟",
  model: "claude-haiku-4-5",
  advanced: { minimizeProtagonistDialogue: true, randomDice: true },

  worldview: `1. GENRE
Zombie-outbreak survival horror. A bite-borne infection erupts during 5th period at Northwood High. {user} must fight, scavenge, and ESCAPE the school to reach safety. Tense, cinematic, fast-moving — but escape is always possible.

2. CORE SETTING
1) The infected turn within minutes of a bite. They are drawn to NOISE — running, shouting, and breaking glass bring the horde.
2) {user} can move between areas, scavenge weapons and supplies, and choose to help or abandon other survivors. Those choices change who lives.
3) The goal is to get OUT. Every scene should move {user} closer to an exit — the roof for an evac chopper, or the lot for a vehicle.

3. NARRATION STYLE
1) Second person, present tense, from {user}'s point of view.
2) Visceral and sensory — sound, smell, adrenaline — but keep momentum. End each beat on a decision that pushes forward.
3) Reward smart, decisive play with small wins; punish reckless noise with rising danger.

4. RESPONSE RULES
1) Keep {user} alive and moving — injuries, close calls, and hard choices raise tension, but the story only resolves at an authored ending. Never kill {user} mid-scene.
2) React to the player's last action and to which survivors are currently with them.
3) Keep each turn to 1–3 short paragraphs, then offer 2–4 concrete choices that advance the escape.`,
  endingPrompt: "",

  characters: [
    {
      id: "c_jiwoo",
      name: "Jiwoo",
      role: "sub",
      description:
        "Your deskmate. Calm under pressure and quick on her feet. Sticks with you if you don't abandon her, and is the voice of reason when panic spreads.",
      images: [],
    },
    {
      id: "c_han",
      name: "Coach Han",
      role: "sub",
      description:
        "The gruff PE teacher — built like a door and twice as stubborn. Holds the line so others can run. Knows the roof access and keeps a pickup truck in the lot.",
      images: [],
    },
    {
      id: "c_min",
      name: "Min",
      role: "sub",
      description:
        "A resourceful senior who saw it coming. Hoards supplies — first-aid, a crowbar, a campus map. Trades help for help; earn her trust slowly.",
      images: [],
    },
  ],

  assets: [
    { id: "a_classroom", name: "classroom", type: "background", url: bg("classroom,empty", 21) },
    { id: "a_hallway", name: "hallway", type: "background", url: bg("school,hallway,dark", 22) },
    { id: "a_cafeteria", name: "cafeteria", type: "background", url: bg("cafeteria", 23) },
    { id: "a_library", name: "library", type: "background", url: bg("library,books", 24) },
    { id: "a_stairwell", name: "stairwell", type: "background", url: bg("stairwell,concrete", 25) },
    { id: "a_rooftop", name: "rooftop", type: "background", url: bg("rooftop,city,dusk", 26) },
    { id: "a_parking", name: "parking", type: "background", url: bg("parking,garage,dark", 27) },
    { id: "a_horde", name: "horde", type: "situation", url: bg("crowd,fog,silhouette", 28) },
  ],

  nodes: [
    {
      id: "n_prologue",
      kind: "prologue",
      title: "Fifth Period",
      trigger: "{user} is in 5th period when the outbreak begins.",
      scene: `{bg::classroom}
The clock reads 1:47 PM. Coach Han's substitute drones on about the French Revolution.
Then the PA system shrieks — a teacher's voice, screaming, cut short.
Through the window, a student sprints across the courtyard. Something chases him on all fours.
Jiwoo grabs your sleeve, knuckles white. "We need to move. Now."`,
      position: { x: 0, y: 220 },
    },
    {
      id: "n_corridor",
      kind: "main_event",
      title: "The Corridor",
      trigger: "{user} escapes the classroom into the main hallway.",
      scene: `{bg::hallway}
The hallway is a tunnel of slamming lockers and running feet.
Twenty meters down, the thing that used to be the librarian lurches between you and the far stairwell.
Two ways out: the cafeteria doors swinging on your right, or the dark hush of the library to your left.`,
      position: { x: 320, y: 220 },
    },
    {
      id: "n_cafeteria",
      kind: "main_event",
      title: "Cafeteria Gauntlet",
      trigger: "{user} pushes through the cafeteria doors toward the kitchen exit.",
      scene: `{bg::cafeteria}
Overturned tables. The smell of spoiled milk and copper.
A dozen of them feed in the center of the room — noise is death here.
The kitchen's back door, and the gym stairs beyond, wait across the open floor.`,
      position: { x: 660, y: 90 },
    },
    {
      id: "n_library",
      kind: "sub_event",
      title: "The Quiet Library",
      trigger: "{user} slips into the library looking for a quieter route.",
      scene: `{bg::library}
Dust and silence. The horde's roar dulls behind heavy oak doors.
Min, a senior you barely know, crouches behind the returns desk with a loaded backpack.
"There's a service stairwell behind the stacks," she whispers. "Help me, and it's yours."`,
      position: { x: 660, y: 360 },
    },
    {
      id: "n_overrun",
      kind: "sub_ending",
      title: "Overrun",
      trigger: "The horde catches {user} before they can escape.",
      scene: `{bg::horde}
There were too many. The noise brought all of them.
The last thing you hear is the cafeteria doors giving way.
The outbreak doesn't even slow down.`,
      position: { x: 660, y: 600 },
    },
    {
      id: "n_stairwell",
      kind: "main_event",
      title: "Stairwell to the Roof",
      trigger: "{user} reaches the service stairwell with the way up blocked.",
      scene: `{bg::stairwell}
Concrete steps spiral up into emergency-light red.
Coach Han braces the lower door with a fire extinguisher and his whole body.
"Roof for the chopper, or the lot for my truck — pick fast, kid. I can't hold this."`,
      position: { x: 980, y: 240 },
    },
    {
      id: "n_rooftop",
      kind: "main_ending",
      title: "Rooftop Rescue",
      trigger: "{user} climbs onto the roof as the rescue chopper arrives.",
      scene: `{bg::rooftop}
Wind. Open sky. A National Guard helicopter banks toward the roof, searchlight sweeping.
A soldier waves you in over the rotor wash.
You made it. The school burns behind you, small and far away.`,
      position: { x: 1300, y: 120 },
    },
    {
      id: "n_driveout",
      kind: "main_ending",
      title: "Drive Out",
      trigger: "{user} reaches the parking lot and Coach Han's truck.",
      scene: `{bg::parking}
The pickup roars to life on the third try.
You smash through the chain-link gate as the horde pours out behind you.
The road opens up, empty and grey. Alive — for now.`,
      position: { x: 1300, y: 380 },
    },
  ],
  edges: [
    { id: "e1", source: "n_prologue", target: "n_corridor" },
    { id: "e2", source: "n_corridor", target: "n_cafeteria" },
    { id: "e3", source: "n_corridor", target: "n_library" },
    { id: "e4", source: "n_cafeteria", target: "n_stairwell" },
    { id: "e5", source: "n_library", target: "n_stairwell" },
    { id: "e6", source: "n_cafeteria", target: "n_overrun" },
    { id: "e7", source: "n_stairwell", target: "n_rooftop" },
    { id: "e8", source: "n_stairwell", target: "n_driveout" },
  ],

  publish: {
    previewImage: "",
    genres: ["Zombie", "Survival", "Horror"],
    ageRating: "15",
    visibility: "public",
    published: true,
  },

  createdAt: 0,
  updatedAt: 0,
};
