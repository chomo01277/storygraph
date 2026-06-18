import type { Story, StoryNode } from "./types";

const fill = (text: string, playerName: string) =>
  (text || "").replaceAll("{user}", playerName);

/** System prompt: worldview + roster + the current scene's direction + rules. */
export function buildSystemPrompt(
  story: Story,
  node: StoryNode,
  playerName: string
): string {
  const roster = story.characters
    .filter((c) => c.name.trim())
    .map((c) => `- ${c.name} (${c.role === "main" ? "main" : "sub"}): ${c.description}`)
    .join("\n");

  return [
    `You are the DIRECTOR and narrator of an interactive visual-novel game titled "${story.title}".`,
    `The protagonist (player) is named "${playerName}". Always address them in the second person.`,
    ``,
    `# WORLDVIEW & RULES`,
    fill(story.worldview, playerName),
    roster ? `\n# CHARACTERS\n${fill(roster, playerName)}` : ``,
    ``,
    `# CURRENT EVENT: ${node.title}`,
    node.trigger ? `Trigger: ${fill(node.trigger, playerName)}` : ``,
    node.scene ? `Director's direction:\n${fill(stripTags(node.scene), playerName)}` : ``,
    ``,
    `# HOW TO RESPOND`,
    `- Dramatize the current event vividly, true to the worldview's tone and rules.`,
    `- Keep each turn to 1–3 short paragraphs, then stop at a decision point.`,
    `- React to the protagonist's last action; never decide their choices for them.`,
    `- FORMATTING (Markdown): put ALL character speech in double quotes ("like this"). Use **bold** for sharp emphasis — a shout, a sudden sound, a key object. Use *italics* for ${playerName}'s inner thoughts. Keep narration outside quotes as plain prose.`,
    story.advanced.minimizeProtagonistDialogue
      ? `- Minimize the protagonist's own dialogue; focus on the world reacting to them.`
      : ``,
    story.advanced.randomDice
      ? `- Where an action's outcome is uncertain, narrate it as a risky dice-roll with real chance of failure.`
      : ``,
    `- On the VERY LAST line, output 2–4 short, concrete options the player could take, formatted EXACTLY as:`,
    `CHOICES: option one | option two | option three`,
    `- Never write the word CHOICES anywhere except that final line.`,
  ]
    .filter(Boolean)
    .join("\n");
}

/** Injected as a user turn when the story advances to a new event node. */
export function transitionNote(node: StoryNode, playerName: string): string {
  return `(The story now moves into a new event: "${node.title}". ${fill(
    node.trigger || stripTags(node.scene),
    playerName
  )} Carry the narrative forward into this event.)`;
}

/** Split an assistant message into prose + parsed choice chips. */
export function parseChoices(text: string): { prose: string; choices: string[] } {
  const match = text.match(/CHOICES:\s*(.+)\s*$/i);
  if (!match) return { prose: text.trim(), choices: [] };
  const choices = match[1]
    .split("|")
    .map((c) => c.trim())
    .filter(Boolean)
    .slice(0, 4);
  const prose = text.slice(0, match.index).trim();
  return { prose, choices };
}

const stripTags = (s: string) => (s || "").replace(/\{(bg|media)::[^}]+\}/g, "").trim();

export interface SceneFrame {
  bg?: string; // asset name
  media?: string; // asset name
  text?: string; // narration
}

/**
 * Parse a Director's Scene (연출 씬): one line = one frame.
 * Lines that are only {bg::x} / {media::x} set visuals; other lines are narration.
 */
export function parseScene(scene: string, playerName: string): SceneFrame[] {
  const frames: SceneFrame[] = [];
  let currentBg: string | undefined;
  for (const raw of (scene || "").split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const bg = line.match(/^\{bg::([^}]+)\}$/);
    const media = line.match(/^\{media::([^}]+)\}$/);
    if (bg) {
      currentBg = bg[1].trim();
      frames.push({ bg: currentBg });
    } else if (media) {
      frames.push({ media: media[1].trim(), bg: currentBg });
    } else {
      frames.push({ text: fill(stripTags(line), playerName), bg: currentBg });
    }
  }
  return frames;
}
