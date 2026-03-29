"use client";

import { useState, useEffect, useRef } from "react";
import { Card, Label, Member, Checklist, ChecklistItem } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { LabelBadge } from "@/components/ui/LabelBadge";
import { Button } from "@/components/ui/Button";
import { formatDate, isOverdue, isDueSoon } from "@/lib/utils";
import {
  XMarkIcon,
  TagIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  TrashIcon,
  PlusIcon,
  Bars3Icon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

interface CardModalProps {
  card: Card;
  boardLabels: Label[];
  boardMembers: Member[];
  onClose: () => void;
  onUpdate: (cardId: string, updates: Partial<Card>) => Promise<Card>;
  onDelete: (cardId: string) => Promise<void>;
  onRefresh: (cardId: string) => Promise<void>;
}

const LABEL_PRESET_COLORS = [
  "#ff5630", "#ff991f", "#ffc400", "#36b37e",
  "#00b8d9", "#0065ff", "#6554c0", "#ff7452",
  "#57d9a3", "#00c7e6", "#4c9aff", "#998dd9",
];

export function CardModal({
  card,
  boardLabels,
  boardMembers,
  onClose,
  onUpdate,
  onDelete,
  onRefresh,
}: CardModalProps) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description ?? "");
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const [dueDate, setDueDate] = useState(
    card.dueDate ? new Date(card.dueDate).toISOString().split("T")[0] : ""
  );
  const [activePanel, setActivePanel] = useState<"labels" | "members" | "checklist" | null>(null);
  const [newChecklistTitle, setNewChecklistTitle] = useState("Checklist");
  const [newItemTexts, setNewItemTexts] = useState<Record<string, string>>({});
  const [addingItem, setAddingItem] = useState<string | null>(null);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("#0065ff");
  const [saving, setSaving] = useState(false);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const saveTitle = async () => {
    if (!title.trim() || title === card.title) { setEditingTitle(false); return; }
    try {
      await onUpdate(card.id, { title: title.trim() });
    } catch { toast.error("Failed to save title"); }
    setEditingTitle(false);
  };

  const saveDescription = async () => {
    try {
      await onUpdate(card.id, { description });
    } catch { toast.error("Failed to save description"); }
    setEditingDesc(false);
  };

  const saveDueDate = async (val: string) => {
    setDueDate(val);
    try {
      await onUpdate(card.id, { dueDate: val || null } as any);
    } catch { toast.error("Failed to save due date"); }
  };

  const toggleLabel = async (labelId: string) => {
    setSaving(true);
    try {
      await fetch(`/api/cards/${card.id}/labels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ labelId }),
      });
      await onRefresh(card.id);
    } catch { toast.error("Failed to toggle label"); }
    setSaving(false);
  };

  const toggleMember = async (memberId: string) => {
    setSaving(true);
    try {
      await fetch(`/api/cards/${card.id}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId }),
      });
      await onRefresh(card.id);
    } catch { toast.error("Failed to toggle member"); }
    setSaving(false);
  };

  const addChecklist = async () => {
    if (!newChecklistTitle.trim()) return;
    try {
      await fetch(`/api/cards/${card.id}/checklists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newChecklistTitle }),
      });
      await onRefresh(card.id);
      setActivePanel(null);
      setNewChecklistTitle("Checklist");
    } catch { toast.error("Failed to add checklist"); }
  };

  const deleteChecklist = async (checklistId: string) => {
    try {
      await fetch(`/api/checklists/${checklistId}`, { method: "DELETE" });
      await onRefresh(card.id);
    } catch { toast.error("Failed to delete checklist"); }
  };

  const addChecklistItem = async (checklistId: string) => {
    const text = newItemTexts[checklistId]?.trim();
    if (!text) return;
    try {
      await fetch(`/api/checklists/${checklistId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      setNewItemTexts((p) => ({ ...p, [checklistId]: "" }));
      await onRefresh(card.id);
    } catch { toast.error("Failed to add item"); }
  };

  const toggleItem = async (itemId: string, completed: boolean) => {
    try {
      await fetch(`/api/checklist-items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });
      await onRefresh(card.id);
    } catch { toast.error("Failed to update item"); }
  };

  const deleteItem = async (itemId: string) => {
    try {
      await fetch(`/api/checklist-items/${itemId}`, { method: "DELETE" });
      await onRefresh(card.id);
    } catch { toast.error("Failed to delete item"); }
  };

  const createLabel = async () => {
    if (!newLabelName.trim()) return;
    try {
      const res = await fetch("/api/labels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newLabelName, color: newLabelColor }),
      });
      const label = await res.json();
      await toggleLabel(label.id);
      setNewLabelName("");
    } catch { toast.error("Failed to create label"); }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this card? This cannot be undone.")) return;
    try {
      await onDelete(card.id);
      onClose();
    } catch { toast.error("Failed to delete card"); }
  };

  const overdue = isOverdue(card.dueDate);
  const soon = isDueSoon(card.dueDate);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 pb-8 px-4"
      style={{ backgroundColor: "rgba(9,30,66,0.54)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-[#f1f2f4] rounded-xl shadow-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 pb-0 flex gap-3">
          <DocumentTextIcon className="w-5 h-5 text-[#6b778c] mt-1 shrink-0" />
          <div className="flex-1 min-w-0">
            {editingTitle ? (
              <textarea
                ref={titleRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={saveTitle}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); saveTitle(); } }}
                className="w-full text-lg font-semibold text-[#172b4d] bg-white border border-[#0065ff] rounded p-1 resize-none focus:outline-none focus:ring-2 focus:ring-[#0065ff]"
                rows={2}
                autoFocus
              />
            ) : (
              <h2
                className="text-lg font-semibold text-[#172b4d] cursor-pointer hover:bg-[#091e420f] rounded p-1 -ml-1"
                onClick={() => setEditingTitle(true)}
              >
                {card.title}
              </h2>
            )}
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-[#091e420f] text-[#6b778c] shrink-0">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-4 p-4 pt-2">
          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Labels display */}
            {card.labels.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-[#6b778c] uppercase tracking-wide mb-1.5">Labels</p>
                <div className="flex flex-wrap gap-1.5">
                  {card.labels.map((l) => (
                    <LabelBadge key={l.id} label={l} />
                  ))}
                </div>
              </div>
            )}

            {/* Members display */}
            {card.assignments.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-[#6b778c] uppercase tracking-wide mb-1.5">Members</p>
                <div className="flex flex-wrap gap-1.5">
                  {card.assignments.map((m) => (
                    <div key={m.id} className="flex items-center gap-1.5 bg-white rounded-full px-2 py-0.5">
                      <Avatar member={m} size="sm" />
                      <span className="text-xs text-[#172b4d]">{m.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Due date display */}
            {card.dueDate && (
              <div>
                <p className="text-xs font-semibold text-[#6b778c] uppercase tracking-wide mb-1.5">Due Date</p>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-medium
                    ${overdue ? "bg-[#ff5630] text-white" : soon ? "bg-[#ff991f] text-white" : "bg-[#091e420f] text-[#172b4d]"}`}
                >
                  <ClockIcon className="w-4 h-4" />
                  {formatDate(card.dueDate)}
                  {overdue && " · Overdue"}
                  {soon && " · Due soon"}
                </span>
              </div>
            )}

            {/* Description */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Bars3Icon className="w-4 h-4 text-[#6b778c]" />
                <p className="text-sm font-semibold text-[#172b4d]">Description</p>
              </div>
              {editingDesc ? (
                <div className="ml-6">
                  <textarea
                    ref={descRef}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full text-sm text-[#172b4d] bg-white border border-[#0065ff] rounded p-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#0065ff] min-h-[80px]"
                    rows={4}
                    autoFocus
                    placeholder="Add a more detailed description..."
                  />
                  <div className="flex gap-2 mt-2">
                    <Button variant="primary" size="sm" onClick={saveDescription}>Save</Button>
                    <Button size="sm" onClick={() => { setEditingDesc(false); setDescription(card.description ?? ""); }}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div
                  className="ml-6 cursor-pointer rounded p-2 min-h-[56px] hover:bg-[#091e420f] transition-colors"
                  onClick={() => setEditingDesc(true)}
                >
                  {description ? (
                    <p className="text-sm text-[#172b4d] whitespace-pre-wrap">{description}</p>
                  ) : (
                    <p className="text-sm text-[#8590a2]">Add a more detailed description…</p>
                  )}
                </div>
              )}
            </div>

            {/* Checklists */}
            {card.checklists.map((cl) => {
              const total = cl.items.length;
              const done = cl.items.filter((i) => i.completed).length;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              return (
                <div key={cl.id}>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircleIcon className="w-4 h-4 text-[#6b778c]" />
                    <p className="text-sm font-semibold text-[#172b4d] flex-1">{cl.title}</p>
                    <Button size="sm" onClick={() => deleteChecklist(cl.id)}>Delete</Button>
                  </div>
                  {/* Progress bar */}
                  <div className="ml-6 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-[#6b778c] w-7">{pct}%</span>
                      <div className="flex-1 h-2 bg-[#091e420f] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${pct}%`, backgroundColor: pct === 100 ? "#36b37e" : "#0065ff" }}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      {cl.items.map((item) => (
                        <div key={item.id} className="flex items-start gap-2 group/item py-0.5">
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={(e) => toggleItem(item.id, e.target.checked)}
                            className="mt-0.5 w-4 h-4 rounded cursor-pointer accent-[#0065ff]"
                          />
                          <span className={`flex-1 text-sm ${item.completed ? "line-through text-[#6b778c]" : "text-[#172b4d]"}`}>
                            {item.content}
                          </span>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="opacity-0 group-hover/item:opacity-100 transition-opacity text-[#6b778c] hover:text-[#de350b]"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    {/* Add item */}
                    {addingItem === cl.id ? (
                      <div className="mt-2">
                        <textarea
                          value={newItemTexts[cl.id] ?? ""}
                          onChange={(e) => setNewItemTexts((p) => ({ ...p, [cl.id]: e.target.value }))}
                          className="w-full text-sm border border-[#0065ff] rounded p-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#0065ff]"
                          rows={2}
                          placeholder="Add an item…"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); addChecklistItem(cl.id); }
                          }}
                        />
                        <div className="flex gap-2 mt-1">
                          <Button variant="primary" size="sm" onClick={() => addChecklistItem(cl.id)}>Add</Button>
                          <Button size="sm" onClick={() => setAddingItem(null)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <Button size="sm" className="mt-2" onClick={() => setAddingItem(cl.id)}>
                        <PlusIcon className="w-3.5 h-3.5" /> Add an item
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sidebar */}
          <div className="w-36 shrink-0 space-y-1">
            <p className="text-[11px] font-semibold text-[#6b778c] uppercase tracking-wide mb-2">Add to card</p>

            <Button className="w-full justify-start gap-2" size="sm" onClick={() => setActivePanel(p => p === "members" ? null : "members")}>
              <UserIcon className="w-4 h-4" /> Members
            </Button>
            <Button className="w-full justify-start gap-2" size="sm" onClick={() => setActivePanel(p => p === "labels" ? null : "labels")}>
              <TagIcon className="w-4 h-4" /> Labels
            </Button>
            <Button className="w-full justify-start gap-2" size="sm" onClick={() => setActivePanel(p => p === "checklist" ? null : "checklist")}>
              <CheckCircleIcon className="w-4 h-4" /> Checklist
            </Button>

            {/* Due date inline */}
            <div className="pt-1">
              <p className="text-[11px] font-semibold text-[#6b778c] uppercase tracking-wide mb-1.5">Due Date</p>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => saveDueDate(e.target.value)}
                className="w-full text-xs border border-[#dfe1e6] rounded px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#0065ff] focus:border-transparent"
              />
            </div>

            <div className="pt-3 border-t border-[#dfe1e6]">
              <p className="text-[11px] font-semibold text-[#6b778c] uppercase tracking-wide mb-2">Actions</p>
              <Button variant="danger" className="w-full justify-start gap-2" size="sm" onClick={handleDelete}>
                <TrashIcon className="w-4 h-4" /> Delete
              </Button>
            </div>
          </div>
        </div>

        {/* Panels */}
        {activePanel === "members" && (
          <div className="mx-4 mb-4 bg-white rounded-lg shadow-list p-3">
            <p className="text-sm font-semibold text-[#172b4d] mb-3">Members</p>
            <div className="space-y-1">
              {boardMembers.map((m) => {
                const assigned = card.assignments.some((a) => a.id === m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => toggleMember(m.id)}
                    disabled={saving}
                    className="w-full flex items-center gap-2 p-2 rounded hover:bg-[#091e420f] transition-colors"
                  >
                    <Avatar member={m} size="sm" />
                    <span className="flex-1 text-sm text-left text-[#172b4d]">{m.name}</span>
                    {assigned && <span className="text-[#36b37e] text-xs font-bold">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activePanel === "labels" && (
          <div className="mx-4 mb-4 bg-white rounded-lg shadow-list p-3">
            <p className="text-sm font-semibold text-[#172b4d] mb-3">Labels</p>
            <div className="space-y-1 mb-3">
              {boardLabels.map((l) => {
                const active = card.labels.some((cl) => cl.id === l.id);
                return (
                  <button
                    key={l.id}
                    onClick={() => toggleLabel(l.id)}
                    disabled={saving}
                    className="w-full flex items-center gap-2 p-1.5 rounded hover:bg-[#091e420f] transition-colors"
                  >
                    <span className="w-full h-7 rounded text-sm font-medium text-white flex items-center px-2" style={{ backgroundColor: l.color }}>
                      {l.name}
                    </span>
                    {active && <span className="text-[#36b37e] text-xs font-bold shrink-0">✓</span>}
                  </button>
                );
              })}
            </div>
            <div className="border-t border-[#dfe1e6] pt-3">
              <p className="text-xs font-semibold text-[#6b778c] mb-2">Create Label</p>
              <input
                value={newLabelName}
                onChange={(e) => setNewLabelName(e.target.value)}
                placeholder="Label name"
                className="w-full text-sm border border-[#dfe1e6] rounded px-2 py-1.5 mb-2 focus:outline-none focus:ring-2 focus:ring-[#0065ff]"
              />
              <div className="flex flex-wrap gap-1 mb-2">
                {LABEL_PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setNewLabelColor(c)}
                    className={`w-6 h-6 rounded ${newLabelColor === c ? "ring-2 ring-offset-1 ring-[#0065ff]" : ""}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <Button variant="primary" size="sm" onClick={createLabel} className="w-full">Create</Button>
            </div>
          </div>
        )}

        {activePanel === "checklist" && (
          <div className="mx-4 mb-4 bg-white rounded-lg shadow-list p-3">
            <p className="text-sm font-semibold text-[#172b4d] mb-3">Add Checklist</p>
            <input
              value={newChecklistTitle}
              onChange={(e) => setNewChecklistTitle(e.target.value)}
              placeholder="Checklist title"
              className="w-full text-sm border border-[#dfe1e6] rounded px-2 py-1.5 mb-2 focus:outline-none focus:ring-2 focus:ring-[#0065ff]"
            />
            <Button variant="primary" size="sm" onClick={addChecklist} className="w-full">Add</Button>
          </div>
        )}
      </div>
    </div>
  );
}
