"use client";

import type { ReactNode, TextareaHTMLAttributes, InputHTMLAttributes } from "react";

export const inputCls =
  "w-full rounded-lg bg-canvas border border-line px-3 py-2.5 text-sm text-ink placeholder:text-fainter outline-none transition-colors focus:border-blue/60 focus:ring-2 focus:ring-blue/20";

/** Big section header for a studio step screen. */
export function StepHeader({
  title,
  ko,
  children,
}: {
  title: string;
  ko: string;
  children?: ReactNode;
}) {
  return (
    <div className="border-b border-line pb-5">
      <h2 className="flex items-center gap-2.5 text-xl font-bold">
        {title}
        <span className="text-sm font-medium text-fainter">{ko}</span>
      </h2>
      {children && (
        <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-faint">{children}</p>
      )}
    </div>
  );
}

export function Label({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <label className="mb-1.5 block text-[13px] font-semibold text-muted">
      {children}
      {required && <span className="ml-1 text-primary-bright">*</span>}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${props.className ?? ""}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputCls} resize-y leading-relaxed ${props.className ?? ""}`} />;
}

export function Toggle({
  checked,
  onChange,
  title,
  desc,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-start gap-3 rounded-xl border border-line bg-canvas p-3.5 text-left transition-colors hover:border-line-strong"
    >
      <span
        className={`mt-0.5 flex h-5 w-9 shrink-0 items-center rounded-full px-0.5 transition-colors ${
          checked ? "bg-primary" : "bg-line-strong"
        }`}
      >
        <span
          className={`h-4 w-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-4" : ""
          }`}
        />
      </span>
      <span>
        <span className="block text-sm font-medium text-ink">{title}</span>
        <span className="mt-0.5 block text-xs text-faint">{desc}</span>
      </span>
    </button>
  );
}
