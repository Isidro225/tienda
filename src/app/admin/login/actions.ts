"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession } from "@/lib/auth";

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.role !== "ADMIN") {
    // Avoid leaking existence
    redirect("/admin/login?error=1");
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) redirect("/admin/login?error=1");

  await createSession({ uid: user.id, role: user.role, email: user.email });
  redirect(next);
}

export async function logout() {
  destroySession();
  redirect("/admin/login");
}
