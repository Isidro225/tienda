"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const ItemSchema = z.object({
    productId: z.string().min(1),
    quantity: z.number().int().min(1).max(999),
});

const CreateOrderSchema = z.object({
    customerName: z.string().min(2).max(80).optional(),
    address: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
    items: z.array(ItemSchema).min(1),
});

export async function createOrder(
    input: unknown
): Promise<{ ok: true; orderId: string } | { ok: false; error: string }> {
    // 1) exigir sesión
    const user = await getCurrentUser();
    if (!user) return { ok: false, error: "Tenés que iniciar sesión para hacer un pedido." };

    // 2) exigir verificación por WhatsApp
    if (!user.phone || !user.phoneVerifiedAt) {
        return { ok: false, error: "Tenés que verificar tu teléfono por WhatsApp para hacer un pedido." };
    }

    // 3) validar payload del pedido (sin phone)
    const parsed = CreateOrderSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: "Datos inválidos." };

    const { customerName, address, notes, items } = parsed.data;

    const products = await prisma.product.findMany({
        where: { id: { in: items.map((i) => i.productId) }, isActive: true },
    });

    if (products.length !== items.length) return { ok: false, error: "Uno o más productos no están disponibles." };

    const totalCents = items.reduce((acc, it) => {
        const p = products.find((x) => x.id === it.productId)!;
        return acc + p.priceCents * it.quantity;
    }, 0);

    const order = await prisma.order.create({
        data: {
            customerName: (customerName?.trim() || user.name || "Cliente").slice(0, 80),
            phone: user.phone, // siempre verificado
            address: address ?? null,
            notes: notes ?? null,
            totalCents,
            items: {
                create: items.map((it) => {
                    const p = products.find((x) => x.id === it.productId)!;
                    return {
                        productId: p.id,
                        quantity: it.quantity,
                        nameSnapshot: p.name,
                        priceCents: p.priceCents,
                    };
                }),
            },
        },
        select: { id: true },
    });

    return { ok: true, orderId: order.id };
}
