import Image from "next/image";
import Link from "next/link";
import { formatArsFromCents } from "@/lib/money";
import { Badge } from "@/components/ui/Badge";

type Props = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl: string | null;
  categoryName: string;
};

export function ProductCard(p: Props) {
  return (
    <Link
      href={`/product/${p.id}`}
      className="group overflow-hidden rounded-2xl border border-app-border bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-app-accentSoft">
        {p.imageUrl ? (
          <Image
            src={p.imageUrl}
            alt={p.name}
            fill
            className="object-cover transition group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="grid h-full w-full place-items-center">
            <span className="text-sm font-semibold text-app-muted">Sin imagen</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="line-clamp-1 text-sm font-extrabold tracking-tight text-app-text">
            {p.name}
          </h3>
          <Badge>{p.categoryName}</Badge>
        </div>
        <p className="line-clamp-2 text-sm text-app-muted">{p.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm font-extrabold text-app-text">{formatArsFromCents(p.priceCents)}</div>
          <span className="text-xs font-semibold text-app-muted">Ver detalle</span>
        </div>
      </div>
    </Link>
  );
}
