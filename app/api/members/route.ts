import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const members = await prisma.member.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(members);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}
