"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type Props = {
  value: string;
  onChange: (url: string) => void;
};

export function ImageUploader({ value, onChange }: Props) {
  const [busy, setBusy] = useState(false);
  const enabled =
    Boolean(process.env.NEXT_PUBLIC_CLOUDINARY_ENABLED) ||
    true; // UI will still attempt and show friendly error if env missing

  async function upload(file: File) {
    setBusy(true);
    try {
      const sigRes = await fetch("/api/upload/signature", { method: "GET" });
      const sig = await sigRes.json();
      if (!sig.ok) {
        alert(sig.error ?? "Cloudinary no configurado. Pegá una URL de imagen manualmente.");
        return;
      }

      const form = new FormData();
      form.append("file", file);
      form.append("api_key", sig.apiKey);
      form.append("timestamp", String(sig.timestamp));
      form.append("signature", sig.signature);
      form.append("folder", sig.folder);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`;
      const upRes = await fetch(uploadUrl, { method: "POST", body: form });
      const data = await upRes.json();
      if (!upRes.ok) {
        alert(data?.error?.message ?? "Error subiendo imagen.");
        return;
      }
      onChange(String(data.secure_url));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="file"
          accept="image/*"
          disabled={busy}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
          }}
        />
        <Button type="button" variant="secondary" disabled={!value} onClick={() => onChange("")}>
          Quitar
        </Button>
      </div>
      <input
        className="w-full rounded-xl border border-app-border bg-white px-3 py-2 text-sm text-app-text shadow-sm outline-none placeholder:text-slate-400 focus:ring-4 focus:ring-app-accentRing"
        placeholder="...o pegá una URL (si no usás Cloudinary)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {busy && <div className="text-xs text-app-muted">Subiendo imagen...</div>}
      {!enabled && <div className="text-xs text-app-muted">Cloudinary deshabilitado.</div>}
    </div>
  );
}
