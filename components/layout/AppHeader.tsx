"use client";

import { Squares2X2Icon, BellIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

interface AppHeaderProps {
  boardTitle: string;
}

const navPill =
  "inline-flex items-center justify-center min-h-8 px-3 rounded-md bg-white/20 text-white text-sm font-medium " +
  "hover:bg-white/30 active:bg-white/25 transition-colors duration-200 ease-out";

export function AppHeader({ boardTitle }: AppHeaderProps) {
  return (
    <header
      className="relative flex items-center min-h-12 px-3 sm:px-4 shrink-0 gap-2"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.28)", backdropFilter: "blur(6px)" }}
    >
      {/* Left: Logo + nav */}
      <div className="flex items-center gap-1 min-w-0 flex-1">
        <button
          type="button"
          className={`${navPill} gap-2`}
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <rect x="3" y="3" width="7" height="14" rx="1.5" />
            <rect x="14" y="3" width="7" height="9" rx="1.5" />
          </svg>
          <span className="font-bold tracking-tight hidden sm:inline">Trello</span>
        </button>

        <button type="button" className={`${navPill} hidden sm:flex gap-1.5`}>
          <Squares2X2Icon className="w-4 h-4 shrink-0" />
          Workspaces
        </button>

        <button type="button" className={`${navPill} hidden md:inline-flex`}>
          Recent
        </button>

        <button type="button" className={`${navPill} hidden lg:inline-flex`}>
          Starred
        </button>
      </div>

      {/* Center: board title (viewport-centered like Trello) */}
      <h2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[min(280px,40vw)] text-center text-white font-semibold text-[15px] leading-snug tracking-tight truncate pointer-events-none">
        {boardTitle}
      </h2>

      {/* Right: actions */}
      <div className="flex items-center justify-end gap-1 flex-1 min-w-0">
        <button
          type="button"
          className="inline-flex items-center justify-center size-8 rounded-md bg-white/20 text-white hover:bg-white/30 active:bg-white/25 transition-colors duration-200 ease-out"
          aria-label="Notifications"
        >
          <BellIcon className="w-5 h-5" />
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center size-8 rounded-md bg-white/20 text-white hover:bg-white/30 active:bg-white/25 transition-colors duration-200 ease-out"
          aria-label="Help"
        >
          <QuestionMarkCircleIcon className="w-5 h-5" />
        </button>
        <div
          className="size-8 rounded-full bg-[#0747a6] text-white text-xs font-bold flex items-center justify-center ml-1 ring-2 ring-white/25"
          aria-hidden
        >
          AJ
        </div>
      </div>
    </header>
  );
}
