"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import PlayScreen from "@/components/player/PlayScreen";

export default function PlayPage() {
  const { id } = useParams<{ id: string }>();
  const hydrated = useStore((s) => s.hydrated);
  const story = useStore((s) => s.stories[id]);

  if (!hydrated)
    return <div className="grid h-screen place-items-center text-sm text-faint">Loading…</div>;
  if (!story)
    return (
      <div className="grid h-screen place-items-center text-sm text-faint">
        Story not found.{" "}
        <Link href="/" className="ml-1 text-blue-bright underline">
          Back to dashboard
        </Link>
      </div>
    );

  return <PlayScreen story={story} />;
}
