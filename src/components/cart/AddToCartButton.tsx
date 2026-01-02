"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { addToCart } from "./cartStore";

type Props = {
  productId: string;
  name: string;
  priceCents: number;
  imageUrl?: string | null;
};

export function AddToCartButton(p: Props) {
  const [added, setAdded] = useState(false);

  return (
    <Button
      type="button"
      onClick={() => {
        addToCart({ productId: p.productId, name: p.name, priceCents: p.priceCents, imageUrl: p.imageUrl }, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
      }}
    >
      {added ? "Agregado" : "Agregar al pedido"}
    </Button>
  );
}
