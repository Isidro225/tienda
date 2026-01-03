type PaginationProps = {
    page: number;
    totalPages: number;
    basePath: string;
    extraParams?: Record<string, string>;
};

function buildUrl(basePath: string, params: Record<string, string>) {
    const sp = new URLSearchParams(params);
    const qs = sp.toString();
    return qs ? `${basePath}?${qs}` : basePath;
}

export function Pagination({ page, totalPages, basePath, extraParams = {} }: PaginationProps) {
    if (totalPages <= 1) return null;

    const prev = Math.max(1, page - 1);
    const next = Math.min(totalPages, page + 1);

    // rango simple (hasta 7 botones)
    const start = Math.max(1, page - 3);
    const end = Math.min(totalPages, start + 6);
    const pages = [];
    for (let p = start; p <= end; p++) pages.push(p);

    return (
        <div className="flex flex-wrap items-center justify-center gap-2">
            <a
                className={`rounded-xl border px-3 py-2 text-sm font-semibold ${
                    page === 1 ? "pointer-events-none opacity-50 bg-white border-app-border" : "bg-white border-app-border"
                }`}
                href={buildUrl(basePath, { ...extraParams, page: String(prev) })}
            >
                Anterior
            </a>

            {pages.map((p) => (
                <a
                    key={p}
                    className={`rounded-xl border px-3 py-2 text-sm font-extrabold ${
                        p === page
                            ? "bg-app-accent text-white border-transparent"
                            : "bg-white border-app-border text-app-text"
                    }`}
                    href={buildUrl(basePath, { ...extraParams, page: String(p) })}
                >
                    {p}
                </a>
            ))}

            <a
                className={`rounded-xl border px-3 py-2 text-sm font-semibold ${
                    page === totalPages ? "pointer-events-none opacity-50 bg-white border-app-border" : "bg-white border-app-border"
                }`}
                href={buildUrl(basePath, { ...extraParams, page: String(next) })}
            >
                Siguiente
            </a>
        </div>
    );
}
