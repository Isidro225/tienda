"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
    const [step, setStep] = useState<"phone" | "code">("phone");
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const router = useRouter();
    const sp = useSearchParams();
    const next = sp.get("next") || "/pedido";

    async function requestOtp() {
        setErr(null);
        setLoading(true);
        const res = await fetch("/api/auth/otp/request", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone }),
        });
        setLoading(false);
        if (!res.ok) {
            const j = await res.json().catch(() => ({}));
            setErr(j.error || "No se pudo enviar el código.");
            return;
        }
        setStep("code");
    }

    async function verifyOtp() {
        setErr(null);
        setLoading(true);
        const res = await fetch("/api/auth/otp/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone, code, name }),
        });
        setLoading(false);
        const j = await res.json().catch(() => ({}));
        if (!res.ok || !j.ok) {
            setErr(j.error || "No se pudo verificar.");
            return;
        }
        router.replace(next);
    }

    return (
        <div className="mx-auto max-w-md space-y-4 rounded-2xl border border-app-border bg-white p-6 px-9 py-4 shadow-card">
            <h1 className="text-2xl font-black text-app-text">Ingresar</h1>
            <p className="text-sm text-app-muted">
                Verificamos tu teléfono por WhatsApp para que puedas realizar pedidos.
            </p>

            {err ? <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{err}</div> : null}

            {step === "phone" ? (
                <div className="space-y-3">
                    <input
                        className="w-full rounded-xl border border-app-border px-3 py-2"
                        placeholder="Tu nombre (opcional)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        className="w-full rounded-xl border border-app-border px-3 py-2"
                        placeholder="Teléfono (E164, ej: +549221...)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <button
                        onClick={requestOtp}
                        disabled={loading}
                        className="w-full rounded-xl bg-app-accent px-4 py-2 font-extrabold text-white disabled:opacity-60"
                    >
                        {loading ? "Enviando..." : "Enviar código por WhatsApp"}
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="text-xs text-app-muted">Te enviamos un código a: <b className="text-app-text">{phone}</b></div>
                    <input
                        className="w-full rounded-xl border border-app-border px-3 py-2 text-center tracking-[0.3em]"
                        placeholder="000000"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        maxLength={6}
                    />
                    <button
                        onClick={verifyOtp}
                        disabled={loading}
                        className="w-full rounded-xl bg-app-accent px-4 py-2 font-extrabold text-white disabled:opacity-60"
                    >
                        {loading ? "Verificando..." : "Verificar y continuar"}
                    </button>

                    <button
                        onClick={() => setStep("phone")}
                        className="w-full rounded-xl border border-app-border bg-white px-4 py-2 text-sm font-semibold text-app-text"
                    >
                        Cambiar teléfono
                    </button>
                </div>
            )}
        </div>
    );
}
