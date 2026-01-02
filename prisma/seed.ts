import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("Missing ADMIN_EMAIL or ADMIN_PASSWORD in env.");
  }

  const hashed = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: hashed, role: "ADMIN" },
    create: { email: adminEmail, password: hashed, role: "ADMIN" },
  });

  const categories = ["Facturas", "Tortas", "Panificados", "Galletitas", "Confitería"];
  for (const name of categories) {
    const slug = slugify(name);
    await prisma.category.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
    });
  }

  const cat = await prisma.category.findFirst({ where: { slug: "facturas" } });
  if (cat) {
    const existing = await prisma.product.count();
    if (existing === 0) {
      await prisma.product.createMany({
        data: [
          {
            name: "Medialuna de manteca",
            description: "Clásica medialuna hojaldrada, ideal para desayuno o merienda.",
            priceCents: 45000,
            imageUrl: "https://images.unsplash.com/photo-1548940740-204726a19be3?auto=format&fit=crop&w=1200&q=80",
            categoryId: cat.id,
            isActive: true,
          },
          {
            name: "Vigilante",
            description: "Masa suave, azúcar por encima. Un clásico de panadería.",
            priceCents: 48000,
            imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
            categoryId: cat.id,
            isActive: true,
          },
        ],
      });
    }
  }

  console.log("Seed completed: admin user, categories, and sample products.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
