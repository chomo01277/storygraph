import type { NextRequest } from "next/server";
import { getAnthropic, MODEL, mockStream } from "@/lib/llm";
import type { ChatMessage } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PlayBody {
  system: string;
  messages: ChatMessage[];
  model?: string;
}

export async function POST(req: NextRequest) {
  const { system, messages, model }: PlayBody = await req.json();
  const encoder = new TextEncoder();
  const client = getAnthropic();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));

      try {
        if (!client) {
          for await (const text of mockStream(system, messages)) send({ text });
        } else {
          const llmStream = client.messages.stream({
            model: model || MODEL,
            max_tokens: 1200,
            system,
            messages: messages.map((m) => ({ role: m.role, content: m.content })),
          });

          for await (const event of llmStream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              send({ text: event.delta.text });
            }
          }
        }
        send({ done: true });
      } catch (err) {
        send({ error: err instanceof Error ? err.message : "Unknown error", done: true });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
