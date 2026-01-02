"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { CartItem, clearCart, loadCart, updateQty } from "./cartStore";
import { formatArsFromCents } from "@/lib/money";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createOrder } from "@/app/(store)/pedido/actions";

export function CartClient() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [pending, start] = useTransition();
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [doneId, setDoneId] = useState<string | null>(null);
  const total = useMemo(() => items.reduce((acc, it) => acc + it.priceCents * it.quantity, 0), [items]);

  useEffect(() => {
    setItems(loadCart());
  }, []);

  const canSubmit = items.length > 0 && customerName.trim().length >= 2 && phone.trim().length >= 6;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-2xl border border-app-border bg-white p-5 shadow-card">
        <h2 className="text-base font-extrabold text-app-text">Tu pedido</h2>
        <p className="mt-1 text-sm text-app-muted">Podés ajustar cantidades antes de enviar.</p>

        <div className="mt-4 divide-y divide-app-border">
          {items.length === 0 ? (
            <div className="py-8 text-sm text-app-muted">Tu carrito está vacío.</div>
          ) : (
            items.map((it) => (
              <div key={it.productId} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-app-text">{it.name}</div>
                  <div className="text-xs text-app-muted">{formatArsFromCents(it.priceCents)} c/u</div>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={0}
                    value={it.quantity}
                    onChange={(e) => {
                      const q = Number(e.target.value);
                      const next = updateQty(it.productId, Number.isFinite(q) ? q : it.quantity);
                      setItems(next);
                    }}
                    className="w-20"
                  />
                  <div className="w-28 text-right text-sm font-extrabold text-app-text">
                    {formatArsFromCents(it.priceCents * it.quantity)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-app-border pt-4">
          <span className="text-sm font-semibold text-app-muted">Total</span>
          <span className="text-lg font-black text-app-text">{formatArsFromCents(total)}</span>
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              clearCart();
              setItems([]);
            }}
            disabled={items.length === 0}
          >
            Vaciar
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-app-border bg-white p-5 shadow-card">
        <h2 className="text-base font-extrabold text-app-text">Datos del cliente</h2>
        <p className="mt-1 text-sm text-app-muted">Nos comunicamos para confirmar el pedido.</p>

        <div className="mt-4 grid gap-3">
          <div>
            <label className="text-xs font-semibold text-app-muted">Nombre</label>
            <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Tu nombre" />
          </div>
          <div>
            <label className="text-xs font-semibold text-app-muted">Teléfono</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+54 ..." />
          </div>
          <div>
            <label className="text-xs font-semibold text-app-muted">Dirección (opcional)</label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Calle, número, piso..." />
          </div>
          <div>
            <label className="text-xs font-semibold text-app-muted">Notas (opcional)</label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Horario, detalles..." />
          </div>
        </div>

        <div className="mt-5">
          <Button
            type="button"
            disabled={!canSubmit || pending}
            onClick={() =>
              start(async () => {
                const res = await createOrder({
                  customerName,
                  phone,
                  address: address || null,
                  notes: notes || null,
                  items: items.map((it) => ({
                    productId: it.productId,
                    quantity: it.quantity,
                  })),
                });
                if (res.ok) {
                  clearCart();
                  setItems([]);
                  setDoneId(res.orderId);
                } else {
                  alert(res.error ?? "No se pudo crear el pedido.");
                }
              })
            }
            className="w-full"
          >
            {pending ? "Enviando..." : "Enviar pedido"}
          </Button>
        </div>

        {doneId && (
          <div className="mt-4 rounded-xl border border-app-border bg-app-accentSoft p-3 text-sm text-app-text">
            Pedido creado. Código: <span className="font-extrabold">{doneId}</span>. Te contactaremos a la brevedad.
          </div>
        )}
      </div>
    </div>
  );
}
