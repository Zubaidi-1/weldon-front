import type { ProductCategory } from "@/lib/types/ProductTypes";

export const getProductCategories = (
  productCategory: ProductCategory | ProductCategory[] | null | undefined,
) => {
  if (!productCategory) return [];

  return Array.isArray(productCategory) ? productCategory : [productCategory];
};

export const formatCategoryLabel = (value: string) =>
  value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

export const formatCategoryLabels = (
  productCategory: ProductCategory | ProductCategory[] | null | undefined,
) => getProductCategories(productCategory).map(formatCategoryLabel).join(", ");
