"use client";

import dynamic from "next/dynamic";

const Playground = dynamic(() => import("./playground"), {
  ssr: false,
  loading: () => (
    <main className="boot">
      <p>Loading…</p>
    </main>
  ),
});

export default function Home() {
  return <Playground />;
}
