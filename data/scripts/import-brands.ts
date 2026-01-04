import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(input: string) {
    return input
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

async function main() {
    const csvPath = process.argv[2] || "precios_import_panaderia.csv";
    const abs = path.isAbsolute(csvPath) ? csvPath : path.join(process.cwd(), csvPath);

    if (!fs.existsSync(abs)) {
        throw new Error(`No existe el archivo: ${abs}`);
    }

    const csv = fs.readFileSync(abs, "utf8");
    const parsed = Papa.parse<Record<string, string>>(csv, {
        header: true,
        skipEmptyLines: true,
    });

    if (parsed.errors.length) {
        console.error(parsed.errors.slice(0, 3));
        throw new Error("Errores parseando CSV.");
    }

    // Ajustá este nombre de columna si en tu CSV se llama distinto:
    // Ej: "marca", "brand", "MARCA"
    const BRAND_COL_CANDIDATES = ["brand", "marca", "MARCA", "Brand"];

    const rows = parsed.data;
    const brandSet = new Set<string>();

    for (const r of rows) {
        const key = BRAND_COL_CANDIDATES.find((k) => r?.[k]?.trim());
        const b = key ? String(r[key]).trim() : "";
        if (!b) continue;

        // normalizamos “VARIOS” si querés excluirlo:
        // if (b.toUpperCase() === "VARIOS") continue;

        brandSet.add(b);
    }

    const brands = Array.from(brandSet).sort((a, b) => a.localeCompare(b, "es"));

    console.log(`Marcas detectadas: ${brands.length}`);

    let createdOrUpdated = 0;

    for (const name of brands) {
        const slug = slugify(name);
        await prisma.brand.upsert({
            where: { slug },
            update: { name },
            create: { name, slug },
        });
        createdOrUpdated++;
    }

    console.log(`Upsert OK: ${createdOrUpdated} marcas`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
