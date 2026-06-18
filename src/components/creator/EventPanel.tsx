"use client";

import { useStore } from "@/lib/store";
import { NODE_KIND_META, type NodeKind, type Story } from "@/lib/types";

const SWITCHABLE: NodeKind[] = ["main_event", "sub_event", "main_ending", "sub_ending"];

interface Props {
  story: Story;
  nodeId: string;
  onClose: () => void;
}

export default function EventPanel({ story, nodeId, onClose }: Props) {
  const patchNode = useStore((s) => s.patchNode);
  const removeNode = useStore((s) => s.removeNode);

  const node = story.nodes.find((n) => n.id === nodeId);
  if (!node) return null;
  const isPrologue = node.kind === "prologue";
  const set = (patch: Partial<typeof node>) => patchNode(story.id, node.id, patch);

  const insertAsset = (token: string) =>
    set({ scene: node.scene ? `${node.scene}\n${token}` : token });

  return (
    <aside className="absolute right-0 top-0 z-20 flex h-full w-full max-w-[460px] flex-col border-l border-line bg-surface shadow-[-12px_0_40px_-20px_rgba(0,0,0,0.8)]">
      <header className="flex items-center gap-3 border-b border-line px-5 py-4">
        <button
          onClick={onClose}
          className="grid h-8 w-8 place-items-center rounded-lg text-faint transition-colors hover:bg-elevated hover:text-ink"
          aria-label="Close"
        >
          »
        </button>
        <h2 className="text-lg font-bold">Edit Event</h2>
        <span className="rounded-full border border-blue/40 bg-blue/10 px-2.5 py-0.5 text-[11px] font-semibold text-blue-bright">
          {NODE_KIND_META[node.kind].icon} {NODE_KIND_META[node.kind].ko}
        </span>
      </header>

      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
        <Field label="Title · 제목" required hint={`${node.title.length} / 40`}>
          <input
            value={node.title}
            maxLength={40}
            onChange={(e) => set({ title: e.target.value })}
            className="w-full rounded-xl border border-line-strong bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-blue"
            placeholder="Name this event"
          />
        </Field>

        {!isPrologue && (
          <Field label="Event type">
            <div className="grid grid-cols-2 gap-2">
              {SWITCHABLE.map((k) => (
                <button
                  key={k}
                  onClick={() => set({ kind: k })}
                  className={`rounded-xl border px-3 py-2 text-[12px] font-semibold transition-colors ${
                    node.kind === k
                      ? "border-blue bg-blue/10 text-blue-bright"
                      : "border-line bg-panel text-faint hover:text-ink"
                  }`}
                >
                  {NODE_KIND_META[k].icon} {NODE_KIND_META[k].label}
                </button>
              ))}
            </div>
          </Field>
        )}

        <Field
          label="Event Trigger · 이벤트 트리거"
          required
          help="The situation or condition that starts this event."
          hint={`${node.trigger.length} / 200`}
        >
          <textarea
            value={node.trigger}
            maxLength={200}
            onChange={(e) => set({ trigger: e.target.value })}
            rows={2}
            className="w-full resize-none rounded-xl border border-line-strong bg-canvas px-3.5 py-2.5 text-sm leading-relaxed text-ink outline-none transition-colors focus:border-blue"
            placeholder="e.g. {user} opens the door to the sealed wing"
          />
        </Field>

        <Field
          label="🎬 Director's Scene · 연출 씬"
          help="Direct the scene shown to the protagonist. One line = one frame. Type plain text for narration. Tip: insert assets below."
          hint={`${node.scene.length} / 4000`}
        >
          <textarea
            value={node.scene}
            maxLength={4000}
            onChange={(e) => set({ scene: e.target.value })}
            rows={11}
            className="w-full resize-none rounded-xl border border-line-strong bg-canvas px-3.5 py-3 font-mono text-[13px] leading-relaxed text-ink outline-none transition-colors focus:border-blue"
            placeholder={"{bg::classroom}\nThe lights flicker.\nJiwon turns to you, smiling..."}
          />
          {story.assets.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-fainter">@ insert:</span>
              {story.assets.map((a) => (
                <button
                  key={a.id}
                  onClick={() =>
                    insertAsset(`{${a.type === "background" ? "bg" : "media"}::${a.name}}`)
                  }
                  className="rounded-md border border-line bg-panel px-2 py-0.5 text-[11px] text-muted hover:border-blue/50 hover:text-blue-bright"
                >
                  {a.type === "background" ? "🖼" : "🎞"} {a.name || "unnamed"}
                </button>
              ))}
            </div>
          )}
        </Field>
      </div>

      {!isPrologue && (
        <footer className="border-t border-line px-5 py-4">
          <button
            onClick={() => {
              removeNode(story.id, node.id);
              onClose();
            }}
            className="w-full rounded-xl border border-primary/40 bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary-bright transition-colors hover:bg-primary/20"
          >
            Delete event
          </button>
        </footer>
      )}
    </aside>
  );
}

function Field({
  label,
  required,
  help,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  help?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-[13px] font-semibold text-muted">
          {label} {required && <span className="text-blue-bright">*</span>}
        </label>
        {hint && <span className="text-[11px] text-fainter">{hint}</span>}
      </div>
      {help && <p className="mb-2 text-[12px] leading-relaxed text-faint">{help}</p>}
      {children}
    </div>
  );
}
