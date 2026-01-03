"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const StatusSchema = z.enum(["PENDING","CONFIRMED","PREPARING","READY","DELIVERED","CANCELED"]);

function err(msg: string): never {
    redirect(`/admin/orders?error=${encodeURIComponent(msg)}`);
}
function ok(): never {
    redirect(`/admin/orders?ok=1`);
}

export async function updateOrderStatus(formData: FormData): Promise<void> {
    const id = String(formData.get("id") ?? "").trim();
    const status = String(formData.get("status") ?? "").trim();

    if (!id) return err("ID inválido.");
    if (!status) return err("Estado inválido.");

    try {
        await prisma.order.update({
            where: { id },
            data: { status },
        });
    } catch {
        return err("No se pudo actualizar el pedido.");
    }

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);
    ok();
}

export async function deleteOrder(formData: FormData): Promise<void> {
    const id = String(formData.get("id") ?? "").trim();
    if (!id) return err("ID inválido.");

    try {
        await prisma.order.delete({ where: { id } });
    } catch {
        return err("No se pudo eliminar el pedido.");
    }

    revalidatePath("/admin/orders");
    ok();
}
