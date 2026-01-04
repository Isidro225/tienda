import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession, sha256 } from "@/lib/auth";

export async function POST(req: Request) {
    const { phone, code, name } = await req.json();

    const phoneE164 = String(phone ?? "").trim().startsWith("+")
        ? String(phone).trim()
        : `+${String(phone ?? "").trim()}`;

    const codeStr = String(code ?? "").trim();
    if (codeStr.length !== 6) {
        return NextResponse.json({ ok: false, error: "Código inválido." }, { status: 400 });
    }

    const otp = await prisma.phoneOtp.findFirst({
        where: {
            phone: phoneE164,
            consumedAt: null,
            expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: "desc" },
    });

    if (!otp) return NextResponse.json({ ok: false, error: "Código vencido o inexistente." }, { status: 400 });

    // attempts
    if (otp.attempts >= 5) return NextResponse.json({ ok: false, error: "Demasiados intentos." }, { status: 400 });

    const ok = sha256(codeStr) === otp.codeHash;

    await prisma.phoneOtp.update({
        where: { id: otp.id },
        data: { attempts: { increment: 1 }, ...(ok ? { consumedAt: new Date() } : {}) },
    });

    if (!ok) return NextResponse.json({ ok: false, error: "Código incorrecto." }, { status: 400 });

    const user = await prisma.user.upsert({
        where: { phone: phoneE164 },
        create: {
            phone: phoneE164,
            name: String(name ?? "").trim() || null,
            role: "USER",
            phoneVerifiedAt: new Date(),
        },
        update: {
            phoneVerifiedAt: new Date(),
            name: String(name ?? "").trim() || undefined,
        },
    });

    await createSession(user.id);

    return NextResponse.json({ ok: true });
}
