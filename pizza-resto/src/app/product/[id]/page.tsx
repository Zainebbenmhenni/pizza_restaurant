import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { AddToCartForm } from "@/components/AddToCartForm";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.id },
    include: { sizes: true, category: true }
  });
  if (!product) notFound();

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-5 py-12 md:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-crust">
        <Image src={product.imageUrl} alt={product.name} fill className="object-cover" priority />
      </div>
      <div>
        <p className="font-body text-sm text-sauce">{product.category.name}</p>
        <h1 className="mt-2 font-display text-3xl text-mozza">{product.name}</h1>
        <p className="mt-4 font-body text-semola/70">{product.description}</p>
        <p className="mt-4 font-body text-lg font-semibold text-semola">
          {formatPrice(product.basePrice)}
        </p>

        <div className="mt-8">
          <AddToCartForm
            productId={product.id}
            productName={product.name}
            imageUrl={product.imageUrl}
            basePrice={product.basePrice}
            sizes={product.sizes.map((s) => ({ id: s.id, label: s.label, extraPrice: s.extraPrice }))}
          />
        </div>
      </div>
    </div>
  );
}
