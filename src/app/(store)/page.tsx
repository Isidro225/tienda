import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";

export default async function HomePage({ searchParams }: { searchParams: { cat?: string } }) {
  const selected = searchParams.cat;

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(selected ? { category: { slug: selected } } : {}),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-app-border bg-white p-6 shadow-card">
        <div className="grid gap-3 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-app-text">
              Productos de calidad
            </h1>
            <p className="mt-2 text-sm text-app-muted">
              Navegá por el catálogo y armá tu pedido en minutos.
            </p>
          </div>
          <div className="rounded-2xl border border-app-border bg-app-accentSoft p-4">
            <div className="text-xs font-semibold text-app-muted">Filtro por categoría</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <a
                className={`rounded-full px-3 py-1 text-sm font-semibold border ${
                  !selected ? "bg-app-accent text-white border-transparent" : "bg-white border-app-border text-app-text"
                }`}
                href="/"
              >
                Todas
              </a>
              {categories.map((c) => (
                <a
                  key={c.id}
                  className={`rounded-full px-3 py-1 text-sm font-semibold border ${
                    selected === c.slug
                      ? "bg-app-accent text-white border-transparent"
                      : "bg-white border-app-border text-app-text"
                  }`}
                  href={`/?cat=${c.slug}`}
                >
                  {c.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        {products.length === 0 ? (
          <div className="rounded-2xl border border-app-border bg-white p-8 text-sm text-app-muted shadow-card">
            No hay productos disponibles para esta categoría.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                description={p.description}
                priceCents={p.priceCents}
                imageUrl={p.imageUrl}
                categoryName={p.category.name}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
