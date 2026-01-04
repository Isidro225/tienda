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
                                   search,
                                   brands = [],
                                   selectedBrand = "",
                                   basePath = "/",
                               }: {
    categories: Category[];
    selected: string;
    pageSize: number;
    search?: string;

    // ✅ NUEVO
    brands?: string[];
    selectedBrand?: string;

    basePath?: string;
}) {
    const [catFilterText, setCatFilterText] = useState("");
    const [brandFilterText, setBrandFilterText] = useState("");

    const [expandedCats, setExpandedCats] = useState(false);
    const [expandedBrands, setExpandedBrands] = useState(false);

    const filteredCats = useMemo(() => {
        const s = catFilterText.trim().toLowerCase();
        if (!s) return categories;
        return categories.filter((c) => c.name.toLowerCase().includes(s));
    }, [catFilterText, categories]);

    const filteredBrands = useMemo(() => {
        const s = brandFilterText.trim().toLowerCase();
        if (!s) return brands;
        return brands.filter((b) => b.toLowerCase().includes(s));
    }, [brandFilterText, brands]);

    const CAT_LIMIT = 12;
    const BRAND_LIMIT = 10;

    const visibleCats = expandedCats ? filteredCats : filteredCats.slice(0, CAT_LIMIT);
    const visibleBrands = expandedBrands ? filteredBrands : filteredBrands.slice(0, BRAND_LIMIT);

    const hasMoreCats = filteredCats.length > CAT_LIMIT;
    const hasMoreBrands = filteredBrands.length > BRAND_LIMIT;

    return (
        <div className="rounded-2xl border border-app-border bg-app-accentSoft p-4">
            {/* =======================
          CATEGORÍAS
          ======================= */}
            <div className="flex items-center justify-between gap-2">
                <div className="text-xs font-semibold text-app-muted">Categorías</div>
                {hasMoreCats && (
                    <button
                        type="button"
                        onClick={() => setExpandedCats((v) => !v)}
                        className="text-xs font-bold text-app-accent hover:underline"
                    >
                        {expandedCats ? "Ver menos" : "Ver más"}
                    </button>
                )}
            </div>

            <input
                value={catFilterText}
                onChange={(e) => setCatFilterText(e.target.value)}
                placeholder="Buscar categoría..."
                className="mt-2 w-full rounded-xl border border-app-border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-app-accent/30"
            />

            <div className="mt-3 max-h-[220px] overflow-auto pr-1">
                <div className="flex flex-wrap gap-2">
                    <a
                        className={`rounded-full px-3 py-1 text-sm font-semibold border ${
                            !selected
                                ? "bg-app-accent text-white border-transparent"
                                : "bg-white border-app-border text-app-text"
                        }`}
                        href={buildHref(basePath, {
                            q: search,
                            brand: selectedBrand || undefined,
                            page: "1",
                            pageSize: String(pageSize),
                        })}
                    >
                        Todas
                    </a>

                    {visibleCats.map((c) => (
                        <a
                            key={c.id}
                            className={`rounded-full px-3 py-1 text-sm font-semibold border ${
                                selected === c.slug
                                    ? "bg-app-accent text-white border-transparent"
                                    : "bg-white border-app-border text-app-text"
                            }`}
                            href={buildHref(basePath, {
                                q: search,
                                cat: c.slug,
                                brand: selectedBrand || undefined,
                                page: "1",
                                pageSize: String(pageSize),
                            })}
                            title={c.name}
                        >
                            {c.name}
                        </a>
                    ))}
                </div>
            </div>

            {/* =======================
          MARCAS
          ======================= */}
            <div className="mt-5 border-t border-app-border pt-4">
                <div className="flex items-center justify-between gap-2">
                    <div className="text-xs font-semibold text-app-muted">Marcas</div>
                    {hasMoreBrands && (
                        <button
                            type="button"
                            onClick={() => setExpandedBrands((v) => !v)}
                            className="text-xs font-bold text-app-accent hover:underline"
                        >
                            {expandedBrands ? "Ver menos" : "Ver más"}
                        </button>
                    )}
                </div>

                <input
                    value={brandFilterText}
                    onChange={(e) => setBrandFilterText(e.target.value)}
                    placeholder="Buscar marca..."
                    className="mt-2 w-full rounded-xl border border-app-border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-app-accent/30"
                />

                <div className="mt-3 max-h-[220px] overflow-auto pr-1">
                    <div className="flex flex-wrap gap-2">
                        <a
                            className={`rounded-full px-3 py-1 text-sm font-semibold border ${
                                !selectedBrand
                                    ? "bg-app-accent text-white border-transparent"
                                    : "bg-white border-app-border text-app-text"
                            }`}
                            href={buildHref(basePath, {
                                q: search,
                                cat: selected || undefined,
                                page: "1",
                                pageSize: String(pageSize),
                            })}
                        >
                            Todas
                        </a>

                        {visibleBrands.map((b) => (
                            <a
                                key={b}
                                className={`rounded-full px-3 py-1 text-sm font-semibold border ${
                                    selectedBrand === b
                                        ? "bg-app-accent text-white border-transparent"
                                        : "bg-white border-app-border text-app-text"
                                }`}
                                href={buildHref(basePath, {
                                    q: search,
                                    cat: selected || undefined,
                                    brand: b,
                                    page: "1",
                                    pageSize: String(pageSize),
                                })}
                                title={b}
                            >
                                {b}
                            </a>
                        ))}
                    </div>
                </div>

                {brands.length === 0 && (
                    <div className="mt-3 text-xs text-app-muted">
                        No hay marcas cargadas todavía.
                    </div>
                )}
            </div>
        </div>
    );
}
