export function formatArsFromCents(cents: number) {
  const value = cents / 100;
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(value);
}
