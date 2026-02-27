import { prisma } from "@/lib/db";

export async function listCatalogMeta() {
  const [categories, venues] = await prisma.$transaction([
    prisma.category.findMany({ orderBy: { title: "asc" } }),
    prisma.venue.findMany({ where: { city: "Житомир" }, orderBy: { title: "asc" } }),
  ]);

  return { categories, venues };
}
