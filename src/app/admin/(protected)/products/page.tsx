import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { formatArsFromCents } from "@/lib/money";
import { toggleProductActive } from "./actions";
import { Pagination } from "@/components/Pagination";

export default async function ProductsPage({
                                               searchParams,
                                           }: {
    searchParams: { page?: string; pageSize?: string; q?: string; cat?: string };
}) {
    const page = Math.max(1, Number(searchParams.page ?? "1") || 1);
    const pageSize = Math.min(100, Math.max(10, Number(searchParams.pageSize ?? "20") || 20));
    const skip = (page - 1) * pageSize;

    const q = (searchParams.q ?? "").trim();
    const cat = (searchParams.cat ?? "").trim();

    const [categories, total, products] = await Promise.all([
        prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, slug: true } }),
        prisma.product.count({
            where: {
                ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
                ...(cat ? { category: { slug: cat } } : {}),
            },
        }),
        prisma.product.findMany({
            where: {
                ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
                ...(cat ? { category: { slug: cat } } : {}),
            },
            include: { category: true },
            orderBy: { createdAt: "desc" },
            skip,
            take: pageSize,
        }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    // helper para construir URLs conservando filtros
    const buildUrl = (overrides: Partial<{ page: string; pageSize: string; q: string; cat: string }>) => {
        const sp = new URLSearchParams({
            ...(q ? { q } : {}),
            ...(cat ? { cat } : {}),
            page: String(page),
            pageSize: String(pageSize),
            ...overrides,
        });
        return `/admin/products?${sp.toString()}`;
    };

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-app-border bg-white p-6 shadow-card">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-app-text">Productos</h1>
                        <p className="mt-2 text-sm text-app-muted">
                            Cada producto incluye nombre, descripción, precio, categoría e imagen.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <ButtonLink href="/admin/products/new" variant="primary">
                            Nuevo producto
                        </ButtonLink>
                    </div>
                </div>

                {/* ✅ Filtros (server, sin JS) */}
                <form className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto_auto]">
                    <input
                        name="q"
                        defaultValue={q}
                        placeholder="Buscar por nombre..."
                        className="w-full rounded-xl border border-app-border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-app-accent/30"
                    />

                    <select
                        name="cat"
                        defaultValue={cat}
                        className="w-full rounded-xl border border-app-border bg-white px-3 py-2 text-sm"
                    >
                        <option value="">Todas las categorías</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.slug}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    <div className="flex gap-2">
                        <select
                            name="pageSize"
                            defaultValue={String(pageSize)}
                            className="w-full rounded-xl border border-app-border bg-white px-3 py-2 text-sm"
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>

                        <button
                            type="submit"
                            className="rounded-xl bg-app-accent px-4 py-2 text-sm font-bold text-white"
                        >
                            Filtrar
                        </button>

                        {(q || cat) && (
                            <a
                                href="/admin/products"
                                className="rounded-xl border border-app-border bg-white px-4 py-2 text-sm font-bold text-app-text"
                            >
                                Limpiar
                            </a>
                        )}
                    </div>

                    {/* Reset page al filtrar */}
                    <input type="hidden" name="page" value="1" />
                </form>

                <div className="mt-3 text-xs text-app-muted">
                    Mostrando <span className="font-semibold">{products.length}</span> de{" "}
                    <span className="font-semibold">{total}</span> resultados.
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="text-left text-xs font-semibold text-app-muted">
                                <th className="px-5 py-3">Producto</th>
                                <th className="px-5 py-3">Categoría</th>
                                <th className="px-5 py-3 text-right">Precio</th>
                                <th className="px-5 py-3">Activo</th>
                                <th className="px-5 py-3 text-right">Acciones</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-app-border">
                            {products.map((p) => (
                                <tr key={p.id}>
                                    <td className="px-5 py-3">
                                        <div className="font-semibold text-app-text">{p.name}</div>
                                        <div className="line-clamp-1 text-xs text-app-muted">{p.description}</div>
                                    </td>
                                    <td className="px-5 py-3 text-app-text">{p.category.name}</td>
                                    <td className="px-5 py-3 text-right font-extrabold text-app-text">
                                        {formatArsFromCents(p.priceCents)}
                                    </td>
                                    <td className="px-5 py-3 text-app-text">{p.isActive ? "Sí" : "No"}</td>
                                    <td className="px-5 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/admin/products/${p.id}/edit`}
                                                className="rounded-xl border border-app-border bg-white px-3 py-2 text-sm font-semibold text-app-text hover:bg-app-accentSoft"
                                            >
                                                Editar
                                            </Link>

                                            <form action={toggleProductActive}>
                                                <input type="hidden" name="id" value={p.id} />
                                                <input type="hidden" name="next" value={String(!p.isActive)} />
                                                <button
                                                    type="submit"
                                                    className="rounded-xl border border-app-border bg-white px-3 py-2 text-sm font-semibold text-app-text hover:bg-app-accentSoft"
                                                >
                                                    {p.isActive ? "Desactivar" : "Activar"}
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-5 py-10 text-center text-sm text-app-muted">
                                        No hay productos con esos filtros.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    {/* ✅ Paginación abajo */}
                    {totalPages > 1 && (
                        <div className="border-t border-app-border bg-white px-5 py-4">
                            <Pagination
                                page={page}
                                totalPages={totalPages}
                                basePath="/admin/products"
                                extraParams={{
                                    ...(q ? { q } : {}),
                                    ...(cat ? { cat } : {}),
                                    pageSize: String(pageSize),
                                }}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
