"use client";

import { useState, useEffect, useCallback } from "react";
import { Board, List, Card } from "@/types";

export function useBoard() {
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBoard = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/boards");
      if (!res.ok) throw new Error("Failed to fetch board");
      const boards: Board[] = await res.json();
      setBoard(boards[0] ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBoard(); }, [fetchBoard]);

  const addList = useCallback(async (title: string) => {
    if (!board) return;
    const res = await fetch("/api/lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, boardId: board.id }),
    });
    if (!res.ok) throw new Error("Failed to create list");
    const newList: List = await res.json();
    setBoard((prev) =>
      prev ? { ...prev, lists: [...prev.lists, { ...newList, cards: [] }] } : prev
    );
  }, [board]);

  const updateList = useCallback(async (listId: string, title: string) => {
    const res = await fetch(`/api/lists/${listId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error("Failed to update list");
    setBoard((prev) =>
      prev
        ? {
            ...prev,
            lists: prev.lists.map((l) => (l.id === listId ? { ...l, title } : l)),
          }
        : prev
    );
  }, []);

  const deleteList = useCallback(async (listId: string) => {
    const res = await fetch(`/api/lists/${listId}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete list");
    setBoard((prev) =>
      prev ? { ...prev, lists: prev.lists.filter((l) => l.id !== listId) } : prev
    );
  }, []);

  const addCard = useCallback(async (listId: string, title: string) => {
    const res = await fetch("/api/cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, listId }),
    });
    if (!res.ok) throw new Error("Failed to create card");
    const newCard: Card = await res.json();
    setBoard((prev) =>
      prev
        ? {
            ...prev,
            lists: prev.lists.map((l) =>
              l.id === listId ? { ...l, cards: [...l.cards, newCard] } : l
            ),
          }
        : prev
    );
    return newCard;
  }, []);

  const updateCard = useCallback(async (cardId: string, updates: Partial<Card>) => {
    const res = await fetch(`/api/cards/${cardId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Failed to update card");
    const updatedCard: Card = await res.json();
    setBoard((prev) =>
      prev
        ? {
            ...prev,
            lists: prev.lists.map((l) => ({
              ...l,
              cards: l.cards.map((c) => (c.id === cardId ? updatedCard : c)),
            })),
          }
        : prev
    );
    return updatedCard;
  }, []);

  const deleteCard = useCallback(async (cardId: string) => {
    const res = await fetch(`/api/cards/${cardId}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete card");
    setBoard((prev) =>
      prev
        ? {
            ...prev,
            lists: prev.lists.map((l) => ({
              ...l,
              cards: l.cards.filter((c) => c.id !== cardId),
            })),
          }
        : prev
    );
  }, []);

  const reorderLists = useCallback(async (lists: List[]) => {
    setBoard((prev) => (prev ? { ...prev, lists } : prev));
    const payload = lists.map((l, i) => ({ id: l.id, position: i + 1 }));
    await fetch("/api/reorder/lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lists: payload }),
    });
  }, []);

  const reorderCards = useCallback(async (updatedLists: List[]) => {
    setBoard((prev) => (prev ? { ...prev, lists: updatedLists } : prev));
    const cards: { id: string; position: number; listId: string }[] = [];
    updatedLists.forEach((l) =>
      l.cards.forEach((c, i) => cards.push({ id: c.id, position: i + 1, listId: l.id }))
    );
    await fetch("/api/reorder/cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cards }),
    });
  }, []);

  const refreshCard = useCallback(async (cardId: string) => {
    const res = await fetch(`/api/cards/${cardId}`);
    if (!res.ok) return;
    const updatedCard: Card = await res.json();
    setBoard((prev) =>
      prev
        ? {
            ...prev,
            lists: prev.lists.map((l) => ({
              ...l,
              cards: l.cards.map((c) => (c.id === cardId ? updatedCard : c)),
            })),
          }
        : prev
    );
  }, []);

  return {
    board,
    loading,
    error,
    addList,
    updateList,
    deleteList,
    addCard,
    updateCard,
    deleteCard,
    reorderLists,
    reorderCards,
    refreshCard,
    refetch: fetchBoard,
  };
}
