import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CommandeConfirmeePage({
  searchParams
}: {
  searchParams: { id?: string };
}) {
  const order = searchParams.id
    ? await prisma.order.findUnique({ where: { id: searchParams.id } })
    : null;

  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <h1 className="font-display text-3xl text-mozza">Merci{order ? `, ${order.customerName}` : ""} !</h1>
      <p className="mt-4 font-body text-semola/70">
        Votre commande a bien été enregistrée
        {order ? ` (n° ${order.id.slice(-6).toUpperCase()})` : ""}. Le restaurant la prépare.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-sauce px-7 py-3 font-body font-semibold text-mozza"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
