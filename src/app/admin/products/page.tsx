import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/Card";
import { ButtonLink, Button } from "@/components/ui/Button";
import { formatArsFromCents } from "@/lib/money";
import { deleteProduct } from "./actions";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-app-border bg-white p-6 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-app-text">Productos</h1>
            <p className="mt-2 text-sm text-app-muted">
              Cada producto incluye nombre, descripción, precio, categoría e imagen.
            </p>
          </div>
          <ButtonLink href="/admin/products/new" variant="primary">
            Nuevo producto
          </ButtonLink>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold text-app-muted">
                  <th className="px-5 py-3">Producto</th>
                  <th className="px-5 py-3">Categoría</th>
                  <th className="px-5 py-3 text-right">Precio</th>
                  <th className="px-5 py-3">Activo</th>
                  <th className="px-5 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-app-border">
                {products.map((p) => (
                  <tr key={p.id}>
                    <td className="px-5 py-3">
                      <div className="font-semibold text-app-text">{p.name}</div>
                      <div className="line-clamp-1 text-xs text-app-muted">{p.description}</div>
                    </td>
                    <td className="px-5 py-3 text-app-text">{p.category.name}</td>
                    <td className="px-5 py-3 text-right font-extrabold text-app-text">
                      {formatArsFromCents(p.priceCents)}
                    </td>
                    <td className="px-5 py-3 text-app-text">{p.isActive ? "Sí" : "No"}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="rounded-xl border border-app-border bg-white px-3 py-2 text-sm font-semibold text-app-text hover:bg-app-accentSoft"
                        >
                          Editar
                        </Link>
                        <form action={deleteProduct}>
                          <input type="hidden" name="id" value={p.id} />
                          <Button type="submit" variant="danger">Eliminar</Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-sm text-app-muted">
                      No hay productos. Creá el primero.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
