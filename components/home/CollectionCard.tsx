import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CollectionCard({ title, desc, link }: { title: string; desc: string; link: string }) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-iba-muted/25 bg-white shadow-sm transition-all hover:shadow-lg">
      <div className="flex-grow p-8">
        <h3 className="mb-4 text-2xl font-bold text-iba-navy transition-colors group-hover:text-iba-blue">
          {title}
        </h3>
        <p className="mb-6 text-sm leading-relaxed text-iba-navy/80">{desc}</p>
      </div>
      <div className="mt-auto px-8 pb-8">
        <Link
          href={link}
          className="inline-flex items-center font-semibold text-iba-blue transition-colors hover:text-iba-orange"
        >
          Galerie produits
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
