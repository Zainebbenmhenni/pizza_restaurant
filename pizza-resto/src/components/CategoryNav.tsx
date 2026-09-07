import Link from "next/link";

export function CategoryNav({
  categories,
  activeSlug
}: {
  categories: { slug: string; name: string }[];
  activeSlug?: string;
}) {
  return (
    <div className="scrollbar-none -mx-5 flex gap-2 overflow-x-auto px-5 pb-2">
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={`/menu/${c.slug}`}
          className={`shrink-0 rounded-full border px-4 py-2 text-sm font-body transition-colors ${
            activeSlug === c.slug
              ? "border-sauce bg-sauce text-mozza"
              : "border-crust text-semola/80 hover:border-sauce/60"
          }`}
        >
          {c.name}
        </Link>
      ))}
    </div>
  );
}
