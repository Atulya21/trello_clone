import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, listId } = body;

    const lastCard = await prisma.card.findFirst({
      where: { listId },
      orderBy: { position: "desc" },
    });

    const position = (lastCard?.position ?? 0) + 1;

    const card = await prisma.card.create({
      data: { title, listId, position },
      include: {
        labels: { include: { label: true } },
        checklists: { include: { items: true } },
        assignments: { include: { member: true } },
      },
    });

    return NextResponse.json({
      ...card,
      dueDate: card.dueDate?.toISOString() ?? null,
      createdAt: card.createdAt.toISOString(),
      updatedAt: card.updatedAt.toISOString(),
      labels: card.labels.map((cl) => cl.label),
      assignments: card.assignments.map((ca) => ca.member),
    }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create card" }, { status: 500 });
  }
}
