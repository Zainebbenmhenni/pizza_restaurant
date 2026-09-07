"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartProvider";
import { formatPrice } from "@/lib/format";

type SizeOption = { id: string; label: string; extraPrice: number };

export function AddToCartForm({
  productId,
  productName,
  imageUrl,
  basePrice,
  sizes
}: {
  productId: string;
  productName: string;
  imageUrl: string;
  basePrice: number;
  sizes: SizeOption[];
}) {
  const { addLine } = useCart();
  const router = useRouter();
  const [sizeId, setSizeId] = useState<string | undefined>(sizes[0]?.id);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const selectedSize = sizes.find((s) => s.id === sizeId);
  const unitPrice = basePrice + (selectedSize?.extraPrice ?? 0);

  function handleAdd() {
    addLine(
      {
        key: sizeId ? `${productId}-${sizeId}` : productId,
        productId,
        productName,
        imageUrl,
        sizeId,
        sizeLabel: selectedSize?.label,
        unitPrice
      },
      quantity
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  }

  return (
    <div className="space-y-6">
      {sizes.length > 0 && (
        <div>
          <p className="mb-2 font-body text-sm text-semola/60">Taille</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSizeId(s.id)}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  sizeId === s.id
                    ? "border-sauce bg-sauce text-mozza"
                    : "border-crust text-semola/80 hover:border-sauce/60"
                }`}
              >
                {s.label} {s.extraPrice > 0 && `(+${formatPrice(s.extraPrice)})`}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <p className="font-body text-sm text-semola/60">Quantité</p>
        <div className="flex items-center gap-3 rounded-full border border-crust px-3 py-1">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="text-lg text-semola/80 hover:text-sauce"
            aria-label="Diminuer la quantité"
          >
            −
          </button>
          <span className="w-6 text-center font-body text-semola">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="text-lg text-semola/80 hover:text-sauce"
            aria-label="Augmenter la quantité"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-full bg-sauce px-8 py-3 font-body font-semibold text-mozza transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Ajouter — {formatPrice(unitPrice * quantity)}
        </button>
        {justAdded && (
          <button
            type="button"
            onClick={() => router.push("/panier")}
            className="font-body text-sm text-basil underline underline-offset-4"
          >
            Ajouté ! Voir le panier →
          </button>
        )}
      </div>
    </div>
  );
}
