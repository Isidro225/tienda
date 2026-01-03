"use client";

import { useMemo, useState } from "react";

type Category = { id: string; name: string; slug: string };

function buildHref(basePath: string, params: Record<string, string | undefined>) {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
        if (v && v.trim().length > 0) sp.set(k, v);
    }
    const qs = sp.toString();
    return qs ? `${basePath}?${qs}` : basePath;
}

export function CategoryFilter({
                                   categories,
                                   selected,
                                   pageSize,
                                   basePath = "/",
                               }: {
    categories: Category[];
    selected: string;
    pageSize: number;
    basePath?: string;
}) {
    const [q, setQ] = useState("");
    const [expanded, setExpanded] = useState(false);

    const filtered = useMemo(() => {
        const s = q.trim().toLowerCase();
        if (!s) return categories;
        return categories.filter((c) => c.name.toLowerCase().includes(s));
    }, [q, categories]);

    const visible = expanded ? filtered : filtered.slice(0, 12);
    const hasMore = filtered.length > 12;

    return (
        <div className="rounded-2xl border border-app-border bg-app-accentSoft p-4">
            <div className="flex items-center justify-between gap-2">
                <div className="text-xs font-semibold text-app-muted">Filtro por categoría</div>
                {hasMore && (
                    <button
                        type="button"
                        onClick={() => setExpanded((v) => !v)}
                        className="text-xs font-bold text-app-accent hover:underline"
                    >
                        {expanded ? "Ver menos" : "Ver más"}
                    </button>
                )}
            </div>

            <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar categoría..."
                className="mt-2 w-full rounded-xl border border-app-border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-app-accent/30"
            />

            <div className="mt-3 max-h-[280px] overflow-auto pr-1">
                <div className="flex flex-wrap gap-2">
                    <a
                        className={`rounded-full px-3 py-1 text-sm font-semibold border ${
                            !selected
                                ? "bg-app-accent text-white border-transparent"
                                : "bg-white border-app-border text-app-text"
                        }`}
                        href={buildHref(basePath, { page: "1", pageSize: String(pageSize) })}
                    >
                        Todas
                    </a>

                    {visible.map((c) => (
                        <a
                            key={c.id}
                            className={`rounded-full px-3 py-1 text-sm font-semibold border ${
                                selected === c.slug
                                    ? "bg-app-accent text-white border-transparent"
                                    : "bg-white border-app-border text-app-text"
                            }`}
                            href={buildHref(basePath, { cat: c.slug, page: "1", pageSize: String(pageSize) })}
                            title={c.name}
                        >
                            {c.name}
                        </a>
                    ))}
                </div>
            </div>

            {q.trim() && filtered.length === 0 && (
                <div className="mt-3 text-xs text-app-muted">No se encontraron categorías.</div>
            )}
        </div>
    );
}
