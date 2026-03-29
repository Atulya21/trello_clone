"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface AddListFormProps {
  onAdd: (title: string) => Promise<void>;
  onCancel: () => void;
}

export function AddListForm({ onAdd, onCancel }: AddListFormProps) {
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => { ref.current?.focus(); }, []);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      await onAdd(title.trim());
      setTitle("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#ebecf0] rounded-xl p-2 w-[272px] shrink-0 shadow-list">
      <input
        ref={ref}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
          if (e.key === "Escape") onCancel();
        }}
        placeholder="Enter list name…"
        className="w-full text-sm text-[#172b4d] bg-white border border-[#0065ff] rounded-lg px-3 py-2 mb-2
          focus:outline-none focus:ring-2 focus:ring-[#0065ff] placeholder:text-[#8590a2]"
      />
      <div className="flex items-center gap-2">
        <Button variant="primary" size="sm" onClick={handleSubmit} disabled={saving || !title.trim()}>
          Add list
        </Button>
        <button onClick={onCancel} className="text-[#6b778c] hover:text-[#172b4d]">
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
