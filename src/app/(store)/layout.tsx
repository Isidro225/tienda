import { Topbar } from "@/components/Topbar";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Topbar />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <footer className="border-t border-app-border bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-app-muted">
          © {new Date().getFullYear()} Alsedo Osvaldo Lorenzo e Hijos. Panel admin protegido.
        </div>
      </footer>
    </div>
  );
}
