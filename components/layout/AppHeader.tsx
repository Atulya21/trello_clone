"use client";

import { Squares2X2Icon, BellIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

interface AppHeaderProps {
  boardTitle: string;
}

export function AppHeader({ boardTitle }: AppHeaderProps) {
  return (
    <header
      className="flex items-center justify-between px-4 py-2 gap-4 shrink-0"
      style={{ backgroundColor: "rgba(0,0,0,0.24)", backdropFilter: "blur(4px)" }}
    >
      {/* Left: Logo + nav */}
      <div className="flex items-center gap-1">
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-white">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="3" width="7" height="14" rx="1.5" />
            <rect x="14" y="3" width="7" height="9" rx="1.5" />
          </svg>
          <span className="font-bold text-sm hidden sm:block">Trello</span>
        </button>

        <button className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-white text-sm font-medium hidden sm:flex items-center gap-1">
          <Squares2X2Icon className="w-4 h-4" />
          Workspaces
        </button>

        <button className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-white text-sm font-medium hidden sm:block">
          Recent
        </button>

        <button className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-white text-sm font-medium hidden sm:block">
          Starred
        </button>
      </div>

      {/* Center: board title */}
      <div className="flex-1 flex justify-center">
        <h2 className="text-white font-bold text-sm truncate max-w-xs">{boardTitle}</h2>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1">
        <button className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-white">
          <BellIcon className="w-5 h-5" />
        </button>
        <button className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-white">
          <QuestionMarkCircleIcon className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-[#0747a6] text-white text-xs font-bold flex items-center justify-center ml-1">
          AJ
        </div>
      </div>
    </header>
  );
}
