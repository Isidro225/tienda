"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function err(msg: string): never {
    redirect(`/admin/products?error=${encodeURIComponent(msg)}`);
}
function ok(): never {
    redirect(`/admin/products?ok=1`);
}

const ProductSchema = z.object({
    name: z.string().min(2).max(80),

    brandId: z
        .string()
        .optional()
        .transform((v) => {
            const s = (v ?? "").trim();
            return s.length ? s : null;
        }),

    description: z.string().min(2).max(800),
    price: z.coerce.number().positive(),
    categoryId: z.string().min(1),
    imageUrl: z.string().url().optional().or(z.literal("")),
});

function toCents(price: number) {
    return Math.round(price * 100);
}

export async function createProduct(formData: FormData): Promise<void> {
    const raw = {
        name: String(formData.get("name") ?? "").trim(),
        brandId: String(formData.get("brandId") ?? "").trim(),

        description: String(formData.get("description") ?? "").trim(),
        price: formData.get("price"),
        categoryId: String(formData.get("categoryId") ?? "").trim(),
        imageUrl: String(formData.get("imageUrl") ?? "").trim(),
    };

    const parsed = ProductSchema.safeParse(raw);
    if (!parsed.success) return err("Datos inválidos.");

    const slug = slugify(parsed.data.name);

    try {
        await prisma.product.create({
            data: {
                name: parsed.data.name,
                slug,
                description: parsed.data.description,
                priceCents: toCents(parsed.data.price),
                categoryId: parsed.data.categoryId,
                imageUrl: parsed.data.imageUrl || null,
                isActive: true,
                brandId: parsed.data.brandId,
            },
        });
    } catch {
        return err("No se pudo crear el producto.");
    }

    revalidatePath("/admin/products");
    ok();
}

export async function updateProduct(formData: FormData): Promise<void> {
    const id = String(formData.get("id") ?? "").trim();
    if (!id) return err("ID inválido.");

    const raw = {
        name: String(formData.get("name") ?? "").trim(),
        brandId: String(formData.get("brandId") ?? "").trim(),

        description: String(formData.get("description") ?? "").trim(),
        price: formData.get("price"),
        categoryId: String(formData.get("categoryId") ?? "").trim(),
        imageUrl: String(formData.get("imageUrl") ?? "").trim(),
    };

    const parsed = ProductSchema.safeParse(raw);
    if (!parsed.success) return err("Datos inválidos.");

    const slug = slugify(parsed.data.name);

    try {
        await prisma.product.update({
            where: { id },
            data: {
                name: parsed.data.name,
                slug,
                description: parsed.data.description,
                priceCents: toCents(parsed.data.price),
                categoryId: parsed.data.categoryId,
                imageUrl: parsed.data.imageUrl || null,
                brandId: parsed.data.brandId,
            },
        });
    } catch {
        return err("No se pudo actualizar el producto.");
    }

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}/edit`);
    ok();
}
