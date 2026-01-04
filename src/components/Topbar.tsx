import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function Topbar() {
    // Si no lo estás usando, podés borrar categories para no pegarle a la DB acá
    // const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

    const user = await getCurrentUser();

    const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL || "/Logo 2 .png";

    return (
        <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
            <div className="relative mx-auto flex h-20 max-w-6xl items-center px-4 md:h-24">
                <nav className="hidden items-center gap-3 md:flex">
                    <Link className="text-sm font-semibold text-app-text hover:opacity-80" href="/">
                        Inicio
                    </Link>
                    <Link className="text-sm font-semibold text-app-text hover:opacity-80" href="/pedido">
                        Hacer pedido
                    </Link>
                    <Link className="text-sm font-semibold text-app-text hover:opacity-80" href="/quienes-somos">
                        Quiénes somos
                    </Link>
                </nav>

                <div className="pointer-events-none absolute left-1/2 -translate-x-1/2">
                    <img src={logoUrl} alt="Logo" className="h-24 w-auto object-contain md:h-24" />
                </div>

                <div className="ml-auto flex items-center gap-2">
                    {!user ? (
                        // ✅ antes decía Admin: ahora "Iniciar sesión"
                        <ButtonLink href="/login" variant="secondary">
                            Iniciar sesión
                        </ButtonLink>
                    ) : (
                        <>
                            <ButtonLink href="/pedido" variant="secondary">
                                Mi cuenta
                            </ButtonLink>

                            {user.role === "ADMIN" ? (
                                <ButtonLink href="/admin" variant="secondary">
                                    Panel admin
                                </ButtonLink>
                            ) : null}
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
