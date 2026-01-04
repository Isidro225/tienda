import Link from "next/link";
import { CartClient } from "@/components/cart/CartClient";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "@/components/auth/LogoutButton";

export default async function PedidoPage() {
    const user = await getCurrentUser();
    const verified = Boolean(user?.phone && user?.phoneVerifiedAt);

    if (!user || !verified) {
        return (
            <div className="space-y-6">
                <div className="rounded-2xl border border-app-border bg-white p-6 shadow-card">
                    <h1 className="text-2xl font-black tracking-tight text-app-text">Hacer pedido</h1>
                    <p className="mt-2 text-sm text-app-muted">
                        Para realizar pedidos necesitás una cuenta con tu teléfono verificado por WhatsApp.
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-3">
                        <Link
                            href="/login?next=/pedido"
                            className="inline-flex items-center justify-center rounded-xl bg-app-accent px-4 py-2 text-sm font-extrabold text-white"
                        >
                            Ingresar y verificar
                        </Link>

                        <Link
                            href="/"
                            className="inline-flex items-center justify-center rounded-xl border border-app-border bg-white px-4 py-2 text-sm font-semibold text-app-text hover:bg-app-accentSoft"
                        >
                            Volver al catálogo
                        </Link>
                    </div>

                    {!user ? (
                        <div className="mt-4 text-xs text-app-muted">
                            Si ya sos cliente, ingresá con tu número y te enviamos un código por WhatsApp.
                        </div>
                    ) : (
                        <div className="mt-4 text-xs text-app-muted">
                            Tu cuenta existe, pero falta verificar el teléfono. Presioná “Ingresar y verificar”.
                        </div>
                    )}
                </div>
            </div>
        );
    }

    //  Usuario verificado: muestra el pedido normal
    return (
        <div className="space-y-6">

            <div className="rounded-2xl border border-app-border bg-white p-6 shadow-card">
                <h1 className="text-2xl font-black tracking-tight text-app-text">Hacer pedido</h1>
                <p className="mt-2 text-sm text-app-muted">
                    Armá tu pedido desde el catálogo y completá tus datos para enviarlo. El admin lo gestionará desde el panel.
                </p>

                <div className="mt-4 rounded-2xl border border-app-border bg-app-accentSoft p-4">
                    <div className="text-xs font-semibold text-app-muted">Cuenta verificada</div>
                    <div className="mt-1 text-sm font-extrabold text-app-text">
                        {user.name ? user.name : "Cliente"} · {user.phone}
                    </div>
                    <div className="mt-1 text-xs text-app-muted">
                        El teléfono se toma automáticamente de tu verificación por WhatsApp.
                    </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <LogoutButton />
                </div>

            </div>

            <CartClient />
        </div>
    );
}
