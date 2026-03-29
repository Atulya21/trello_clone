import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function isOverdue(date: Date | string | null | undefined): boolean {
  if (!date) return false;
  return new Date(date) < new Date();
}

export function isDueSoon(date: Date | string | null | undefined): boolean {
  if (!date) return false;
  const d = new Date(date);
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  return diff > 0 && diff < 24 * 60 * 60 * 1000;
}
