"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useTransition } from "react";

export function LogoutButton() {
    const router = useRouter();
    const [pending, start] = useTransition();

    return (
        <Button
            type="button"
            variant="secondary"
            disabled={pending}
            onClick={() =>
                start(async () => {
                    await fetch("/api/auth/logout", { method: "POST" });
                    router.refresh(); // re-render server components (PedidoPage) y topbar
                    router.push("/"); // opcional: volver al catálogo
                })
            }
        >
            {pending ? "Cerrando..." : "Cerrar sesión"}
        </Button>
    );
}
