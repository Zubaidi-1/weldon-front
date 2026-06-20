import type { Product } from "@/lib/types/ProductTypes";

type ProductImageFields = Pick<Product, "productImage"> &
  Partial<Pick<Product, "productImages">>;

export const getProductImages = (product: ProductImageFields) => {
  if (product.productImages?.length) {
    return product.productImages;
  }

  return product.productImage ? [product.productImage] : [];
};

export const getPrimaryProductImage = (product: ProductImageFields) => {
  return getProductImages(product)[0] ?? "";
};
