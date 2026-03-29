import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, boardId } = body;

    const lastList = await prisma.list.findFirst({
      where: { boardId },
      orderBy: { position: "desc" },
    });

    const position = (lastList?.position ?? 0) + 1;

    const list = await prisma.list.create({
      data: { title, boardId, position },
      include: { cards: true },
    });

    return NextResponse.json(list, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create list" }, { status: 500 });
  }
}
