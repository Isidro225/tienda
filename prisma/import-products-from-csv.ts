import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { PrismaClient } from "@prisma/client";

// si ya tenés slugify en "@/lib/slug", podés importarlo.
// Para que el script no dependa de alias, dejo un slugify local.
function slugify(input: string) {
    return input
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}

const prisma = new PrismaClient();

/**
 * Qué hacer con filas sin precio:
 * - "skip": no crear producto
 * - "inactive": crear producto con priceCents=0 e isActive=false
 */
const UNPRICED_MODE = (process.env.UNPRICED_MODE ?? "inactive") as "skip" | "inactive";

/**
 * Generar slug para Product:
 * - "none": no setea slug
 * - "auto": setea slug único si está vacío
 */
const PRODUCT_SLUG_MODE = (process.env.PRODUCT_SLUG_MODE ?? "auto") as "none" | "auto";

type Row = {
    category: string;
    name: string;
    description?: string;
    status?: string;
    price_cents?: string;
};

function toIntOrNull(v: unknown) {
    const s = String(v ?? "").trim();
    if (!s) return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
}

async function uniqueProductSlug(base: string) {
    let s = slugify(base);
    if (!s) s = "producto";
    let candidate = s;

    // como slug es @unique, probamos sufijos hasta encontrar uno libre
    for (let i = 0; i < 200; i++) {
        const exists = await prisma.product.findUnique({ where: { slug: candidate } });
        if (!exists) return candidate;
        candidate = `${s}-${i + 2}`;
    }
    // fallback final
    return `${s}-${Date.now()}`;
}

async function main() {
    const csvPath = process.argv[2];
    if (!csvPath) {
        throw new Error(
            "Uso: npx tsx prisma/import-products-from-csv.ts data/precios_import_panaderia.csv"
        );
    }

    const abs = path.resolve(process.cwd(), csvPath);
    const content = fs.readFileSync(abs, "utf8");

    const records = parse(content, {
        columns: true,
        skip_empty_lines: true,
        bom: true,
    }) as Row[];

    let createdCategories = 0;
    let createdProducts = 0;
    let updatedProducts = 0;
    let skipped = 0;

    for (const r of records) {
        const categoryName = String(r.category ?? "").trim();
        const productName = String(r.name ?? "").trim();
        const description = String(r.description ?? "").trim();

        if (!categoryName || !productName) {
            skipped++;
            continue;
        }

        const priceCents = toIntOrNull(r.price_cents);
        const hasPrice = typeof priceCents === "number" && priceCents > 0;

        if (!hasPrice && UNPRICED_MODE === "skip") {
            skipped++;
            continue;
        }

        // 1) upsert category por slug único
        const catSlug = slugify(categoryName);

        const existingCat = await prisma.category.findUnique({ where: { slug: catSlug } });
        const category = existingCat
            ? await prisma.category.update({
                where: { slug: catSlug },
                data: { name: categoryName },
            })
            : await prisma.category.create({
                data: { name: categoryName, slug: catSlug },
            });

        if (!existingCat) createdCategories++;

        // 2) buscar producto por (name + categoryId) y upsert manual
        const existingProduct = await prisma.product.findFirst({
            where: { name: productName, categoryId: category.id },
            select: { id: true, slug: true },
        });

        const data = {
            name: productName,
            description: description || "", // tu schema lo requiere
            priceCents: hasPrice ? priceCents! : 0,
            imageUrl: null as string | null,
            categoryId: category.id,
            isActive: hasPrice, // sin precio lo dejo inactivo
            slug: undefined as string | null | undefined, // lo seteamos abajo si aplica
        };

        if (PRODUCT_SLUG_MODE === "auto") {
            const baseSlug = `${productName}-${categoryName}`;
            const computed = await uniqueProductSlug(baseSlug);
            data.slug = computed;
        }

        if (existingProduct) {
            // si ya tiene slug, no lo pisamos (salvo que quieras)
            const updateData: any = { ...data };
            if (PRODUCT_SLUG_MODE === "auto" && existingProduct.slug) {
                delete updateData.slug;
            }

            await prisma.product.update({
                where: { id: existingProduct.id },
                data: updateData,
            });
            updatedProducts++;
        } else {
            await prisma.product.create({ data: data as any });
            createdProducts++;
        }
    }

    console.log({
        createdCategories,
        createdProducts,
        updatedProducts,
        skipped,
        unpricedMode: UNPRICED_MODE,
        productSlugMode: PRODUCT_SLUG_MODE,
    });
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
