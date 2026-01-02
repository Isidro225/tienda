import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createCategory, deleteCategory, updateCategory } from "./actions";

export default async function CategoriesPage(){
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-app-border bg-white p-6 shadow-card">
        <h1 className="text-2xl font-black tracking-tight text-app-text">Categorías</h1>
        <p className="mt-2 text-sm text-app-muted">CRUD de categorías (nombre y slug automático).</p>
      </div>

      <Card>
        <CardContent className="p-5">
          <h2 className="text-sm font-extrabold text-app-text">Nueva categoría</h2>
          <form action={createCategory} className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Input name="name" placeholder="Ej: Facturas" required />
            <Button type="submit">Crear</Button>
          </form>
        </CardContent>
      </Card>

      <div className="rounded-2xl border border-app-border bg-white p-6 shadow-card">
        <h2 className="text-sm font-extrabold text-app-text">Listado</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold text-app-muted">
                <th className="py-2">Nombre</th>
                <th className="py-2">Slug</th>
                <th className="py-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border">
              {categories.map((c) => (
                <tr key={c.id} className="align-middle">
                  <td className="py-3">
                    <form action={updateCategory} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={c.id} />
                      <Input name="name" defaultValue={c.name} />
                      <Button type="submit" variant="secondary">Guardar</Button>
                    </form>
                  </td>
                  <td className="py-3 font-mono text-xs text-app-muted">{c.slug}</td>
                  <td className="py-3 text-right">
                    <form action={deleteCategory}>
                      <input type="hidden" name="id" value={c.id} />
                      <Button type="submit" variant="danger">Eliminar</Button>
                    </form>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-sm text-app-muted">
                    Sin categorías todavía.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-xs text-app-muted">
          Nota: eliminar una categoría borrará sus productos (onDelete: Cascade).
        </div>
      </div>
    </div>
  );
}
