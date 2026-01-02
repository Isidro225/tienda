"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const CategorySchema = z.object({
    name: z.string().min(2).max(50),
});

function err(msg: string): never {
    redirect(`/admin/categories?error=${encodeURIComponent(msg)}`);
}

function ok(): never {
    redirect(`/admin/categories?ok=1`);
}

export async function createCategory(formData: FormData): Promise<void> {
    const name = String(formData.get("name") ?? "").trim();
    const parsed = CategorySchema.safeParse({ name });
    if (!parsed.success) err("Nombre inválido.");

    const slug = slugify(parsed.data.name);

    try {
        await prisma.category.create({ data: { name: parsed.data.name, slug } });
    } catch {
        err("No se pudo crear. ¿Ya existe una categoría con ese nombre?");
    }

    revalidatePath("/admin/categories");
    ok();
}

export async function updateCategory(formData: FormData): Promise<void> {
    const id = String(formData.get("id") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();

    if (!id) err("ID inválido.");

    const parsed = CategorySchema.safeParse({ name });
    if (!parsed.success) err("Nombre inválido.");

    const slug = slugify(parsed.data.name);

    try {
        await prisma.category.update({
            where: { id },
            data: { name: parsed.data.name, slug },
        });
    } catch {
        err("No se pudo actualizar la categoría.");
    }

    revalidatePath("/admin/categories");
    ok();
}

export async function deleteCategory(formData: FormData): Promise<void> {
    const id = String(formData.get("id") ?? "").trim();
    if (!id) err("ID inválido.");

    try {
        await prisma.category.delete({ where: { id } });
    } catch {
        err("No se pudo eliminar la categoría (puede estar en uso).");
    }

    revalidatePath("/admin/categories");
    ok();
}
