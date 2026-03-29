import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { title } = await req.json();

    const checklist = await prisma.checklist.create({
      data: { title, cardId: params.id },
      include: { items: true },
    });

    return NextResponse.json(checklist, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create checklist" }, { status: 500 });
  }
}
