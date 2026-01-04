import { AdminTopbar } from "@/components/AdminTopbar";
import { requireAdmin } from "@/lib/admin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    await requireAdmin();

    return (
        <>
            <AdminTopbar />
            <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        </>
    );
}
