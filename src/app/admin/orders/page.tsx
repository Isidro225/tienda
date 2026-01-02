import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/Card";
import { formatArsFromCents } from "@/lib/money";
import { Button } from "@/components/ui/Button";
import { deleteOrder } from "./actions";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-app-border bg-white p-6 shadow-card">
        <h1 className="text-2xl font-black tracking-tight text-app-text">Pedidos</h1>
        <p className="mt-2 text-sm text-app-muted">
          Gestión de pedidos (CRUD admin). Los clientes crean pedidos desde /pedido.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold text-app-muted">
                  <th className="px-5 py-3">Código</th>
                  <th className="px-5 py-3">Cliente</th>
                  <th className="px-5 py-3">Estado</th>
                  <th className="px-5 py-3">Items</th>
                  <th className="px-5 py-3 text-right">Total</th>
                  <th className="px-5 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-app-border">
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="px-5 py-3 font-mono text-xs text-app-text">{o.id.slice(-8)}</td>
                    <td className="px-5 py-3 text-app-text">
                      <div className="font-semibold">{o.customerName}</div>
                      <div className="text-xs text-app-muted">{o.phone}</div>
                    </td>
                    <td className="px-5 py-3 text-app-text">{o.status}</td>
                    <td className="px-5 py-3 text-app-text">{o.items.reduce((a, i) => a + i.quantity, 0)}</td>
                    <td className="px-5 py-3 text-right font-extrabold text-app-text">
                      {formatArsFromCents(o.totalCents)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/orders/${o.id}`}
                          className="rounded-xl border border-app-border bg-white px-3 py-2 text-sm font-semibold text-app-text hover:bg-app-accentSoft"
                        >
                          Ver
                        </Link>
                        <form action={deleteOrder}>
                          <input type="hidden" name="id" value={o.id} />
                          <Button type="submit" variant="danger">Eliminar</Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-sm text-app-muted">
                      No hay pedidos todavía.
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
