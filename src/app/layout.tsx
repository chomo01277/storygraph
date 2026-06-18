import type { Metadata } from "next";
import "./globals.css";
import "@xyflow/react/dist/style.css";

export const metadata: Metadata = {
  title: "StoryGraph — build & play interactive AI stories",
  description:
    "Design branching story games as a visual node graph, then play them like a visual novel — narrated live by Claude Opus 4.6.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
