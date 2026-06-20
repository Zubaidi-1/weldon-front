import type { Discount } from "@/lib/types/DiscountTypes";
import type { Product } from "@/lib/types/ProductTypes";
import { getProductCategories } from "./productCategories";

const toNumber = (value: number | string) => Number(value) || 0;

export const isDiscountActive = (discount: Discount, now = new Date()) => {
  if (!discount.isActive) return false;

  const startsAt = discount.startsAt ? new Date(discount.startsAt) : null;
  const endsAt = discount.endsAt ? new Date(discount.endsAt) : null;

  return (!startsAt || startsAt <= now) && (!endsAt || endsAt >= now);
};

export const getDiscountLabel = (discount: Discount) => {
  const value = toNumber(discount.discountValue);

  if (discount.discountType === "PERCENTAGE") return `${value}% off`;

  return `$${value.toFixed(2)} off`;
};

export const getDiscountTargetLabel = (discount: Discount) => {
  if (discount.discountScope === "STORE") return "Whole store";

  if (discount.discountScope === "CATEGORY") {
    return discount.discountCategories
      .map((category) => category.replaceAll("_", " ").toLowerCase())
      .join(", ");
  }

  return discount.products.map((product) => product.productName).join(", ");
};

export const getApplicableDiscounts = (
  product: Product,
  discounts: Discount[] = [],
) => {
  const productCategories = getProductCategories(product.productCategory);

  return discounts
    .filter((discount) => isDiscountActive(discount))
    .filter((discount) => {
      if (discount.discountScope === "STORE") return true;

      if (discount.discountScope === "CATEGORY") {
        return discount.discountCategories.some((category) =>
          productCategories.includes(category),
        );
      }

      return discount.products.some(
        (discountProduct) => discountProduct.productId === product.productId,
      );
    });
};

export const getDiscountedPrice = (
  price: number,
  discount: Discount | null | undefined,
) => {
  if (!discount) return price;

  const value = toNumber(discount.discountValue);

  if (discount.discountType === "PERCENTAGE") {
    return Math.max(0, price - price * (value / 100));
  }

  return Math.max(0, price - value);
};

export const getBestProductDiscount = (
  product: Product,
  discounts: Discount[] = [],
) => {
  const applicableDiscounts = getApplicableDiscounts(product, discounts);

  return applicableDiscounts
    .map((discount) => ({
      discount,
      price: getDiscountedPrice(product.productPrice, discount),
    }))
    .sort((a, b) => {
      if (b.discount.priority !== a.discount.priority) {
        return b.discount.priority - a.discount.priority;
      }

      return a.price - b.price;
    })[0];
};

export const getFeaturedSaleDiscounts = (discounts: Discount[] = []) => {
  const activeDiscounts = discounts
    .filter((discount) => isDiscountActive(discount))
    .sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;

      return (
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });

  const topDiscount = activeDiscounts[0];

  if (topDiscount?.discountScope === "STORE") {
    return [topDiscount];
  }

  return activeDiscounts.slice(0, 2);
};
