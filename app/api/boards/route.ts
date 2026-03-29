import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const boards = await prisma.board.findMany({
      include: {
        members: { include: { member: true } },
        lists: {
          orderBy: { position: "asc" },
          include: {
            cards: {
              orderBy: { position: "asc" },
              include: {
                labels: { include: { label: true } },
                checklists: { include: { items: true } },
                assignments: { include: { member: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const formatted = boards.map((board) => ({
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
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch boards" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, background } = body;

    const board = await prisma.board.create({
      data: { title, description, background: background || "#1d6fa4" },
    });

    return NextResponse.json(board, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create board" }, { status: 500 });
  }
}
