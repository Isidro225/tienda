/**
 * prisma/update-products-brand.ts
 * - Lee precios_import_panaderia_con_marca.csv y:
 *   1) Upsert Brand
 *   2) Intenta vincular Products existentes a Brand (por coincidencia de nombre)
 *
 * Ejecutar:
 * node --loader ts-node/esm prisma/update-products-brand.ts precios_import_panaderia_con_marca.csv
 */
import fs from "node:fs";
import path from "node:path";
import { prisma } from "../src/lib/prisma";
import { slugify } from "../src/lib/slug";

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let i = 0;
  while (i < line.length) {
    if (line[i] === '"') {
      i++;
      let buf = "";
      while (i < line.length) {
        if (line[i] === '"') {
          if (line[i + 1] === '"') {
            buf += '"';
            i += 2;
            continue;
          }
          i++;
          break;
        }
        buf += line[i++];
      }
      if (line[i] === ",") i++;
      out.push(buf);
    } else {
      let j = i;
      while (j < line.length && line[j] !== ",") j++;
      out.push(line.slice(i, j));
      i = j + 1;
    }
  }
  return out;
}

function normalize(s: string) {
  return s.trim().toLowerCase();
}

async function main() {
  const filePath = process.argv[2] || path.join(process.cwd(), "precios_import_panaderia_con_marca.csv");
  const raw = fs.readFileSync(filePath, "utf-8");
  const lines = raw.split(/\r?\n/).filter(Boolean);

  const header = parseCsvLine(lines[0]).map((h) => h.trim().replace(/^\uFEFF/, ""));
  const idxBrand = header.findIndex((h) => h.toLowerCase() === "brand");
  const idxName = header.findIndex((h) => h.toLowerCase() === "product_name");
  if (idxBrand === -1 || idxName === -1) throw new Error("CSV inválido: falta brand/product_name");

  const cacheBrand = new Map<string, string>(); // name -> id

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    const brand = (cols[idxBrand] || "").trim();
    const pname = (cols[idxName] || "").trim();
    if (!brand || !pname) continue;

    // 1) upsert brand
    let brandId = cacheBrand.get(brand);
    if (!brandId) {
      const b = await prisma.brand.upsert({
        where: { name: brand },
        update: { slug: slugify(brand) },
        create: { name: brand, slug: slugify(brand) },
        select: { id: true },
      });
      brandId = b.id;
      cacheBrand.set(brand, brandId);
    }

    // 2) intentar vincular producto
    const candidates = await prisma.product.findMany({
      where: {
        OR: [
          { name: { equals: pname, mode: "insensitive" } },
          { name: { equals: `${brand} ${pname}`, mode: "insensitive" } },
          { name: { contains: pname, mode: "insensitive" } },
        ],
      },
      select: { id: true, name: true, brandId: true },
      take: 5,
    });

    const best =
      candidates.find((p) => normalize(p.name).includes(normalize(brand)) && normalize(p.name).includes(normalize(pname))) ??
      candidates[0];

    if (best && best.brandId !== brandId) {
      await prisma.product.update({ where: { id: best.id }, data: { brandId } });
    }
  }

  console.log("OK: marcas cargadas y productos vinculados (cuando se pudo).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });