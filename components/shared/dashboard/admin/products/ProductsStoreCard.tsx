import { Product } from "@/lib/types/ProductTypes";
import { getAssetUrl } from "@/config/api";
import Link from "next/link";
import { isProductInStock } from "@/lib/utils/productStock";
import { getPrimaryProductImage } from "@/lib/utils/productImages";
import type { Discount } from "@/lib/types/DiscountTypes";
import {
  getBestProductDiscount,
  getDiscountLabel,
} from "@/lib/utils/discounts";
import {
  formatCategoryLabel,
  getProductCategories,
} from "@/lib/utils/productCategories";

type Props = {
  product: Product;
  discounts?: Discount[];
};

export default function ProductStoreCard({ product, discounts = [] }: Props) {
  const productImageUrl = getAssetUrl(getPrimaryProductImage(product));
  const isInStock = isProductInStock(product);
  const primaryCategory = getProductCategories(product.productCategory)[0];
  const sale = getBestProductDiscount(product, discounts);
  const hasSale = Boolean(sale && sale.price < product.productPrice);

  return (
    <Link
      href={`/store/${product.productId}`}
      className="group flex h-full overflow-hidden rounded-2xl border border-[#D8EAF4] bg-white shadow-[0_10px_28px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:border-[#0089D3]/45 hover:shadow-[0_18px_42px_rgba(0,137,211,0.16)]"
    >
      <article className="flex h-full w-full flex-col">
        <div className="relative h-64 w-full overflow-hidden bg-[#EEF7FB]">
          {hasSale && sale && (
            <span className="absolute left-4 top-4 z-10 rounded-full bg-[#DC2626] px-3 py-1 text-xs font-bold text-white shadow-sm">
              {getDiscountLabel(sale.discount)}
            </span>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={productImageUrl}
          alt={product.productName}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

        <div className="flex flex-1 flex-col gap-4 p-5">
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold leading-7 text-[#0F172A]">
              {product.productName}
            </h2>

            {primaryCategory && (
              <span className="w-fit rounded-full bg-[#E6F6FD] px-3 py-1 text-xs font-bold text-[#0089D3]">
                {formatCategoryLabel(primaryCategory)}
              </span>
            )}
          </div>

          {product.productSubTitle && (
            <p className="text-sm font-semibold text-[#334155]">
              {product.productSubTitle}
            </p>
          )}

          <p className="line-clamp-3 text-sm leading-6 text-[#64748B]">
          {product.productDescription}
        </p>

          {(product.productShades ?? []).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {(product.productShades ?? []).slice(0, 5).map((shade) => (
                <span
                  key={shade}
                  className="h-5 w-5 rounded-full border border-[#CBD5E1]"
                  style={{ backgroundColor: shade }}
                  title={shade}
                />
              ))}
            </div>
          )}

          <div className="mt-auto flex items-end justify-between gap-4 border-t border-[#E2E8F0] pt-4">
            <div>
              <p className="text-xs font-semibold uppercase text-[#94A3B8]">
                Price
              </p>
              {hasSale && sale ? (
                <div className="mt-1">
                  <p className="text-2xl font-extrabold text-[#DC2626]">
                    ${sale.price.toFixed(2)}
                  </p>
                  <p className="text-xs font-bold text-[#94A3B8] line-through">
                    ${Number(product.productPrice).toFixed(2)}
                  </p>
                </div>
              ) : (
                <p className="mt-1 text-2xl font-extrabold text-[#0089D3]">
                  ${product.productPrice}
                </p>
              )}
            </div>

            <p className="text-sm font-semibold text-[#475569]">
              {isInStock ? "In stock" : "Out of stock"}
            </p>
        </div>
      </div>
      </article>
    </Link>
  );
}
