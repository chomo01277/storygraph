"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { NODE_KIND_META, type NodeKind } from "@/lib/types";

export interface EventNodeData {
  kind: NodeKind;
  title: string;
  hasContent: boolean;
  selected: boolean;
  [key: string]: unknown;
}

const TONE: Record<NodeKind, { box: string; label: string }> = {
  prologue: { box: "bg-blue/10 border-blue/60", label: "text-blue-bright" },
  main_event: { box: "bg-panel border-line", label: "text-muted" },
  sub_event: { box: "bg-panel border-line border-dashed", label: "text-faint" },
  main_ending: { box: "bg-primary/10 border-primary/50", label: "text-primary-bright" },
  sub_ending: { box: "bg-primary/5 border-primary/30 border-dashed", label: "text-primary-bright/80" },
};

export default function EventNode({ data }: NodeProps) {
  const d = data as EventNodeData;
  const meta = NODE_KIND_META[d.kind];
  const tone = TONE[d.kind];
  const ring = d.selected
    ? "ring-2 ring-blue shadow-[0_0_28px_-6px_rgba(0,122,255,0.55)]"
    : "hover:border-blue/40";

  return (
    <div
      className={`group relative w-[224px] cursor-pointer select-none rounded-2xl border px-4 py-3 transition-all ${tone.box} ${ring}`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2.5 !w-2.5 !border-2 !border-canvas !bg-faint"
      />
      <div className="flex items-center gap-2">
        <span className="text-sm">{meta.icon}</span>
        <span className={`text-[10px] font-semibold tracking-[0.14em] ${tone.label}`}>
          {meta.label}
        </span>
      </div>
      <div className="mt-1.5 truncate text-[15px] font-semibold text-ink">
        {d.title || "Untitled"}
      </div>
      <div className="mt-1 flex items-center gap-1.5 text-[11px]">
        <span className={`h-1.5 w-1.5 rounded-full ${d.hasContent ? "bg-emerald-400" : "bg-fainter"}`} />
        <span className="text-fainter">{d.hasContent ? "scene written" : "empty scene"}</span>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!h-2.5 !w-2.5 !border-2 !border-canvas !bg-blue"
      />
    </div>
  );
}
