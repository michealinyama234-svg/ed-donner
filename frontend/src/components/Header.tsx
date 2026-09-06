"use client";

import React from "react";
import { LayoutDashboard } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-[#032147] text-white border-b-4 border-[#ecad0a] px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#209dd7] rounded-lg text-white">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Project Kanban Board
            </h1>
            <p className="text-xs md:text-sm text-[#888888]">
              Streamlined agile delivery workflow
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#ecad0a] bg-[#032147]/80 border border-[#ecad0a]/40 px-3 py-1 rounded-full">
            Single Board MVP
          </span>
        </div>
      </div>
    </header>
  );
};
