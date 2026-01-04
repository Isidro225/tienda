import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { genOtpCode, sha256 } from "@/lib/auth";
import { sendWhatsAppOtp } from "@/lib/whatsapp";

export async function POST(req: Request) {
    const { phone } = await req.json();

    const phoneClean = String(phone ?? "").trim();
    if (!phoneClean || phoneClean.length < 8) {
        return NextResponse.json({ ok: false, error: "Teléfono inválido." }, { status: 400 });
    }

    // E164 recomendado: +54...
    const phoneE164 = phoneClean.startsWith("+") ? phoneClean : `+${phoneClean}`;

    // rate limit mínimo: borrar OTP previos recientes
    await prisma.phoneOtp.deleteMany({
        where: { phone: phoneE164, expiresAt: { lt: new Date() } },
    });

    const code = genOtpCode();
    const codeHash = sha256(code);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10); // 10 min

    await prisma.phoneOtp.create({
        data: { phone: phoneE164, codeHash, expiresAt },
    });

    await sendWhatsAppOtp(phoneE164, code);

    return NextResponse.json({ ok: true });
}
