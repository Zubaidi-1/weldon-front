import { Product } from "@/lib/types/ProductTypes";
import { getAssetUrl } from "@/config/api";
import Link from "next/link";
import { isProductInStock } from "@/lib/utils/productStock";

type Props = {
  product: Product;
};

const formatLabel = (value: string) =>
  value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function ProductStoreCard({ product }: Props) {
  const productImageUrl = getAssetUrl(product.productImage);
  const isInStock = isProductInStock(product);

  return (
    <Link
      href={`/store/${product.productId}`}
      className="group flex h-full overflow-hidden rounded-2xl border border-[#D8EAF4] bg-white shadow-[0_10px_28px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:border-[#0089D3]/45 hover:shadow-[0_18px_42px_rgba(0,137,211,0.16)]"
    >
      <article className="flex h-full w-full flex-col">
        <div className="relative h-64 w-full overflow-hidden bg-[#EEF7FB]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={productImageUrl}
          alt={product.productName}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

        <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
            <h2 className="line-clamp-2 text-xl font-bold leading-7 text-[#0F172A]">
            {product.productName}
            </h2>

            <span className="shrink-0 rounded-full bg-[#E6F6FD] px-3 py-1 text-xs font-bold text-[#0089D3]">
              {formatLabel(product.productCategory)}
          </span>
        </div>

          <p className="line-clamp-3 text-sm leading-6 text-[#64748B]">
          {product.productDescription}
        </p>

          <div className="mt-auto flex items-end justify-between gap-4 border-t border-[#E2E8F0] pt-4">
            <div>
              <p className="text-xs font-semibold uppercase text-[#94A3B8]">
                Price
              </p>
              <p className="mt-1 text-2xl font-extrabold text-[#0089D3]">
            ${product.productPrice}
          </p>
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
