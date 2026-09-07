import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MenuIndexPage() {
  const first = await prisma.category.findFirst({ orderBy: { position: "asc" } });
  redirect(first ? `/menu/${first.slug}` : "/");
}
