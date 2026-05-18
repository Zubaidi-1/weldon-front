import type { Product } from "@/lib/types/ProductTypes";

export const stockBuffer = 5;

export const getAvailableStock = (product: Pick<Product, "stockQuantity">) =>
  Math.max(0, product.stockQuantity - stockBuffer);

export const isProductInStock = (product: Pick<Product, "stockQuantity">) =>
  getAvailableStock(product) > 0;
