import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/Card";
import { ProductForm } from "@/components/ProductForm";
import { createProduct } from "../actions";
import { redirect } from "next/navigation";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  if (categories.length === 0) {
    return (
      <div className="rounded-2xl border border-app-border bg-white p-6 shadow-card">
        Primero creá al menos una categoría.
      </div>
    );
  }

  async function createAndRedirect(fd: FormData) {
    "use server";
    const res = await createProduct(fd);
    return res;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-app-border bg-white p-6 shadow-card">
        <h1 className="text-2xl font-black tracking-tight text-app-text">Nuevo producto</h1>
        <p className="mt-2 text-sm text-app-muted">Completa los datos del producto.</p>
      </div>

      <Card>
        <CardContent className="p-5">
          <ProductForm mode="create" categories={categories} action={createAndRedirect} />
        </CardContent>
      </Card>
    </div>
  );
}
