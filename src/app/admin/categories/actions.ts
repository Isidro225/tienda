"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { revalidatePath } from "next/cache";

const CategorySchema = z.object({
  name: z.string().min(2).max(50),
});

export async function createCategory(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const parsed = CategorySchema.safeParse({ name });
  if (!parsed.success) return { ok: false as const, error: "Nombre inválido." };

  const slug = slugify(parsed.data.name);

  await prisma.category.create({ data: { name: parsed.data.name, slug } });
  revalidatePath("/admin/categories");
  return { ok: true as const };
}

export async function updateCategory(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const parsed = CategorySchema.safeParse({ name });
  if (!parsed.success) return { ok: false as const, error: "Nombre inválido." };

  const slug = slugify(parsed.data.name);
  await prisma.category.update({ where: { id }, data: { name: parsed.data.name, slug } });
  revalidatePath("/admin/categories");
  return { ok: true as const };
}

export async function deleteCategory(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  return { ok: true as const };
}
