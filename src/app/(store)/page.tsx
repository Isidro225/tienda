import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Pagination } from "@/components/Pagination";

export default async function HomePage({
                                           searchParams,
                                       }: {
    searchParams: { cat?: string; page?: string; pageSize?: string };
}) {
    const selected = searchParams.cat ?? "";

    const page = Math.max(1, Number(searchParams.page ?? "1") || 1);
    const pageSize = Math.min(36, Math.max(6, Number(searchParams.pageSize ?? "12") || 12));

    const where = {
        isActive: true,
        ...(selected ? { category: { slug: selected } } : {}),
    };

    // 1) Traemos categorías + total primero (en paralelo)
    const [categories, total] = await Promise.all([
        prisma.category.findMany({ orderBy: { name: "asc" } }),
        prisma.product.count({ where }),
    ]);

    // 2) Clamp: si page es mayor al total de páginas, lo bajamos
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(page, totalPages);

    // 3) Ahora sí calculamos skip con safePage
    const skip = (safePage - 1) * pageSize;

    // 4) Y recién ahora pedimos los productos
    const products = await prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
    });

    return (
        <div className="space-y-6">
            <section className="rounded-2xl border border-app-border bg-white p-6 shadow-card">
                <div className="grid gap-3 md:grid-cols-[1.2fr_0.8fr] md:items-start">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-app-text">Productos de calidad</h1>
                        <p className="mt-2 text-sm text-app-muted">
                            Navegá por el catálogo y armá tu pedido en minutos.
                        </p>
                    </div>

                    {/* Filtro compacto */}
                    <CategoryFilter categories={categories} selected={selected} pageSize={pageSize} />
                </div>
            </section>

            <section>
                {products.length === 0 ? (
                    <div className="rounded-2xl border border-app-border bg-white p-8 text-sm text-app-muted shadow-card">
                        No hay productos disponibles para esta categoría.
                    </div>
                ) : (
                    <>
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

                        <div className="mt-6">
                            <Pagination
                                page={safePage}
                                totalPages={totalPages}
                                basePath="/"
                                extraParams={{ ...(selected ? { cat: selected } : {}), pageSize: String(pageSize) }}
                            />
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}
