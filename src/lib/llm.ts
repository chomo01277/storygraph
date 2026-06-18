import Anthropic from "@anthropic-ai/sdk";
import { AnthropicBedrock } from "@anthropic-ai/bedrock-sdk";
import type { ChatMessage } from "./types";

export type Provider = "bedrock" | "anthropic" | "mock";

/** Map the story's friendly model id to a Bedrock inference-profile id. */
const BEDROCK_MODELS: Record<string, string> = {
  "claude-haiku-4-5": "global.anthropic.claude-haiku-4-5-20251001-v1:0",
  "claude-opus-4-6": "global.anthropic.claude-opus-4-6-v1",
  "claude-sonnet-4-6": "global.anthropic.claude-sonnet-4-6",
};

const hasAnthropicKey = () => {
  const k = process.env.ANTHROPIC_API_KEY;
  return Boolean(k && !k.startsWith("your-"));
};
const hasAwsCreds = () =>
  Boolean(process.env.AWS_REGION || process.env.AWS_PROFILE || process.env.AWS_ACCESS_KEY_ID);

/** Decide which backend to use. Explicit LLM_PROVIDER wins; else infer from env. */
export function resolveProvider(): Provider {
  const p = (process.env.LLM_PROVIDER || "").toLowerCase();
  if (p === "bedrock") return "bedrock";
  if (p === "anthropic") return "anthropic";
  if (hasAnthropicKey()) return "anthropic";
  if (hasAwsCreds()) return "bedrock";
  return "mock";
}

/** Returns a client whose `.messages.stream(...)` matches the Anthropic SDK shape. */
export function getClient(provider: Provider): Anthropic | AnthropicBedrock | null {
  if (provider === "bedrock") {
    // Credentials come from the standard AWS chain (AWS_PROFILE / env / IAM role).
    return new AnthropicBedrock({ awsRegion: process.env.AWS_REGION || "us-east-1" });
  }
  if (provider === "anthropic") {
    return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return null;
}

export function modelFor(provider: Provider, model?: string): string {
  const m = model || process.env.CLAUDE_MODEL || "claude-haiku-4-5";
  if (provider === "bedrock") return BEDROCK_MODELS[m] ?? BEDROCK_MODELS["claude-haiku-4-5"];
  return m;
}

/**
 * Offline fallback so the full play experience is demoable without any provider.
 */
export async function* mockStream(
  system: string,
  messages: ChatMessage[]
): AsyncGenerator<string> {
  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const sceneTitle = system.match(/# CURRENT (?:SCENE|EVENT):\s*(.+)/)?.[1]?.trim() ?? "the scene";
  const action = lastUser.replace(/^\(.*?\)\s*/, "").slice(0, 120) || "press on";

  const beats = [
    `The air tightens as you ${action.toLowerCase()}. `,
    `Something shifts in the dark just out of sight. `,
    `\n\nYou are deep inside **${sceneTitle}** now — and the story is watching to see what you do. `,
    `*Every choice matters here.*\n\n`,
    `*(Demo mode — configure ANTHROPIC_API_KEY or AWS/Bedrock for live narration.)*\n`,
    `CHOICES: Press forward | Hold your ground | Look for another way`,
  ];
  for (const beat of beats) {
    for (const piece of beat.match(/\S+\s*|\n+/g) ?? [beat]) {
      yield piece;
      await new Promise((r) => setTimeout(r, 16));
    }
  }
}
