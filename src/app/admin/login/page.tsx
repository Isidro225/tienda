import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { login } from "./actions";

export default function AdminLoginPage({ searchParams }: { searchParams: { next?: string; error?: string } }) {
  const next = searchParams.next ?? "/admin";
  return (
    <div className="mx-auto grid max-w-md gap-6">
      <div className="rounded-2xl border border-app-border bg-white p-6 shadow-card">
        <h1 className="text-2xl font-black tracking-tight text-app-text">Inicio de sesión</h1>
        <p className="mt-2 text-sm text-app-muted">
          Acceso exclusivo para administradores. Las rutas /admin están protegidas por middleware y cookie httpOnly.
        </p>
      </div>


      {searchParams.error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-card">
          Credenciales inválidas. Verificá tu email/contraseña de admin.
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <div className="text-sm font-extrabold text-app-text">Panel de administración</div>
          <div className="text-xs text-app-muted">Ingresá con tu usuario admin (seed).</div>
        </CardHeader>
        <CardContent>
          <form action={login} className="grid gap-3">
            <input type="hidden" name="next" value={next} />
            <div>
              <label className="text-xs font-semibold text-app-muted">Email</label>
              <Input name="email" type="email" placeholder="admin@..." required />
            </div>
            <div>
              <label className="text-xs font-semibold text-app-muted">Contraseña</label>
              <Input name="password" type="password" placeholder="••••••••" required />
            </div>
            <Button type="submit" className="mt-2 w-full">Entrar</Button>
            <div className="text-xs text-app-muted">
              Tip: configurá ADMIN_EMAIL y ADMIN_PASSWORD, luego ejecutá <span className="font-semibold">npm run prisma:migrate</span> y <span className="font-semibold">npm run seed</span>.
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
