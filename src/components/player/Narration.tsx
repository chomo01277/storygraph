"use client";

import React from "react";

// Matches, in priority order: **bold** | *italic* | "dialogue" / “dialogue”
const INLINE = /(\*\*[^*\n]+\*\*)|(\*[^*\n]+\*)|("[^"\n]+"|“[^”\n]+”)/g;

function renderInline(text: string, kp: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  INLINE.lastIndex = 0;
  while ((m = INLINE.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    if (m[1]) {
      out.push(
        <strong key={`${kp}-b${i}`} className="font-semibold text-white">
          {tok.slice(2, -2)}
        </strong>
      );
    } else if (m[2]) {
      out.push(
        <em key={`${kp}-i${i}`} className="italic text-emerald-300/80">
          {tok.slice(1, -1)}
        </em>
      );
    } else {
      // dialogue — distinct color + weight, quotes kept
      out.push(
        <span key={`${kp}-d${i}`} className="font-medium text-blue-bright">
          {tok}
        </span>
      );
    }
    last = m.index + tok.length;
    i++;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/**
 * Renders AI narration with lightweight markdown (bold/italic/headings/lists)
 * and colorizes character dialogue ("...") distinctly from narration prose.
 * Safe: builds React text nodes only — no HTML injection from model output.
 */
export default function Narration({
  text,
  streaming,
  size = "base",
}: {
  text: string;
  streaming?: boolean;
  size?: "base" | "lg";
}) {
  const blocks = text
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  const cursor = (
    <span className="ml-0.5 animate-pulse text-blue-bright">▋</span>
  );

  if (blocks.length === 0) {
    return (
      <div className={size === "lg" ? "text-lg" : "text-[15px]"}>
        {streaming ? cursor : null}
      </div>
    );
  }

  return (
    <div
      className={`space-y-3 leading-[1.85] text-[#e4e2e6] ${
        size === "lg" ? "text-lg" : "text-[15px]"
      }`}
    >
      {blocks.map((block, bi) => {
        const isLast = bi === blocks.length - 1;
        const tail = isLast && streaming ? cursor : null;

        const heading = block.match(/^(#{1,3})\s+(.*)$/);
        if (heading) {
          return (
            <p key={bi} className="text-base font-bold text-ink">
              {renderInline(heading[2], `h${bi}`)}
              {tail}
            </p>
          );
        }

        const lines = block.split("\n");
        const isList = lines.length > 0 && lines.every((l) => /^\s*[-*]\s+/.test(l));
        if (isList) {
          return (
            <ul key={bi} className="list-disc space-y-1 pl-5">
              {lines.map((l, li) => (
                <li key={li}>{renderInline(l.replace(/^\s*[-*]\s+/, ""), `l${bi}-${li}`)}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={bi}>
            {renderInline(block.replace(/\n/g, " "), `p${bi}`)}
            {tail}
          </p>
        );
      })}
    </div>
  );
}
