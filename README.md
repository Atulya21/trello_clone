# Trello Clone — Full-Stack Kanban Board

A production-ready Trello clone built with Next.js 14, TypeScript, Tailwind CSS, Prisma, and MySQL.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Drag & Drop**: dnd-kit
- **Backend**: Next.js API Routes
- **ORM**: Prisma 5 (Prisma 7 compatible schema)
- **Database**: MySQL

## Features

- ✅ Kanban board with lists and cards
- ✅ Drag & drop cards between lists and reorder lists
- ✅ Card modal: title, description, labels, due date, checklist, members
- ✅ Labels system with color picker
- ✅ Member assignment
- ✅ Checklist with progress bar
- ✅ Search cards by title
- ✅ Filter by label, member, and due date
- ✅ Overdue / due-soon visual indicators
- ✅ Full CRUD for all entities

## Setup

### 1. Configure database

Copy `.env.example` to `.env` and update the connection string:

```bash
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL="mysql://root:yourpassword@localhost:3306/trello_clone"
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run database migrations

```bash
npx prisma migrate dev --name init
```

### 4. Seed the database

```bash
npm run db:seed
```

This creates:
- 1 board: "Product Roadmap"
- 3 members: Alice, Bob, Carol
- 5 lists: Backlog, To Do, In Progress, Review, Done
- 9 cards with labels, checklists, and assignments
- 6 labels

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
trello-clone/
├── app/
│   ├── api/
│   │   ├── boards/route.ts
│   │   ├── lists/route.ts
│   │   ├── lists/[id]/route.ts
│   │   ├── cards/route.ts
│   │   ├── cards/[id]/route.ts
│   │   ├── cards/[id]/labels/route.ts
│   │   ├── cards/[id]/members/route.ts
│   │   ├── cards/[id]/checklists/route.ts
│   │   ├── checklists/[id]/route.ts
│   │   ├── checklists/[id]/items/route.ts
│   │   ├── checklist-items/[id]/route.ts
│   │   ├── labels/route.ts
│   │   ├── members/route.ts
│   │   ├── reorder/lists/route.ts
│   │   └── reorder/cards/route.ts
│   ├── board/
│   │   ├── page.tsx        (server component, fetches initial data)
│   │   └── BoardView.tsx   (client component)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx            (redirects to /board)
├── components/
│   ├── board/
│   │   ├── AddListForm.tsx
│   │   ├── BoardCanvas.tsx  (main DnD orchestration)
│   │   ├── BoardFilters.tsx
│   │   └── BoardHeader.tsx
│   ├── card/
│   │   ├── CardItem.tsx    (draggable card)
│   │   └── CardModal.tsx   (full card editor)
│   ├── layout/
│   │   └── AppHeader.tsx
│   ├── list/
│   │   ├── AddCardForm.tsx
│   │   ├── ListColumn.tsx  (droppable list)
│   │   └── ListHeader.tsx
│   └── ui/
│       ├── Avatar.tsx
│       ├── Button.tsx
│       └── LabelBadge.tsx
├── hooks/
│   └── useBoard.ts         (all board state & API calls)
├── lib/
│   ├── prisma.ts
│   └── utils.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
└── types/
    └── index.ts
```

## Database Schema

- `Board` → `List[]` → `Card[]`
- `Card` → `Label[]` (via `CardLabel`)
- `Card` → `Member[]` (via `CardMember`)
- `Card` → `Checklist[]` → `ChecklistItem[]`
- `Board` → `Member[]` (via `BoardMember`)
