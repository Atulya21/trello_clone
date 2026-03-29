import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { title, position } = body;

    const list = await prisma.list.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(position !== undefined && { position }),
      },
    });

    return NextResponse.json(list);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update list" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.list.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete list" }, { status: 500 });
  }
}
