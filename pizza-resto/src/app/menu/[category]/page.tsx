import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CategoryNav } from "@/components/CategoryNav";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function MenuCategoryPage({
  params
}: {
  params: { category: string };
}) {
  const categories = await prisma.category.findMany({ orderBy: { position: "asc" } });
  const active = categories.find((c) => c.slug === params.category);
  if (!active) notFound();

  const products = await prisma.product.findMany({
    where: { categoryId: active.id, isAvailable: true },
    orderBy: { name: "asc" }
  });

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="font-display text-3xl text-mozza">{active.name}</h1>
      <div className="mt-6">
        <CategoryNav categories={categories} activeSlug={active.slug} />
      </div>
      <div className="mt-4">
        {products.length === 0 ? (
          <p className="py-10 text-center font-body text-semola/50">
            Aucun produit disponible dans cette catégorie pour le moment.
          </p>
        ) : (
          products.map((p) => (
            <ProductCard
              key={p.id}
              slug={p.slug}
              name={p.name}
              description={p.description}
              imageUrl={p.imageUrl}
              basePrice={p.basePrice}
            />
          ))
        )}
      </div>
    </div>
  );
}
