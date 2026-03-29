import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { memberId } = await req.json();

    const existing = await prisma.cardMember.findUnique({
      where: { cardId_memberId: { cardId: params.id, memberId } },
    });

    if (existing) {
      await prisma.cardMember.delete({
        where: { cardId_memberId: { cardId: params.id, memberId } },
      });
      return NextResponse.json({ removed: true });
    }

    await prisma.cardMember.create({ data: { cardId: params.id, memberId } });
    return NextResponse.json({ added: true }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to toggle member" }, { status: 500 });
  }
}
