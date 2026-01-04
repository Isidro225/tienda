import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

const COOKIE = process.env.SESSION_COOKIE_NAME || "alsedo_session";

export function genOtpCode() {
    return String(Math.floor(100000 + Math.random() * 900000)); // 6 dígitos
}

export function sha256(input: string) {
    return crypto.createHash("sha256").update(input).digest("hex");
}

export function randomToken() {
    return crypto.randomBytes(32).toString("base64url");
}

export async function createSession(userId: string) {
    const token = randomToken();
    const tokenHash = sha256(token);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14); // 14 días

    await prisma.session.create({
        data: { userId, tokenHash, expiresAt },
    });

    cookies().set(COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: expiresAt,
    });
}

export async function getCurrentUser() {
    const token = cookies().get(COOKIE)?.value;
    if (!token) return null;

    const tokenHash = sha256(token);
    const session = await prisma.session.findUnique({
        where: { tokenHash },
        include: { user: true },
    });

    if (!session) return null;
    if (session.expiresAt < new Date()) return null;

    return session.user;
}

export async function logout() {
    const token = cookies().get(COOKIE)?.value;
    if (token) {
        await prisma.session.deleteMany({ where: { tokenHash: sha256(token) } });
    }
    cookies().delete(COOKIE);
}
