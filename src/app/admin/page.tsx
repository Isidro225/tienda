import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/Card";
import { formatArsFromCents } from "@/lib/money";
import { ButtonLink } from "@/components/ui/Button";

export default async function AdminDashboard() {
  const [products, categories, orders] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count(),
  ]);

  const lastOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, customerName: true, status: true, totalCents: true, createdAt: true },
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-app-border bg-white p-6 shadow-card">
        <h1 className="text-2xl font-black tracking-tight text-app-text">Dashboard</h1>
        <p className="mt-2 text-sm text-app-muted">
          Resumen del sistema (Productos, Categorías y Pedidos). CRUD completo disponible en las pestañas.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-5">
          <div className="text-xs font-semibold text-app-muted">Productos</div>
          <div className="mt-1 text-2xl font-black text-app-text">{products}</div>
          <div className="mt-3"><ButtonLink href="/admin/products" variant="secondary">Gestionar</ButtonLink></div>
        </CardContent></Card>

        <Card><CardContent className="p-5">
          <div className="text-xs font-semibold text-app-muted">Categorías</div>
          <div className="mt-1 text-2xl font-black text-app-text">{categories}</div>
          <div className="mt-3"><ButtonLink href="/admin/categories" variant="secondary">Gestionar</ButtonLink></div>
        </CardContent></Card>

        <Card><CardContent className="p-5">
          <div className="text-xs font-semibold text-app-muted">Pedidos</div>
          <div className="mt-1 text-2xl font-black text-app-text">{orders}</div>
          <div className="mt-3"><ButtonLink href="/admin/orders" variant="secondary">Gestionar</ButtonLink></div>
        </CardContent></Card>
      </div>

      <div className="rounded-2xl border border-app-border bg-white p-6 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-app-text">Últimos pedidos</h2>
          <ButtonLink href="/admin/orders" variant="ghost">Ver todos</ButtonLink>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold text-app-muted">
                <th className="py-2">Código</th>
                <th className="py-2">Cliente</th>
                <th className="py-2">Estado</th>
                <th className="py-2 text-right">Total</th>
                <th className="py-2">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border">
              {lastOrders.map((o) => (
                <tr key={o.id} className="text-app-text">
                  <td className="py-3 font-mono text-xs">{o.id.slice(-8)}</td>
                  <td className="py-3">{o.customerName}</td>
                  <td className="py-3">{o.status}</td>
                  <td className="py-3 text-right font-extrabold">{formatArsFromCents(o.totalCents)}</td>
                  <td className="py-3 text-xs text-app-muted">{o.createdAt.toLocaleString("es-AR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
