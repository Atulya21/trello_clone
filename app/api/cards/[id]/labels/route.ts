import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { labelId } = await req.json();

    const existing = await prisma.cardLabel.findUnique({
      where: { cardId_labelId: { cardId: params.id, labelId } },
    });

    if (existing) {
      await prisma.cardLabel.delete({
        where: { cardId_labelId: { cardId: params.id, labelId } },
      });
      return NextResponse.json({ removed: true });
    }

    await prisma.cardLabel.create({ data: { cardId: params.id, labelId } });
    return NextResponse.json({ added: true }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to toggle label" }, { status: 500 });
  }
}
