import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export async function requireAdmin() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/admin/login");
    }

    if (user.role !== "ADMIN") {
        // Podés redirigir al home o a una pantalla 403
        redirect("/");
    }

    return user;
}
