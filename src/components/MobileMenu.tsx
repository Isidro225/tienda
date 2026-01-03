"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

export function MobileMenu() {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    // ESC para cerrar
    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open]);

    // Bloquear scroll
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    const close = () => setOpen(false);

    const panel = (
        <>
            {/* Overlay real */}
            <div
                className="fixed inset-0 z-[100] bg-black/45"
                onClick={close}
                aria-hidden="true"
            />

            {/* Drawer */}
            <aside
                className="fixed left-0 top-0 z-[110] h-[100dvh] w-[86vw] max-w-sm bg-white shadow-2xl"
                role="dialog"
                aria-modal="true"
            >
                <div className="flex items-center justify-between border-b border-app-border p-4">
                    <div className="text-sm font-extrabold text-app-text">Menú</div>
                    <button
                        type="button"
                        onClick={close}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-app-border bg-white hover:bg-app-accentSoft"
                        aria-label="Cerrar menú"
                    >
                        ✕
                    </button>
                </div>

                <nav className="p-4">
                    <div className="flex flex-col gap-2">
                        <Link
                            href="/"
                            onClick={close}
                            className="rounded-xl px-3 py-3 text-sm font-semibold text-app-text hover:bg-app-accentSoft"
                        >
                            Inicio
                        </Link>

                        <Link
                            href="/pedido"
                            onClick={close}
                            className="rounded-xl px-3 py-3 text-sm font-semibold text-app-text hover:bg-app-accentSoft"
                        >
                            Hacer pedido
                        </Link>

                        <Link
                            href="/quienes-somos"
                            onClick={close}
                            className="rounded-xl px-3 py-3 text-sm font-semibold text-app-text hover:bg-app-accentSoft"
                        >
                            Quiénes somos
                        </Link>

                        <div className="mt-3 border-t border-app-border pt-3">
                            <Link
                                href="/admin/login"
                                onClick={close}
                                className="inline-flex w-full items-center justify-center rounded-xl bg-app-accent px-4 py-3 text-sm font-extrabold text-white"
                            >
                                Admin
                            </Link>
                        </div>
                    </div>
                </nav>
            </aside>
        </>
    );

    return (
        <>
            {/* Botón hamburguesa (solo móvil) */}
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-app-border bg-white hover:bg-app-accentSoft"
                aria-label="Abrir menú"
            >
                <div className="flex flex-col gap-1">
                    <span className="h-0.5 w-5 bg-app-text" />
                    <span className="h-0.5 w-5 bg-app-text" />
                    <span className="h-0.5 w-5 bg-app-text" />
                </div>
            </button>

            {mounted && open ? createPortal(panel, document.body) : null}
        </>
    );
}
