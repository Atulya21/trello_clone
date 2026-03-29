import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function formatCard(card: any) {
  return {
    ...card,
    dueDate: card.dueDate?.toISOString() ?? null,
    createdAt: card.createdAt.toISOString(),
    updatedAt: card.updatedAt.toISOString(),
    labels: card.labels?.map((cl: any) => cl.label ?? cl) ?? [],
    assignments: card.assignments?.map((ca: any) => ca.member ?? ca) ?? [],
  };
}

const cardInclude = {
  labels: { include: { label: true } },
  checklists: { include: { items: { orderBy: { createdAt: "asc" as const } } } },
  assignments: { include: { member: true } },
};

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const card = await prisma.card.findUnique({
      where: { id: params.id },
      include: cardInclude,
    });

    if (!card) return NextResponse.json({ error: "Card not found" }, { status: 404 });

    return NextResponse.json(formatCard(card));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch card" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { title, description, position, listId, dueDate } = body;

    const card = await prisma.card.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(position !== undefined && { position }),
        ...(listId !== undefined && { listId }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      },
      include: cardInclude,
    });

    return NextResponse.json(formatCard(card));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update card" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.card.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete card" }, { status: 500 });
  }
}
