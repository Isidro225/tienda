"use client";

export type CartItem = {
  productId: string;
  name: string;
  priceCents: number;
  quantity: number;
  imageUrl?: string | null;
};

const KEY = "pan_cart_v1";

export function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addToCart(item: Omit<CartItem, "quantity">, qty: number = 1) {
  const cart = loadCart();
  const idx = cart.findIndex((x) => x.productId === item.productId);
  if (idx >= 0) cart[idx].quantity += qty;
  else cart.push({ ...item, quantity: qty });
  saveCart(cart);
  return cart;
}

export function updateQty(productId: string, quantity: number) {
  const cart = loadCart().map((x) => (x.productId === productId ? { ...x, quantity } : x));
  const cleaned = cart.filter((x) => x.quantity > 0);
  saveCart(cleaned);
  return cleaned;
}

export function clearCart() {
  saveCart([]);
}
