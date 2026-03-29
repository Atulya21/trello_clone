import { prisma } from "@/lib/prisma";
import { BoardView } from "./BoardView";
import type { Board } from "@/types";

export const dynamic = "force-dynamic";

async function getBoardData(): Promise<Board | null> {
  const board = await prisma.board.findFirst({
    include: {
      members: { include: { member: true } },
      lists: {
        orderBy: { position: "asc" },
        include: {
          cards: {
            orderBy: { position: "asc" },
            include: {
              labels: { include: { label: true } },
              checklists: { include: { items: { orderBy: { createdAt: "asc" } } } },
              assignments: { include: { member: true } },
            },
          },
        },
      },
    },
  });

  if (!board) return null;

  return {
    ...board,
    members: board.members.map((bm) => bm.member),
    lists: board.lists.map((list) => ({
      ...list,
      cards: list.cards.map((card) => ({
        ...card,
        dueDate: card.dueDate?.toISOString() ?? null,
        createdAt: card.createdAt.toISOString(),
        updatedAt: card.updatedAt.toISOString(),
        labels: card.labels.map((cl) => cl.label),
        assignments: card.assignments.map((ca) => ca.member),
      })),
    })),
  };
}

async function getLabels(boardId: string) {
  const labels = await prisma.label.findMany({
    where: { boardId },
    orderBy: { name: "asc" },
  });
  return labels;
}

export default async function BoardPage() {
  const board = await getBoardData();

  if (!board) {
    return (
      <div className="min-h-screen bg-[#1d6fa4] flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">No board found</h1>
          <p className="text-white/70 mb-6">Run the seed script to create demo data.</p>
          <code className="bg-black/30 px-4 py-2 rounded text-sm">
            npm run db:seed
          </code>
        </div>
      </div>
    );
  }

  const labels = await getLabels(board.id);

  return <BoardView initialBoard={board} initialLabels={labels} />;
}
