"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/ImageUploader";

type Category = { id: string; name: string };

type Props = {
  mode: "create" | "edit";
  categories: Category[];
  defaultValues?: {
    id?: string;
    name: string;
    description: string;
    price: string; // pesos
    categoryId: string;
    imageUrl: string;
    isActive: boolean;
  };
  action: (formData: FormData) => Promise<{ ok: boolean; error?: string }>;
};

export function ProductForm({ mode, categories, defaultValues, action }: Props) {
  const [imageUrl, setImageUrl] = useState(defaultValues?.imageUrl ?? "");
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      action={async (fd) => {
        fd.set("imageUrl", imageUrl);
        const res = await action(fd);
        if (!res.ok) setError(res.error ?? "No se pudo guardar.");
      }}
      className="grid gap-4"
    >
      {defaultValues?.id && <input type="hidden" name="id" value={defaultValues.id} />}
      <div className="grid gap-2">
        <label className="text-xs font-semibold text-app-muted">Nombre</label>
        <Input name="name" defaultValue={defaultValues?.name ?? ""} required placeholder="Ej: Frutos Secos" />
      </div>

      <div className="grid gap-2">
        <label className="text-xs font-semibold text-app-muted">Descripción</label>
        <Textarea
          name="description"
          defaultValue={defaultValues?.description ?? ""}
          required
          placeholder="Descripción breve y atractiva..."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-xs font-semibold text-app-muted">Precio (ARS)</label>
          <Input
            name="price"
            defaultValue={defaultValues?.price ?? ""}
            required
            inputMode="decimal"
            placeholder="Ej: 1200 o 1200,50"
          />
          <div className="text-xs text-app-muted">Internamente se guarda en centavos.</div>
        </div>

        <div className="grid gap-2">
          <label className="text-xs font-semibold text-app-muted">Categoría</label>
          <select
            name="categoryId"
            defaultValue={defaultValues?.categoryId ?? categories[0]?.id}
            className="w-full rounded-xl border border-app-border bg-white px-3 py-2 text-sm text-app-text shadow-sm outline-none focus:ring-4 focus:ring-app-accentRing"
            required
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-2">
        <label className="text-xs font-semibold text-app-muted">Imagen</label>
        <ImageUploader value={imageUrl} onChange={setImageUrl} />
      </div>

      <label className="flex items-center gap-2 text-sm text-app-text">
        <input type="checkbox" name="isActive" defaultChecked={defaultValues?.isActive ?? true} />
        Activo (visible en la tienda)
      </label>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="flex items-center gap-2">
        <Button type="submit">{mode === "create" ? "Crear" : "Guardar cambios"}</Button>
        <a
          href="/admin/products"
          className="rounded-xl border border-app-border bg-white px-4 py-2 text-sm font-semibold text-app-text hover:bg-app-accentSoft"
        >
          Cancelar
        </a>
      </div>
    </form>
  );
}
