import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { requireAdmin } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";

const tabs = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Productos" },
  { href: "/admin/categories", label: "Categorías" },
  { href: "/admin/orders", label: "Pedidos" },
];

export async function AdminTopbar() {
  const session = await requireAdmin();
  return (
    <header className="sticky top-0 z-40 border-b border-app-border bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm font-extrabold tracking-tight text-app-text">
            Panel Admin
          </Link>
          <span className="rounded-full bg-app-accentSoft px-2 py-1 text-xs font-semibold text-app-text">
            {session?.email}
          </span>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {tabs.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="rounded-xl px-3 py-2 text-sm font-semibold text-app-muted hover:bg-app-accentSoft hover:text-app-text"
            >
              {t.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href="/" variant="ghost">Ver tienda</ButtonLink>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
