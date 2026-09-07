import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const categories = await prisma.category.findMany({ orderBy: { position: "asc" } });
  const signature = await prisma.product.findFirst({
    where: { category: { slug: "signatures" } }
  });

  return (
    <>
      <section className="relative overflow-hidden border-b border-crust">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="font-body text-sm text-sauce">Four à bois · Pâte 72h · Paris 11e</p>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] text-mozza md:text-6xl">
              La pizza napolitaine, sans compromis sur la pâte.
            </h1>
            <p className="mt-6 max-w-md font-body text-semola/70">
              Fermentation longue, mozzarella fior di latte, tomates San Marzano. Cuite en 90
              secondes, livrée chez vous en 30 minutes.
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                href="/menu/signatures"
                className="rounded-full bg-sauce px-7 py-3 font-body font-semibold text-mozza transition-transform hover:scale-[1.02]"
              >
                Voir la carte
              </Link>
              <Link
                href="#comment-ca-marche"
                className="rounded-full border border-crust px-7 py-3 font-body text-semola/80 hover:border-sauce/60"
              >
                Comment ça marche
              </Link>
            </div>
          </div>
          {signature && (
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-crust">
              <Image
                src={signature.imageUrl}
                alt={signature.name}
                fill
                sizes="(min-width: 768px) 480px, 100vw"
                className="object-cover"
                priority
              />
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <h2 className="font-display text-2xl text-mozza">Parcourir la carte</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/menu/${c.slug}`}
              className="group rounded-xl border border-crust p-6 transition-colors hover:border-sauce/60"
            >
              <h3 className="font-display text-xl text-mozza group-hover:text-sauce transition-colors">
                {c.name}
              </h3>
              <p className="mt-2 font-body text-sm text-semola/50">Voir les produits →</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="comment-ca-marche" className="border-t border-crust bg-crust/30">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="font-display text-2xl text-mozza">Comment ça marche</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            <div>
              <p className="font-display text-3xl text-sauce">1</p>
              <h3 className="mt-2 font-display text-lg text-mozza">Choisissez vos pizzas</h3>
              <p className="mt-1 font-body text-sm text-semola/60">
                Parcourez la carte et ajoutez au panier en un clic.
              </p>
            </div>
            <div>
              <p className="font-display text-3xl text-sauce">2</p>
              <h3 className="mt-2 font-display text-lg text-mozza">Livraison ou à emporter</h3>
              <p className="mt-1 font-body text-sm text-semola/60">
                Renseignez votre adresse ou passez récupérer sur place.
              </p>
            </div>
            <div>
              <p className="font-display text-3xl text-sauce">3</p>
              <h3 className="mt-2 font-display text-lg text-mozza">Dégustez</h3>
              <p className="mt-1 font-body text-sm text-semola/60">
                Reçue chaude en 30 à 45 minutes, directement du four.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
