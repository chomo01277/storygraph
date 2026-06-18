"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import FlowEditor from "./FlowEditor";
import EventPanel from "./EventPanel";
import { NODE_KIND_META, type NodeKind, type Story } from "@/lib/types";

const ADDABLE: NodeKind[] = ["main_event", "sub_event", "main_ending", "sub_ending"];

export default function EventsPanel({ story }: { story: Story }) {
  const addNode = useStore((s) => s.addNode);
  const [selected, setSelected] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);

  return (
    <div className="relative h-full w-full">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-4 p-5">
        <div className="pointer-events-auto max-w-lg rounded-2xl border border-line bg-surface/85 p-4 backdrop-blur">
          <h2 className="flex items-center gap-2 text-base font-bold">
            Events <span className="text-xs font-medium text-fainter">이벤트</span>
          </h2>
          <p className="mt-1 text-[12px] leading-relaxed text-faint">
            Click the Prologue to direct the opening scene. Add events and drag the handles to
            connect them in order. Branch out for multiple endings, or loop back to an earlier event.
          </p>
        </div>
        <div className="pointer-events-auto relative">
          <button
            onClick={() => setMenu((m) => !m)}
            className="rounded-xl bg-blue px-4 py-2.5 text-sm font-semibold text-white shadow transition-colors hover:bg-blue-bright"
          >
            + Add event
          </button>
          {menu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenu(false)} />
              <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-line bg-surface shadow-2xl">
                {ADDABLE.map((k) => (
                  <button
                    key={k}
                    onClick={() => {
                      const id = addNode(story.id, k);
                      setMenu(false);
                      setSelected(id);
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-muted transition-colors hover:bg-elevated hover:text-ink"
                  >
                    <span>{NODE_KIND_META[k].icon}</span>
                    <span className="font-medium">{NODE_KIND_META[k].label}</span>
                    <span className="ml-auto text-[11px] text-fainter">{NODE_KIND_META[k].ko}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <FlowEditor story={story} selectedId={selected} onSelect={setSelected} />

      {selected && <EventPanel story={story} nodeId={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
