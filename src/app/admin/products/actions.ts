"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const ProductSchema = z.object({
  name: z.string().min(2).max(80),
  description: z.string().min(5).max(500),
  priceCents: z.number().int().min(1),
  categoryId: z.string().min(1),
  imageUrl: z.string().url().optional().or(z.literal("")).optional(),
  isActive: z.boolean().optional(),
});

function centsFromInput(input: string) {
  // UI takes ARS in pesos, optionally with decimals
  const normalized = input.replace(",", ".").trim();
  const value = Number(normalized);
  if (!Number.isFinite(value)) return null;
  return Math.round(value * 100);
}

export async function createProduct(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = String(formData.get("price") ?? "");
  const categoryId = String(formData.get("categoryId") ?? "");
  const imageUrl = String(formData.get("imageUrl") ?? "");
  const isActive = String(formData.get("isActive") ?? "") === "on";

  const priceCents = centsFromInput(price);
  if (priceCents === null) return { ok: false as const, error: "Precio inválido." };

  const parsed = ProductSchema.safeParse({ name, description, priceCents, categoryId, imageUrl, isActive });
  if (!parsed.success) return { ok: false as const, error: "Datos inválidos." };

  await prisma.product.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      priceCents: parsed.data.priceCents,
      categoryId: parsed.data.categoryId,
      imageUrl: parsed.data.imageUrl || null,
      isActive: parsed.data.isActive ?? true,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
  return { ok: true as const };
}

export async function updateProduct(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = String(formData.get("price") ?? "");
  const categoryId = String(formData.get("categoryId") ?? "");
  const imageUrl = String(formData.get("imageUrl") ?? "");
  const isActive = String(formData.get("isActive") ?? "") === "on";

  const priceCents = centsFromInput(price);
  if (priceCents === null) return { ok: false as const, error: "Precio inválido." };

  const parsed = ProductSchema.safeParse({ name, description, priceCents, categoryId, imageUrl, isActive });
  if (!parsed.success) return { ok: false as const, error: "Datos inválidos." };

  await prisma.product.update({
    where: { id },
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      priceCents: parsed.data.priceCents,
      categoryId: parsed.data.categoryId,
      imageUrl: parsed.data.imageUrl || null,
      isActive: parsed.data.isActive ?? true,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath(`/product/${id}`);
  return { ok: true as const };
}

export async function deleteProduct(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/");
  return { ok: true as const };
}
