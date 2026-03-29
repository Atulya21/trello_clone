import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { lists } = await req.json() as { lists: { id: string; position: number }[] };

    await prisma.$transaction(
      lists.map(({ id, position }) =>
        prisma.list.update({ where: { id }, data: { position } })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to reorder lists" }, { status: 500 });
  }
}
