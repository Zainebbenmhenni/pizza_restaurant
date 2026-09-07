"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/format";

const MINIMUM_ORDER = 1500; // 15,00 €

export default function PanierPage() {
  const { lines, removeLine, setQuantity, totalPrice } = useCart();

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <h1 className="font-display text-3xl text-mozza">Votre panier est vide</h1>
        <p className="mt-3 font-body text-semola/60">
          Parcourez la carte et ajoutez vos pizzas préférées.
        </p>
        <Link
          href="/menu/signatures"
          className="mt-8 inline-block rounded-full bg-sauce px-7 py-3 font-body font-semibold text-mozza"
        >
          Voir la carte
        </Link>
      </div>
    );
  }

  const remainingForMinimum = MINIMUM_ORDER - totalPrice;

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <h1 className="font-display text-3xl text-mozza">Votre panier</h1>

      <div className="mt-8 divide-y divide-crust">
        {lines.map((l) => (
          <div key={l.key} className="flex gap-4 py-5">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-crust">
              <Image src={l.imageUrl} alt={l.productName} fill sizes="80px" className="object-cover" />
            </div>
            <div className="flex flex-1 flex-col justify-center">
              <h3 className="font-display text-mozza">{l.productName}</h3>
              {l.sizeLabel && <p className="font-body text-xs text-semola/50">{l.sizeLabel}</p>}
              <p className="mt-1 font-body text-sm text-semola/70">{formatPrice(l.unitPrice)}</p>
            </div>
            <div className="flex flex-col items-end justify-between">
              <button
                onClick={() => removeLine(l.key)}
                className="font-body text-xs text-semola/40 hover:text-sauce"
              >
                Retirer
              </button>
              <div className="flex items-center gap-2 rounded-full border border-crust px-3 py-1">
                <button
                  onClick={() => setQuantity(l.key, l.quantity - 1)}
                  className="text-semola/80 hover:text-sauce"
                  aria-label="Diminuer"
                >
                  −
                </button>
                <span className="w-5 text-center font-body text-sm text-semola">{l.quantity}</span>
                <button
                  onClick={() => setQuantity(l.key, l.quantity + 1)}
                  className="text-semola/80 hover:text-sauce"
                  aria-label="Augmenter"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t border-crust pt-6">
        <div className="flex items-center justify-between font-body">
          <span className="text-semola/70">Total</span>
          <span className="text-xl font-semibold text-mozza">{formatPrice(totalPrice)}</span>
        </div>

        {remainingForMinimum > 0 ? (
          <p className="mt-2 font-body text-sm text-semola/50">
            Ajoutez {formatPrice(remainingForMinimum)} pour atteindre le minimum de commande
            ({formatPrice(MINIMUM_ORDER)}).
          </p>
        ) : (
          <Link
            href="/commande"
            className="mt-6 block rounded-full bg-sauce px-7 py-3 text-center font-body font-semibold text-mozza transition-transform hover:scale-[1.01]"
          >
            Passer la commande
          </Link>
        )}
      </div>
    </div>
  );
}
