/**
 * prisma/seed-brands.ts
 * - Lee marcas_unicas.csv y crea/actualiza la tabla Brand.
 *
 * Requisitos (schema.prisma):
 *
 * model Brand {
 *   id        String   @id @default(cuid())
 *   name      String   @unique
 *   slug      String   @unique
 *   products  Product[]
 *   createdAt DateTime @default(now())
 *   updatedAt DateTime @updatedAt
 * }
 *
 * model Product {
 *   ...
 *   brandId   String?
 *   brand     Brand?   @relation(fields: [brandId], references: [id], onDelete: SetNull)
 *   @@index([brandId])
 * }
 *
 * Luego:
 * 1) npx prisma migrate dev -n add_brand
 * 2) node --loader ts-node/esm prisma/seed-brands.ts marcas_unicas.csv
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

function parseBrandsCsv(filePath: string) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const lines = raw.split(/\r?\n/).filter(Boolean);
  const header = parseCsvLine(lines[0]).map((h) => h.trim().replace(/^\uFEFF/, ""));
  const idx = header.findIndex((h) => h.toLowerCase() === "brand");
  if (idx === -1) throw new Error("CSV inválido: falta columna brand");

  const out: string[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    const b = (cols[idx] || "").trim();
    if (b) out.push(b);
  }
  return out;
}

async function main() {
  const filePath = process.argv[2] || path.join(process.cwd(), "marcas_unicas.csv");
  const brands = parseBrandsCsv(filePath);

  for (const name of brands) {
    const n = name.trim();
    if (!n) continue;
    const slug = slugify(n);
    await prisma.brand.upsert({
      where: { name: n },
      update: { slug },
      create: { name: n, slug },
    });
  }

  console.log(`OK: ${brands.length} marcas procesadas.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });