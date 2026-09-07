"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-crust bg-char/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="font-display text-2xl tracking-tightest2 text-mozza">
          Forno Rosso
        </Link>
        <nav className="hidden gap-8 font-body text-sm text-semola/90 md:flex">
          <Link href="/menu/signatures" className="hover:text-sauce transition-colors">
            La carte
          </Link>
          <Link href="/#comment-ca-marche" className="hover:text-sauce transition-colors">
            Comment commander
          </Link>
          <Link href="/#contact" className="hover:text-sauce transition-colors">
            Nous trouver
          </Link>
        </nav>
        <Link
          href="/panier"
          className="relative flex items-center gap-2 rounded-full border border-sauce/60 px-4 py-2 text-sm text-semola hover:bg-sauce hover:text-mozza transition-colors"
        >
          Panier
          {totalItems > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-sauce text-xs font-semibold text-mozza">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
