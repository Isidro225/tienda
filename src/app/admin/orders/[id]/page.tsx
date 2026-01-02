import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/Card";
import { formatArsFromCents } from "@/lib/money";
import { Button } from "@/components/ui/Button";
import { updateOrderStatus } from "../actions";

const statuses = ["PENDING","CONFIRMED","PREPARING","READY","DELIVERED","CANCELED"] as const;

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true },
  });

  if (!order) {
    return (
      <div className="rounded-2xl border border-app-border bg-white p-6 shadow-card">
        Pedido no encontrado.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-app-border bg-white p-6 shadow-card">
        <h1 className="text-2xl font-black tracking-tight text-app-text">Pedido {order.id.slice(-8)}</h1>
        <p className="mt-2 text-sm text-app-muted">Creado: {order.createdAt.toLocaleString("es-AR")}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardContent className="p-5 space-y-3">
            <div>
              <div className="text-xs font-semibold text-app-muted">Cliente</div>
              <div className="text-sm font-extrabold text-app-text">{order.customerName}</div>
              <div className="text-sm text-app-muted">{order.phone}</div>
            </div>
            {order.address && (
              <div>
                <div className="text-xs font-semibold text-app-muted">Dirección</div>
                <div className="text-sm text-app-text">{order.address}</div>
              </div>
            )}
            {order.notes && (
              <div>
                <div className="text-xs font-semibold text-app-muted">Notas</div>
                <div className="text-sm text-app-text">{order.notes}</div>
              </div>
            )}

            <div className="rounded-xl border border-app-border bg-app-accentSoft p-4">
              <div className="text-xs font-semibold text-app-muted">Total</div>
              <div className="text-xl font-black text-app-text">{formatArsFromCents(order.totalCents)}</div>
            </div>

            <form action={updateOrderStatus} className="grid gap-2">
              <input type="hidden" name="id" value={order.id} />
              <label className="text-xs font-semibold text-app-muted">Estado</label>
              <select
                name="status"
                defaultValue={order.status}
                className="w-full rounded-xl border border-app-border bg-white px-3 py-2 text-sm text-app-text shadow-sm outline-none focus:ring-4 focus:ring-app-accentRing"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <Button type="submit" variant="secondary">Actualizar estado</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h2 className="text-sm font-extrabold text-app-text">Items</h2>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold text-app-muted">
                    <th className="py-2">Producto</th>
                    <th className="py-2 text-right">Cant.</th>
                    <th className="py-2 text-right">Precio</th>
                    <th className="py-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-app-border">
                  {order.items.map((it) => (
                    <tr key={it.id}>
                      <td className="py-3 text-app-text">{it.nameSnapshot}</td>
                      <td className="py-3 text-right text-app-text">{it.quantity}</td>
                      <td className="py-3 text-right text-app-text">{formatArsFromCents(it.priceCents)}</td>
                      <td className="py-3 text-right font-extrabold text-app-text">
                        {formatArsFromCents(it.priceCents * it.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
