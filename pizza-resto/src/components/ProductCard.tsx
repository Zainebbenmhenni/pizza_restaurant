import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/format";

export function ProductCard({
  slug,
  name,
  description,
  imageUrl,
  basePrice
}: {
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  basePrice: number;
}) {
  return (
    <Link
      href={`/product/${slug}`}
      className="group flex gap-4 border-b border-crust py-5 first:pt-0 last:border-none"
    >
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-crust">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="96px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col justify-center">
        <h3 className="font-display text-lg text-mozza group-hover:text-sauce transition-colors">
          {name}
        </h3>
        <p className="mt-1 line-clamp-2 font-body text-sm text-semola/60">{description}</p>
        <p className="mt-2 font-body text-sm font-semibold text-semola">
          dès {formatPrice(basePrice)}
        </p>
      </div>
    </Link>
  );
}
