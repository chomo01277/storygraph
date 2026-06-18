import Anthropic from "@anthropic-ai/sdk";
import type { ChatMessage } from "./types";

export const MODEL = process.env.CLAUDE_MODEL || "claude-opus-4-6";

/** Returns an Anthropic client, or null if no key is configured (→ mock mode). */
export function getAnthropic(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey.startsWith("your-")) return null;
  return new Anthropic({ apiKey });
}

/**
 * Offline fallback so the full play experience is demoable without a key.
 * Streams a worldview-aware, slightly randomized canned narration.
 */
export async function* mockStream(
  system: string,
  messages: ChatMessage[]
): AsyncGenerator<string> {
  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const sceneTitle = system.match(/# CURRENT SCENE:\s*(.+)/)?.[1]?.trim() ?? "the scene";
  const action = lastUser.replace(/^\(.*?\)\s*/, "").slice(0, 120) || "step forward";

  const beats = [
    `The air tightens as you ${action.toLowerCase()}. `,
    `Somewhere down the corridor, a sound that should not be there. `,
    `\n\nYou are deep inside **${sceneTitle}** now — and the world is watching to see what you do. `,
    `Every instinct says the next move matters.\n\n`,
    `*(Demo mode — add an ANTHROPIC_API_KEY to .env.local for live Claude Opus 4.6 narration.)*\n`,
    `CHOICES: Press forward | Hold your ground and listen | Look for another way`,
  ];

  for (const beat of beats) {
    // chunk each beat into word-ish pieces to mimic token streaming
    for (const piece of beat.match(/\S+\s*|\n+/g) ?? [beat]) {
      yield piece;
      await new Promise((r) => setTimeout(r, 18));
    }
  }
}
