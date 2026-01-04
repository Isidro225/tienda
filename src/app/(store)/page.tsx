import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Pagination } from "@/components/Pagination";

export default async function HomePage({
                                           searchParams,
                                       }: {
    searchParams: { cat?: string; q?: string; page?: string; pageSize?: string; brand?: string };
}) {
    const selected = searchParams.cat ?? "";
    const brand = (searchParams.brand ?? "").trim();
    const q = (searchParams.q ?? "").trim();

    const page = Math.max(1, Number(searchParams.page ?? "1") || 1);
    const pageSize = Math.min(36, Math.max(6, Number(searchParams.pageSize ?? "12") || 12));

    const where: any = {
        isActive: true,
        ...(selected ? { category: { slug: selected } } : {}),
        ...(brand ? { brand } : {}),
        ...(q
            ? {
                OR: [
                    { name: { contains: q, mode: "insensitive" } },
                    { description: { contains: q, mode: "insensitive" } },
                ],
            }
            : {}),
    };

    // categorías + marcas + total
    const [categories, brandsRaw, total] = await Promise.all([
        prisma.category.findMany({ orderBy: { name: "asc" } }),
        prisma.product.findMany({
            where: { isActive: true, brandId: { not: null } },
            distinct: ["brandId"],
            select: { brandId: true },
            orderBy: { brandId: "asc" },
        }),
        prisma.product.count({ where }),
    ]);

    const brands = brandsRaw.map((b) => b.brandId!).filter(Boolean);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(page, totalPages);
    const skip = (safePage - 1) * pageSize;

    const products = await prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <section className="rounded-2xl border border-app-border bg-white p-6 shadow-card">
                <h1 className="text-2xl font-black tracking-tight text-app-text">Productos de calidad</h1>
                <p className="mt-2 text-sm text-app-muted">Navegá por el catálogo y armá tu pedido en minutos.</p>
            </section>

            {/* ✅ Main + Sidebar */}
            <div className="grid gap-6 md:grid-cols-[1fr_790px] md:items-start">
                {/* Sidebar */}
                <aside className="md:sticky md:top-28">
                    <CategoryFilter
                        categories={categories}
                        selected={selected}
                        pageSize={pageSize}
                        search={q}
                        brands={brands}
                        selectedBrand={brand}
                        basePath="/"
                    />
                </aside>

                {/* Main */}

                <section>
                    {products.length === 0 ? (
                        <div className="rounded-2xl border border-app-border bg-white p-8 text-sm text-app-muted shadow-card">
                            No hay productos para esos filtros.
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
                                    extraParams={{
                                        ...(selected ? { cat: selected } : {}),
                                        ...(brand ? { brand } : {}),
                                        ...(q ? { q } : {}),
                                        pageSize: String(pageSize),
                                    }}
                                />
                            </div>
                        </>
                    )}
                </section>


            </div>
        </div>
    );
}
