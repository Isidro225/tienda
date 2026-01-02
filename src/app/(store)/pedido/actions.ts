"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

const ItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(999),
});

const CreateOrderSchema = z.object({
  customerName: z.string().min(2).max(80),
  phone: z.string().min(6).max(30),
  address: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  items: z.array(ItemSchema).min(1),
});

export async function createOrder(input: unknown): Promise<{ ok: true; orderId: string } | { ok: false; error: string }> {
  const parsed = CreateOrderSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Datos inválidos." };

  const { customerName, phone, address, notes, items } = parsed.data;

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
      customerName,
      phone,
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
