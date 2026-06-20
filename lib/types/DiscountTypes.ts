import type { Product, ProductCategory, ProductStatus } from "./ProductTypes";

export type DiscountType = "FIXED" | "PERCENTAGE";
export type DiscountScope = "CATEGORY" | "STORE" | "PRODUCT";
export type PromotionType = "SALE" | "COUPON";

export type DiscountProduct = Pick<
  Product,
  "productId" | "productName" | "productPrice" | "productCategory"
> & {
  productStatus: ProductStatus;
};

export type Discount = {
  discountId: number;
  name: string;
  discountValue: number | string;
  promotionType: PromotionType;
  couponCode: string | null;
  minimumOrderTotal: number | string | null;
  usageLimit: number | null;
  usedCount: number;
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
  discountType: DiscountType;
  discountScope: DiscountScope;
  discountCategories: ProductCategory[];
  products: DiscountProduct[];
  priority: number;
  newSaleNotifiedAt?: string | null;
  endingSoonNotifiedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateDiscountDto = {
  name: string;
  discountValue: number;
  discountType: DiscountType;
  promotionType?: PromotionType;
  couponCode?: string;
  minimumOrderTotal?: number;
  usageLimit?: number;
  discountScope: DiscountScope;
  isActive?: boolean;
  startsAt?: string;
  endsAt?: string;
  discountCategories?: ProductCategory[];
  productIds?: number[];
  priority?: number;
};

export type UpdateDiscountDto = Partial<CreateDiscountDto>;
