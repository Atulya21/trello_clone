export interface Member {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
  initials: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
  boardId?: string | null;
}

export interface ChecklistItem {
  id: string;
  content: string;
  completed: boolean;
  checklistId: string;
}

export interface Checklist {
  id: string;
  title: string;
  cardId: string;
  items: ChecklistItem[];
}

export interface Card {
  id: string;
  title: string;
  description?: string | null;
  position: number;
  dueDate?: string | null;
  listId: string;
  labels: Label[];
  checklists: Checklist[];
  assignments: Member[];
  createdAt: string;
  updatedAt: string;
}

export interface List {
  id: string;
  title: string;
  position: number;
  boardId: string;
  cards: Card[];
}

export interface Board {
  id: string;
  title: string;
  description?: string | null;
  background: string;
  lists: List[];
  members: Member[];
}

export interface CardFilters {
  search: string;
  labelIds: string[];
  dueDateFilter: "overdue" | "due_soon" | "has_date" | null;
  memberIds: string[];
}
