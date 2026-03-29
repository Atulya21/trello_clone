import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { cards } = await req.json() as {
      cards: { id: string; position: number; listId: string }[];
    };

    await prisma.$transaction(
      cards.map(({ id, position, listId }) =>
        prisma.card.update({ where: { id }, data: { position, listId } })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to reorder cards" }, { status: 500 });
  }
}
