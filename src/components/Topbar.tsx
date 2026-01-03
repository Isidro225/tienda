import Link from "next/link";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";

export async function Topbar() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL || "/Logo 2 .png"; // centered logo (env overrides local)
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
            </nav>

            <div className="pointer-events-none absolute left-1/2 -translate-x-1/2">
                <img
                    src={logoUrl}
                    alt="Logo"
                    className="h-24 w-auto object-contain md:h-24"
                />
            </div>

            <div className="ml-auto flex items-center gap-2">
          <ButtonLink href="/admin/login" variant="secondary">
            Admin
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
