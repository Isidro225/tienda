"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { logout } from "@/app/admin/login/actions";

export function LogoutButton() {
  const [pending, start] = useTransition();
  return (
    <Button
      type="button"
      variant="secondary"
      onClick={() => start(async () => logout())}
      disabled={pending}
    >
      {pending ? "Saliendo..." : "Cerrar sesión"}
    </Button>
  );
}
