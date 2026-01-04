import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/Card";
import { ProductForm } from "@/components/ProductForm";
import { updateProduct } from "../../actions";

export default async function EditProductPage({
                                                  params,
                                              }: {
    params: { id: string };
}) {
    const [categories, product] = await Promise.all([
        prisma.category.findMany({ orderBy: { name: "asc" } }),
        prisma.product.findUnique({ where: { id: params.id } }),
    ]);

    if (!product) {
        return (
            <div className="rounded-2xl border border-app-border bg-white p-6 shadow-card">
                Producto no encontrado.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-app-border bg-white p-6 shadow-card">
                <h1 className="text-2xl font-black tracking-tight text-app-text">
                    Editar producto
                </h1>
                <p className="mt-2 text-sm text-app-muted">
                    Actualiza los datos y guardá cambios.
                </p>
            </div>

            <Card>
                <CardContent className="p-5">
                    <ProductForm
                        mode="edit"
                        categories={categories}
                        defaultValues={{
                            id: product.id,
                            name: product.name,
                            description: product.description,
                            price: String((product.priceCents / 100).toFixed(2)),
                            categoryId: product.categoryId,
                            imageUrl: product.imageUrl ?? "",
                            brand: product.brandId ?? "",
                            isActive: product.isActive,
                        }}
                        action={updateProduct}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
