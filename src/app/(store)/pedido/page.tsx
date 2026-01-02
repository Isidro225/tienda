import { CartClient } from "@/components/cart/CartClient";

export default function PedidoPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-app-border bg-white p-6 shadow-card">
        <h1 className="text-2xl font-black tracking-tight text-app-text">Hacer pedido</h1>
        <p className="mt-2 text-sm text-app-muted">
          Armá tu pedido desde el catálogo y completá tus datos para enviarlo. El admin lo gestionará desde el panel.
        </p>
      </div>
      <CartClient />
    </div>
  );
}
