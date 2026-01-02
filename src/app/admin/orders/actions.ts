"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const StatusSchema = z.enum(["PENDING","CONFIRMED","PREPARING","READY","DELIVERED","CANCELED"]);

export async function updateOrderStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const parsed = StatusSchema.safeParse(status);
  if (!parsed.success) return { ok: false as const, error: "Estado inválido." };

  await prisma.order.update({ where: { id }, data: { status: parsed.data } });
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  return { ok: true as const };
}

export async function deleteOrder(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  await prisma.order.delete({ where: { id } });
  revalidatePath("/admin/orders");
  return { ok: true as const };
}
