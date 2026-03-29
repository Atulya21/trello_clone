import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const boardId = searchParams.get("boardId");

    const labels = await prisma.label.findMany({
      where: boardId ? { boardId } : {},
      orderBy: { name: "asc" },
    });

    return NextResponse.json(labels);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch labels" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, color, boardId } = await req.json();

    const label = await prisma.label.create({ data: { name, color, boardId } });
    return NextResponse.json(label, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create label" }, { status: 500 });
  }
}
