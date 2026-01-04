import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/Pagination";
import { createCategory, deleteCategory, updateCategory } from "./actions";

export default async function CategoriesPage({
                                                 searchParams,
                                             }: {
    searchParams: { page?: string; pageSize?: string; q?: string };
}) {
    const page = Math.max(1, Number(searchParams.page ?? "1") || 1);
    const pageSize = Math.min(100, Math.max(10, Number(searchParams.pageSize ?? "20") || 20));
    const skip = (page - 1) * pageSize;

    const q = (searchParams.q ?? "").trim();

    const where = {
        ...(q ? { name: { contains: q, mode: "insensitive" as const } } : {}),
    };

    const [total, categories] = await Promise.all([
        prisma.category.count({ where }),
        prisma.category.findMany({
            where,
            orderBy: { name: "asc" },
            skip,
            take: pageSize,
        }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-app-border bg-white p-6 shadow-card">
                <h1 className="text-2xl font-black tracking-tight text-app-text">Categorías</h1>
                <p className="mt-2 text-sm text-app-muted">
                    CRUD de categorías (nombre y slug automático).
                </p>

                {/* ✅ búsqueda + pageSize (server, sin JS) */}
                <form className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto_auto]">
                    <input
                        name="q"
                        defaultValue={q}
                        placeholder="Buscar categoría..."
                        className="w-full rounded-xl border border-app-border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-app-accent/30"
                    />

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

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="rounded-xl bg-app-accent px-4 py-2 text-sm font-bold text-white"
                        >
                            Filtrar
                        </button>

                        {q && (
                            <a
                                href="/admin/categories"
                                className="rounded-xl border border-app-border bg-white px-4 py-2 text-sm font-bold text-app-text"
                            >
                                Limpiar
                            </a>
                        )}
                    </div>

                    {/* reset page al filtrar */}
                    <input type="hidden" name="page" value="1" />
                </form>

                <div className="mt-3 text-xs text-app-muted">
                    Mostrando <span className="font-semibold">{categories.length}</span> de{" "}
                    <span className="font-semibold">{total}</span> resultados.
                </div>
            </div>

            <Card>
                <CardContent className="p-5">
                    <h2 className="text-sm font-extrabold text-app-text">Nueva categoría</h2>
                    <form action={createCategory} className="mt-3 flex flex-col gap-2 sm:flex-row">
                        <Input name="name" placeholder="Ej: Facturas" required />
                        <Button type="submit">Crear</Button>
                    </form>
                </CardContent>
            </Card>

            <div className="rounded-2xl border border-app-border bg-white p-6 shadow-card">
                <h2 className="text-sm font-extrabold text-app-text">Listado</h2>

                <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="text-left text-xs font-semibold text-app-muted">
                            <th className="py-2">Nombre</th>
                            <th className="py-2">Slug</th>
                            <th className="py-2 text-right">Acciones</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-app-border">
                        {categories.map((c) => (
                            <tr key={c.id} className="align-middle">
                                <td className="py-3">
                                    <form action={updateCategory} className="flex items-center gap-2">
                                        <input type="hidden" name="id" value={c.id} />
                                        <Input name="name" defaultValue={c.name} />
                                        <Button type="submit" variant="secondary">
                                            Guardar
                                        </Button>
                                    </form>
                                </td>

                                <td className="py-3 font-mono text-xs text-app-muted">{c.slug}</td>

                                <td className="py-3 text-right">
                                    <form action={deleteCategory}>
                                        <input type="hidden" name="id" value={c.id} />
                                        <Button type="submit" variant="danger">
                                            Eliminar
                                        </Button>
                                    </form>
                                </td>
                            </tr>
                        ))}

                        {categories.length === 0 && (
                            <tr>
                                <td colSpan={3} className="py-8 text-center text-sm text-app-muted">
                                    Sin categorías para estos filtros.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* ✅ paginación */}
                {totalPages > 1 && (
                    <div className="mt-5 border-t border-app-border pt-4">
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            basePath="/admin/categories"
                            extraParams={{
                                ...(q ? { q } : {}),
                                pageSize: String(pageSize),
                            }}
                        />
                    </div>
                )}

                <div className="mt-4 text-xs text-app-muted">
                    Nota: eliminar una categoría borrará sus productos (onDelete: Cascade).
                </div>
            </div>
        </div>
    );
}
