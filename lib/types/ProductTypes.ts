export type ProductCategory =
  | "MELA_WHITE"
  | "ESSENTIAL"
  | "HYDRATING"
  | "REGULATING"
  | "SENSITIVE"
  | "GREEN_PEEL"
  | "BEAUTY_ELEMENTS"
  | "VITALITY"
  | "BODY_SCIENCE"
  | "BODY_CARE"
  | "HAIR"
  | "MEN"
  | "NIGHT_CARE"
  | "AMPOULE"
  | "DRY_SKIN";

export type ProductStatus = "ACTIVE" | "OUT_OF_STOCK" | "DRAFT";

export interface CreateProductDto {
  productName: string;
  productSubTitle?: string;
  productCategory: ProductCategory[];
  productStatus: ProductStatus;
  productDescription: string;
  productPrice: number;
  productSize: number;
  productImages: File[];
  productShades?: string[];
  stockQuantity: number;
  productSku: string;
}

export interface UpdateProductDto extends Omit<CreateProductDto, "productImages"> {
  productImages?: File[];
  imagesToDelete?: string[];
}

export type Product = {
  productId: number;
  productName: string;
  productSubTitle: string | null;
  productDescription: string;
  productPrice: number;
  productSize: number;
  stockQuantity: number;
  productCategory: ProductCategory[];
  productSku: string;
  productStatus: ProductStatus;
  productImage: string;
  productImages: string[];
  productShades: string[];
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
