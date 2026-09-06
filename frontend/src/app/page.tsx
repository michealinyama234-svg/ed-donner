"use client";

import { Header } from "@/components/Header";
import { KanbanBoard } from "@/components/KanbanBoard";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[#f4f6fa]">
      <Header />
      <KanbanBoard />
    </main>
  );
}
