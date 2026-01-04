"use server";

import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

const SESSION_COOKIE = "alsedo_session";

function fail(msg: string): never {
    redirect(`/admin/login?error=${encodeURIComponent(msg)}`);
}

export async function adminLogin(formData: FormData): Promise<void> {
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) return fail("Completá email y contraseña.");

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return fail("Credenciales inválidas.");

    if (user.role !== "ADMIN") return fail("Tu usuario no tiene permisos de administrador.");

    // ✅ si por algún motivo no tiene password (null/empty), no dejamos pasar
    if (!user.password) return fail("Credenciales inválidas.");

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return fail("Credenciales inválidas.");

    await createSession(user.id);
    redirect("/admin");
}

export async function logout(): Promise<void> {
    const jar = await cookies();

    jar.set(SESSION_COOKIE, "", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0,
    });

    redirect("/admin/login");
}