"use client";

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  type Node,
  type Edge,
  type Connection,
  type NodeChange,
  type EdgeChange,
  type NodeMouseHandler,
} from "@xyflow/react";
import { nanoid } from "nanoid";
import EventNode from "./EventNode";
import { useStore } from "@/lib/store";
import type { Story } from "@/lib/types";

const nodeTypes = { story: EventNode };

export default function FlowEditor({
  story,
  selectedId,
  onSelect,
}: {
  story: Story;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const setNodePositions = useStore((s) => s.setNodePositions);
  const setEdges = useStore((s) => s.setEdges);
  const removeNode = useStore((s) => s.removeNode);

  const rfNodes: Node[] = useMemo(
    () =>
      story.nodes.map((n) => ({
        id: n.id,
        type: "story",
        position: n.position,
        data: {
          kind: n.kind,
          title: n.title,
          hasContent: Boolean(n.scene || n.trigger),
          selected: n.id === selectedId,
        },
      })),
    [story.nodes, selectedId]
  );

  const rfEdges: Edge[] = useMemo(
    () =>
      story.edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        animated: true,
      })),
    [story.edges]
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const positions: Record<string, { x: number; y: number }> = {};
      for (const c of changes) {
        if (c.type === "position" && c.position) positions[c.id] = c.position;
        if (c.type === "remove") removeNode(story.id, c.id);
      }
      if (Object.keys(positions).length) setNodePositions(story.id, positions);
    },
    [story.id, setNodePositions, removeNode]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const removed = new Set(changes.filter((c) => c.type === "remove").map((c) => c.id));
      if (removed.size) setEdges(story.id, story.edges.filter((e) => !removed.has(e.id)));
    },
    [story.id, story.edges, setEdges]
  );

  const onConnect = useCallback(
    (conn: Connection) => {
      if (!conn.source || !conn.target || conn.source === conn.target) return;
      if (story.edges.some((e) => e.source === conn.source && e.target === conn.target)) return;
      setEdges(story.id, [
        ...story.edges,
        { id: nanoid(8), source: conn.source, target: conn.target },
      ]);
    },
    [story.id, story.edges, setEdges]
  );

  const onNodeClick: NodeMouseHandler = useCallback(
    (_e, node) => onSelect(node.id),
    [onSelect]
  );

  return (
    <ReactFlow
      nodes={rfNodes}
      edges={rfEdges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      onPaneClick={() => onSelect(null)}
      fitView
      fitViewOptions={{ padding: 0.35 }}
      minZoom={0.2}
      proOptions={{ hideAttribution: true }}
    >
      <Background variant={BackgroundVariant.Dots} gap={22} size={1.5} color="#2d2d2d" />
      <Controls showInteractive={false} />
    </ReactFlow>
  );
}
