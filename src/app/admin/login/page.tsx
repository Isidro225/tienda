import Link from "next/link";
import { adminLogin } from "./actions";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default async function AdminLoginPage({
                                                 searchParams,
                                             }: {
    searchParams: { error?: string };
}) {
    const user = await getCurrentUser();

    // Si ya está logueado como admin, lo mandamos al panel
    if (user?.role === "ADMIN") redirect("/admin");

    return (
        <div className="mx-auto max-w-md space-y-6">
            <div className="rounded-2xl border border-app-border bg-white p-6 shadow-card">
                <h1 className="text-2xl font-black tracking-tight text-app-text">Acceso Admin</h1>
                <p className="mt-2 text-sm text-app-muted">
                    Ingresá con email y contraseña para acceder al panel.
                </p>
            </div>

            {searchParams.error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {searchParams.error}
                </div>
            ) : null}

            <Card>
                <CardContent className="p-5">
                    <form action={adminLogin} className="grid gap-4">
                        <div className="grid gap-2">
                            <label className="text-xs font-semibold text-app-muted">Email</label>
                            <Input name="email" type="email" required placeholder="admin@alsedo.com" />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-xs font-semibold text-app-muted">Contraseña</label>
                            <Input name="password" type="password" required placeholder="••••••••" />
                        </div>

                        <Button type="submit">Ingresar</Button>

                        <div className="text-center text-sm text-app-muted">
                            <Link href="/" className="font-semibold text-app-accent hover:underline">
                                Volver a la tienda
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
