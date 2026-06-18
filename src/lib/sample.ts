import type { Story } from "./types";

/**
 * Seed story: an alternate-history wizarding adventure — "what if Dumbledore had lived?"
 *
 * Imagery uses real Harry Potter film stills (characters) and the actual Hogwarts
 * filming locations (Alnwick Castle, Christ Church, the Bodleian, the Forest of Dean),
 * served by Wikimedia's CDN. These are used for a non-commercial hackathon demo;
 * the film stills remain © Warner Bros. — swap to licensed art for any public release.
 */
const IMG = {
  hogwarts:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Alnwick_Castle_in_uk.jpg/1280px-Alnwick_Castle_in_uk.jpg",
  greatHall:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Tom_Quad%2C_Christ_Church%2C_Oxford.jpg/1280px-Tom_Quad%2C_Christ_Church%2C_Oxford.jpg",
  library:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Bibliotheca_Bodleiana.jpg/1280px-Bibliotheca_Bodleiana.jpg",
  forest:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Symonds_Yat_Rock_View.JPG/1280px-Symonds_Yat_Rock_View.JPG",
  dumbledore: "https://upload.wikimedia.org/wikipedia/en/e/e8/Dumbledore_-_Prisoner_of_Azkaban.jpg",
  snape: "https://upload.wikimedia.org/wikipedia/en/b/b9/Ootp076.jpg",
  voldemort: "https://upload.wikimedia.org/wikipedia/en/a/a3/Lordvoldemort.jpg",
  harry: "https://upload.wikimedia.org/wikipedia/commons/9/99/Daniel_Radcliffe_as_Harry_Potter.jpg",
  hermione: "https://upload.wikimedia.org/wikipedia/en/d/d3/Hermione_Granger_poster.jpg",
  ron: "https://upload.wikimedia.org/wikipedia/en/5/5e/Ron_Weasley_poster.jpg",
};

export const SAMPLE_STORY: Story = {
  id: "sample-dumbledore",
  title: "Dumbledore Lives",
  description:
    "An alternate sixth year: Snape's curse is stayed and Dumbledore survives the Astronomy Tower. With both mentors at his side, Harry must destroy the Horcruxes and end Voldemort — before the cursed ring claims the Headmaster first.",
  emoji: "⚡",
  model: "claude-haiku-4-5",
  advanced: { minimizeProtagonistDialogue: false, randomDice: false },

  worldview: `1. GENRE
A magical alternate-history adventure set in the wizarding world. The player IS Harry Potter. POINT OF DIVERGENCE: on the Astronomy Tower, Snape does NOT kill Dumbledore — his true loyalty turns the moment. Dumbledore survives but is dying slowly from the cursed ring, and Snape's cover as a double agent is blown. Now both mentors openly guide Harry to find and destroy Voldemort's Horcruxes.

2. CORE SETTING
1) {user} plays Harry Potter. Allies: Dumbledore (wise, gentle, racing his own failing heart), Snape (caustic, brilliant, secretly devoted), Hermione and Ron.
2) Voldemort split his soul into Horcruxes; each must be found and destroyed before he can die. Nagini the serpent is one of them.
3) Honor the magic — wands, canonical spells, and the rules of the wizarding world. A ticking clock: the curse is killing Dumbledore.

3. NARRATION STYLE
1) Second person, present tense, as Harry. Immersive and lyrical — wonder and dread, in the tone of the books.
2) Voice each character distinctly: Dumbledore measured and warm, Snape cold and clipped, Hermione earnest, Ron loyal and wry.
3) Put all speech in double quotes. Render spell incantations in **bold** (e.g. **"Expelliarmus!"**). Use *italics* for Harry's thoughts and the burning of his scar.

4. RESPONSE RULES
1) Keep Harry alive and the quest moving — danger, sacrifice, and hard choices raise the stakes, but the story only resolves at an authored ending.
2) React to the player's last action and to which allies are present (trusting Snape changes everything).
3) Keep each turn to 1–3 short paragraphs, then offer 2–4 concrete choices that advance the fight against Voldemort.`,
  endingPrompt: "",

  characters: [
    {
      id: "c_dumbledore",
      name: "Albus Dumbledore",
      role: "sub",
      description:
        "Headmaster of Hogwarts, the only wizard Voldemort ever feared. Survived the Tower, but the cursed ring is slowly killing him. Wise, gentle, and racing his own mortality to ready Harry for what comes.",
      images: [{ id: "i_dumb", state: "default", url: IMG.dumbledore }],
    },
    {
      id: "c_snape",
      name: "Severus Snape",
      role: "sub",
      description:
        "Potions master and double agent, his loyalty to Dumbledore now laid bare. Caustic, brilliant, unreadable — he despises sentiment, yet would burn the world to protect Lily's son.",
      images: [{ id: "i_snape", state: "default", url: IMG.snape }],
    },
    {
      id: "c_hermione",
      name: "Hermione Granger",
      role: "sub",
      description: "The brightest witch of her age. Harry's anchor — research, logic, and fierce loyalty.",
      images: [{ id: "i_herm", state: "default", url: IMG.hermione }],
    },
    {
      id: "c_ron",
      name: "Ron Weasley",
      role: "sub",
      description: "Harry's best friend. Brave when it counts, and the heart of the trio.",
      images: [{ id: "i_ron", state: "default", url: IMG.ron }],
    },
    {
      id: "c_voldemort",
      name: "Lord Voldemort",
      role: "sub",
      description:
        "The Dark Lord. Fragments of his torn soul, hidden as Horcruxes, keep him from death. Cruel, patient, and terrified of only one wizard — Dumbledore.",
      images: [{ id: "i_vold", state: "default", url: IMG.voldemort }],
    },
  ],

  assets: [
    { id: "a_hogwarts", name: "hogwarts", type: "background", url: IMG.hogwarts },
    { id: "a_dumbledore", name: "dumbledore", type: "background", url: IMG.dumbledore },
    { id: "a_snape", name: "snape", type: "background", url: IMG.snape },
    { id: "a_voldemort", name: "voldemort", type: "background", url: IMG.voldemort },
    { id: "a_harry", name: "harry", type: "background", url: IMG.harry },
    { id: "a_great_hall", name: "great_hall", type: "background", url: IMG.greatHall },
    { id: "a_forest", name: "forbidden_forest", type: "background", url: IMG.forest },
    { id: "a_library", name: "library", type: "background", url: IMG.library },
  ],

  nodes: [
    {
      id: "n_prologue",
      kind: "prologue",
      title: "The Tower Holds",
      trigger: "The night Snape was meant to kill Dumbledore — and didn't.",
      scene: `{bg::hogwarts}
The Astronomy Tower. Cold wind, a sky drowned in stars. Dumbledore is slumped against the ramparts, his wand hand blackened and dying.
Snape bursts through the door, Death Eaters at his back. His wand rises toward the Headmaster.
For one heartbeat, everything hangs in the balance — then Snape turns, and his curse takes Bellatrix instead.
"Get the boy out, Albus," he snarls. "My cover is finished."
Dumbledore's eyes find yours. "It seems," he says softly, "we are all out of time to waste."`,
      position: { x: 0, y: 220 },
    },
    {
      id: "n_plan",
      kind: "main_event",
      title: "The Headmaster's Plan",
      trigger: "{user} learns the Horcrux plan from Dumbledore and Snape.",
      scene: `{bg::dumbledore}
Dumbledore's study — silver instruments whirring, Fawkes watching from his perch.
"Voldemort has torn his soul apart," Dumbledore explains, cradling his cursed hand. "Seven Horcruxes. Destroy them, and he can finally die."
Snape leans in the shadows, arms folded. "The Dark Lord still believes me loyal. That is a weapon we will not keep for long."
Two paths open: the sea cave where a locket waits, or Snape's memories of the Dark Lord's secrets.`,
      position: { x: 320, y: 220 },
    },
    {
      id: "n_cave",
      kind: "main_event",
      title: "The Sea Cave",
      trigger: "{user} descends into the cave to retrieve the locket Horcrux.",
      scene: `{bg::voldemort}
Black water, black rock. A stone basin glows with cursed potion that must be drunk to the last drop.
Beneath the surface, pale hands begin to stir — the Inferi, the drowned dead.
Dumbledore steadies himself on your shoulder. "Whatever you see — whatever I beg of you — do not stop until the basin is empty."`,
      position: { x: 660, y: 90 },
    },
    {
      id: "n_snape",
      kind: "sub_event",
      title: "What Snape Knows",
      trigger: "{user} reviews Snape's memories for the Dark Lord's weakness.",
      scene: `{bg::snape}
The dungeon air is thick with sage and something bitter.
Snape pours a thread of silver memory into the Pensieve without looking at you. "Watch, Potter. The Dark Lord fears one thing above death."
*His voice cracks, just once, on a name he will not say.*
"There is a serpent — Nagini. Kill her, and he becomes mortal at last."`,
      position: { x: 660, y: 360 },
    },
    {
      id: "n_dark",
      kind: "sub_ending",
      title: "The Dark Lord Ascendant",
      trigger: "A Horcrux survives and Voldemort rises whole.",
      scene: `{bg::voldemort}
You were too slow. A Horcrux endures — and with it, so does he.
Voldemort rises from the dark, whole and laughing, as Dumbledore's last strength fails.
*Neither can live while the other survives.* Tonight, it is not you who lives.`,
      position: { x: 660, y: 600 },
    },
    {
      id: "n_forest",
      kind: "main_event",
      title: "Into the Forest",
      trigger: "{user} enters the Forbidden Forest to hunt Nagini.",
      scene: `{bg::forbidden_forest}
The Forbidden Forest swallows the moonlight. Somewhere ahead, Nagini hunts.
Dumbledore can barely stand; the curse has reached his heart. "I will hold the clearing. You must finish this."
Snape's wand flares at the treeline. "They're here — all of them. Decide quickly, Potter. The castle, or the kill."`,
      position: { x: 980, y: 240 },
    },
    {
      id: "n_greathall",
      kind: "main_ending",
      title: "The Battle of Hogwarts",
      trigger: "{user} faces Voldemort in the Great Hall with both mentors alive.",
      scene: `{bg::great_hall}
The Great Hall erupts — spellfire, shattering glass, the roar of a hundred wands.
Dumbledore and Snape stand at your flanks as Voldemort screams his final curse.
You raise your wand. **"Expelliarmus!"**
His spell rebounds. It is over. Dawn breaks through the broken ceiling, and Hogwarts still stands.`,
      position: { x: 1300, y: 120 },
    },
    {
      id: "n_finalspell",
      kind: "main_ending",
      title: "The Final Spell",
      trigger: "Snape steps into the killing curse meant for {user}.",
      scene: `{bg::harry}
Voldemort's killing curse streaks toward you — and Snape steps into its path.
"For Lily," he breathes, and the green light takes him instead.
In that opening, you and Dumbledore strike as one. The Dark Lord falls to ash on the scorched grass.
The cost was terrible. But the world is free.`,
      position: { x: 1300, y: 380 },
    },
  ],
  edges: [
    { id: "e1", source: "n_prologue", target: "n_plan" },
    { id: "e2", source: "n_plan", target: "n_cave" },
    { id: "e3", source: "n_plan", target: "n_snape" },
    { id: "e4", source: "n_cave", target: "n_forest" },
    { id: "e5", source: "n_snape", target: "n_forest" },
    { id: "e6", source: "n_cave", target: "n_dark" },
    { id: "e7", source: "n_forest", target: "n_greathall" },
    { id: "e8", source: "n_forest", target: "n_finalspell" },
  ],

  publish: {
    previewImage: IMG.hogwarts,
    genres: ["Fantasy", "Adventure", "Magic"],
    ageRating: "12",
    visibility: "public",
    published: true,
  },

  createdAt: 0,
  updatedAt: 0,
};
