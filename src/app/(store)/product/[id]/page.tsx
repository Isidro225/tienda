import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatArsFromCents } from "@/lib/money";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { ButtonLink } from "@/components/ui/Button";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { category: true },
  });

  if (!product || !product.isActive) {
    return (
      <div className="rounded-2xl border border-app-border bg-white p-8 text-sm text-app-muted shadow-card">
        Producto no encontrado.
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
      <div className="overflow-hidden rounded-2xl border border-app-border bg-white shadow-card">
        <div className="relative aspect-[4/3] w-full bg-app-accentSoft">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="grid h-full place-items-center">
              <span className="text-sm font-semibold text-app-muted">Sin imagen</span>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-app-border bg-white p-6 shadow-card">
        <div className="text-xs font-semibold text-app-muted">{product.category.name}</div>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-app-text">{product.name}</h1>
        <div className="mt-2 text-lg font-black text-app-text">{formatArsFromCents(product.priceCents)}</div>
        <p className="mt-4 text-sm text-app-muted">{product.description}</p>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <AddToCartButton
            productId={product.id}
            name={product.name}
            priceCents={product.priceCents}
            imageUrl={product.imageUrl}
          />
          <ButtonLink href="/pedido" variant="secondary">
            Ir al pedido
          </ButtonLink>
        </div>

      </div>
    </div>
  );
}
