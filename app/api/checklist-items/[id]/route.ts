import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { completed, content } = await req.json();

    const item = await prisma.checklistItem.update({
      where: { id: params.id },
      data: {
        ...(completed !== undefined && { completed }),
        ...(content !== undefined && { content }),
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.checklistItem.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
