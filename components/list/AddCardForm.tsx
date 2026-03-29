"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface AddCardFormProps {
  onAdd: (title: string) => Promise<void>;
  onCancel: () => void;
}

export function AddCardForm({ onAdd, onCancel }: AddCardFormProps) {
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

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
    <div>
      <textarea
        ref={ref}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
          if (e.key === "Escape") onCancel();
        }}
        placeholder="Enter a title for this card…"
        className="w-full text-sm text-[#172b4d] bg-white border border-[#0065ff] rounded-lg p-2 resize-none shadow-card
          focus:outline-none focus:ring-2 focus:ring-[#0065ff] placeholder:text-[#8590a2]"
        rows={3}
      />
      <div className="flex items-center gap-2 mt-1.5">
        <Button variant="primary" size="sm" onClick={handleSubmit} disabled={saving || !title.trim()}>
          Add card
        </Button>
        <button onClick={onCancel} className="text-[#6b778c] hover:text-[#172b4d] transition-colors">
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
