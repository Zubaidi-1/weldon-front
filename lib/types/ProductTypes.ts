export type ProductCategory =
  | "MELA_WHITE"
  | "ESSENTIAL"
  | "HYDRATING"
  | "REGULATING"
  | "SENSITIVE"
  | "BEAUTY_ELEMENTS"
  | "VITALITY"
  | "BODY_SCIENCE"
  | "HAIR"
  | "MEN";

export type ProductStatus = "ACTIVE" | "OUT_OF_STOCK" | "DRAFT";

export interface CreateProductDto {
  productName: string;
  productCategory: ProductCategory;
  productStatus: ProductStatus;
  productDescription: string;
  productPrice: number;
  productSize: number;
  productImage: File;
  stockQuantity: number;
  productSku: string;
}

export interface UpdateProductDto extends Omit<
  CreateProductDto,
  "productImage"
> {
  productImage?: File;
}

export type Product = {
  productId: number;
  productName: string;
  productDescription: string;
  productPrice: number;
  productSize: number;
  stockQuantity: number;
  productCategory: ProductCategory;
  productSku: string;
  productStatus: ProductStatus;
  productImage: string;
};

export type CartProduct = {
  productId: number;
  productName: string;
  productSize: number;
  price: number;
  quantity: number;
  productImage: string | null;
  maxQuantity?: number;
};
