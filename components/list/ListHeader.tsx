"use client";

import { useState, useRef, useEffect } from "react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

interface ListHeaderProps {
  title: string;
  cardCount: number;
  onRename: (title: string) => Promise<void>;
  onDelete: () => Promise<void>;
}

export function ListHeader({ title, cardCount, onRename, onDelete }: ListHeaderProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(title);
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (editing) inputRef.current?.select(); }, [editing]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const save = async () => {
    if (value.trim() && value !== title) await onRename(value.trim());
    else setValue(title);
    setEditing(false);
  };

  return (
    <div className="flex items-start justify-between px-3 pt-3 pb-2 gap-1">
      {editing ? (
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") { setValue(title); setEditing(false); }
          }}
          className="flex-1 text-sm font-semibold text-[#172b4d] bg-white border border-[#0065ff] rounded px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-[#0065ff]"
        />
      ) : (
        <h3
          className="flex-1 min-w-0 text-sm font-semibold text-[#172b4d] cursor-pointer select-none leading-snug tracking-tight"
          onClick={() => setEditing(true)}
        >
          {title}
          <span className="ml-1.5 text-[#6b778c] font-semibold tabular-nums">{cardCount}</span>
        </h3>
      )}

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((p) => !p)}
          className="p-1 rounded hover:bg-[#091e4221] text-[#6b778c] transition-colors"
        >
          <EllipsisHorizontalIcon className="w-4 h-4" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-modal w-48 py-1 z-20 border border-[#dfe1e6]">
            <button
              onClick={() => { setEditing(true); setMenuOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm text-[#172b4d] hover:bg-[#091e420f]"
            >
              Rename list
            </button>
            <button
              onClick={() => { onDelete(); setMenuOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm text-[#de350b] hover:bg-[#091e420f]"
            >
              Delete list
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
