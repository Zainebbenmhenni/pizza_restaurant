"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/format";

export default function CommandePage() {
  const { lines, totalPrice, clear } = useCart();
  const router = useRouter();
  const [deliveryMode, setDeliveryMode] = useState<"LIVRAISON" | "A_EMPORTER">("LIVRAISON");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);

    const payload = {
      deliveryMode,
      customerName: form.get("customerName"),
      customerPhone: form.get("customerPhone"),
      customerEmail: form.get("customerEmail"),
      address: form.get("address"),
      city: form.get("city"),
      postalCode: form.get("postalCode"),
      notes: form.get("notes"),
      lines: lines.map((l) => ({
        productId: l.productId,
        sizeId: l.sizeId,
        quantity: l.quantity,
        unitPrice: l.unitPrice
      }))
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Une erreur est survenue.");
      clear();
      router.push(`/commande/confirmee?id=${data.orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <p className="font-body text-semola/60">Votre panier est vide.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <h1 className="font-display text-3xl text-mozza">Finaliser la commande</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="flex gap-2">
          {(["LIVRAISON", "A_EMPORTER"] as const).map((mode) => (
            <button
              type="button"
              key={mode}
              onClick={() => setDeliveryMode(mode)}
              className={`flex-1 rounded-full border px-4 py-3 font-body text-sm transition-colors ${
                deliveryMode === mode
                  ? "border-sauce bg-sauce text-mozza"
                  : "border-crust text-semola/70"
              }`}
            >
              {mode === "LIVRAISON" ? "Livraison" : "À emporter"}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nom complet" name="customerName" required />
          <Field label="Téléphone" name="customerPhone" type="tel" required />
        </div>
        <Field label="E-mail" name="customerEmail" type="email" required />

        {deliveryMode === "LIVRAISON" && (
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <Field label="Adresse" name="address" required />
            </div>
            <Field label="Code postal" name="postalCode" required />
            <div className="sm:col-span-2">
              <Field label="Ville" name="city" required />
            </div>
          </div>
        )}

        <div>
          <label className="mb-1 block font-body text-sm text-semola/60">
            Notes pour le restaurant (optionnel)
          </label>
          <textarea
            name="notes"
            rows={3}
            className="w-full rounded-lg border border-crust bg-transparent px-4 py-3 font-body text-semola placeholder:text-semola/30 focus:border-sauce"
            placeholder="Allergies, code d'entrée, etc."
          />
        </div>

        <div className="flex items-center justify-between border-t border-crust pt-6 font-body">
          <span className="text-semola/70">Total à payer</span>
          <span className="text-xl font-semibold text-mozza">{formatPrice(totalPrice)}</span>
        </div>

        {error && <p className="font-body text-sm text-sauce">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-sauce px-7 py-3 font-body font-semibold text-mozza transition-transform hover:scale-[1.01] disabled:opacity-50"
        >
          {loading ? "Envoi en cours…" : "Confirmer la commande"}
        </button>
        <p className="text-center font-body text-xs text-semola/40">
          Paiement à la livraison — l'intégration d'un paiement en ligne (Stripe) se branche ici.
        </p>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block font-body text-sm text-semola/60">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-lg border border-crust bg-transparent px-4 py-3 font-body text-semola focus:border-sauce"
      />
    </div>
  );
}
