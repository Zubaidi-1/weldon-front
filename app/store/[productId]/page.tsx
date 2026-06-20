"use client";

import { getAssetUrl } from "@/config/api";
import { useAddToCart } from "@/Hooks/cart/useAddToCart";
import { useGetActiveDiscounts } from "@/Hooks/discounts/useDiscounts";
import { useGetAllProducts } from "@/Hooks/products/useGetAllProducts";
import { getAvailableStock } from "@/lib/utils/productStock";
import {
  getPrimaryProductImage,
  getProductImages,
} from "@/lib/utils/productImages";
import { formatProductSize } from "@/lib/utils/productSize";
import { formatCategoryLabels } from "@/lib/utils/productCategories";
import { ProductReviews } from "@/components/shared/dashboard/admin/products/Review";
import {
  getBestProductDiscount,
  getDiscountLabel,
} from "@/lib/utils/discounts";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function StoreProductPage() {
  const params = useParams<{ productId: string }>();
  const { data, isLoading, isError } = useGetAllProducts();
  const { data: activeDiscounts = [] } = useGetActiveDiscounts();
  const { mutate: addToCart, isPending } = useAddToCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState({
    productId: 0,
    image: "",
  });
  const product = data?.find(
    (item) => item.productId === Number(params.productId),
  );
  const productImages = product ? getProductImages(product) : [];
  const primaryProductImage = product ? getPrimaryProductImage(product) : "";
  const activeProductImage =
    selectedImage.productId === product?.productId
      ? selectedImage.image
      : primaryProductImage;
  const availableStock = product ? getAvailableStock(product) : 0;
  const isInStock = availableStock > 0;
  const maxQuantity = Math.max(1, availableStock);
  const selectedQuantity = Math.min(Math.max(1, quantity), maxQuantity);
  const sale = product ? getBestProductDiscount(product, activeDiscounts) : null;
  const hasSale = Boolean(sale && sale.price < (product?.productPrice ?? 0));

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FBFD]">
        <p className="text-lg font-semibold text-[#64748B]">
          Loading product...
        </p>
      </main>
    );
  }

  if (isError || !product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FBFD] px-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-[#DC2626]">
            Product not found
          </p>
          <Link
            href="/store"
            className="mt-4 inline-flex rounded-xl bg-[#0089D3] px-5 py-3 text-sm font-semibold text-white"
          >
            Back to store
          </Link>
        </div>
      </main>
    );
  }

  const unitPrice = hasSale && sale ? sale.price : product.productPrice;
  const totalPrice = unitPrice * selectedQuantity;

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const increaseQuantity = () => {
    setQuantity((current) => Math.min(maxQuantity, current + 1));
  };

  return (
    <main className="min-h-screen bg-[#F8FBFD] px-4 py-24 sm:px-6 lg:px-8 flex justify-center items-center ">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 animate-jump-in">
        <Link
          href="/store"
          className="w-fit text-sm font-semibold text-[#0089D3] transition hover:text-[#006FA8]"
        >
          Back to store
        </Link>

        <div className="grid items-stretch gap-8 lg:grid-cols-[minmax(320px,0.9fr)_minmax(420px,1.1fr)]">
          <div className="flex flex-col gap-4 rounded-2xl border border-[#D8EAF4] bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.08)] sm:p-8">
            <div className="flex min-h-[320px] items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getAssetUrl(activeProductImage)}
                alt={product.productName}
                className="h-auto max-h-[440px] w-full max-w-[430px] object-contain"
              />
            </div>

            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
                {productImages.map((image) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() =>
                      setSelectedImage({ productId: product.productId, image })
                    }
                    className={`aspect-square overflow-hidden rounded-xl border bg-[#F8FBFD] p-1 transition ${
                      activeProductImage === image
                        ? "border-[#0089D3] ring-2 ring-[#0089D3]/20"
                        : "border-[#D8EAF4] hover:border-[#0089D3]/50"
                    }`}
                    aria-label={`View ${product.productName} image`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getAssetUrl(image)}
                      alt={product.productName}
                      className="h-full w-full rounded-lg object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <section className="flex flex-col justify-center rounded-2xl border border-[#D8EAF4] bg-white p-6 text-center shadow-[0_10px_28px_rgba(15,23,42,0.06)] sm:p-8 lg:text-left">
            <p className="text-sm font-bold text-[#0089D3]">
              {formatCategoryLabels(product.productCategory)}
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-[#0F172A] sm:text-4xl">
              {product.productName}
            </h1>

            <ProductReviews productId={product.productId} />

            {product.productSubTitle && (
              <p className="mt-3 text-base font-semibold text-[#334155]">
                {product.productSubTitle}
              </p>
            )}

            <p className="mt-5 text-base leading-8 text-[#64748B]">
              {product.productDescription}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <span className="rounded-full bg-[#F0F9FF] px-4 py-2 text-sm font-bold text-[#0089D3]">
                {formatProductSize(product.productSize)}
              </span>

              {(product.productShades ?? []).length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  {(product.productShades ?? []).map((shade) => (
                    <span
                      key={shade}
                      className="h-6 w-6 rounded-full border border-[#CBD5E1]"
                      style={{ backgroundColor: shade }}
                      title={shade}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-4 border-y border-[#D8EAF4] py-6 sm:flex-row sm:items-center sm:justify-center lg:justify-between">
              <div>
                {hasSale && sale && (
                  <span className="mb-2 inline-flex rounded-full bg-[#FEE2E2] px-3 py-1 text-xs font-bold text-[#DC2626]">
                    {getDiscountLabel(sale.discount)}
                  </span>
                )}
                <p
                  className={`text-4xl font-extrabold ${
                    hasSale ? "text-[#DC2626]" : "text-[#0089D3]"
                  }`}
                >
                  ${totalPrice.toFixed(2)}
                </p>
                {hasSale && (
                  <p className="mt-1 text-sm font-bold text-[#94A3B8] line-through">
                    ${(product.productPrice * selectedQuantity).toFixed(2)}
                  </p>
                )}
              </div>
              <span className="mx-auto w-fit rounded-full bg-[#E6F6FD] px-4 py-2 text-sm font-bold text-[#0089D3] lg:mx-0">
                {isInStock ? "In stock" : "Out of stock"}
              </span>
            </div>

            <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <p className="text-sm font-bold text-[#334155]">Quantity</p>
              <div className="flex h-11 overflow-hidden rounded-lg border border-[#CBD5E1] bg-white">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={!isInStock || selectedQuantity <= 1}
                  className="flex w-11 items-center justify-center text-xl font-semibold text-[#0089D3] transition hover:bg-[#E6F6FD] disabled:cursor-not-allowed disabled:text-[#CBD5E1] disabled:hover:bg-white"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="flex w-14 items-center justify-center border-x border-[#CBD5E1] text-sm font-bold text-[#0F172A]">
                  {selectedQuantity}
                </span>
                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={!isInStock || selectedQuantity >= maxQuantity}
                  className="flex w-11 items-center justify-center text-xl font-semibold text-[#0089D3] transition hover:bg-[#E6F6FD] disabled:cursor-not-allowed disabled:text-[#CBD5E1] disabled:hover:bg-white"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={() =>
                addToCart({
                  price: unitPrice,
                  productId: product.productId,
                  productName: product.productName,
                  productSize: product.productSize,
                  productImage: primaryProductImage,
                  quantity: selectedQuantity,
                  maxQuantity,
                })
              }
              type="button"
              disabled={!isInStock || isPending}
              className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#0089D3] px-8 text-sm font-bold text-white shadow-[0_12px_24px_rgba(0,137,211,0.22)] transition hover:bg-[#007BBE] hover:shadow-[0_16px_30px_rgba(0,137,211,0.28)] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#94A3B8] disabled:shadow-none sm:w-auto sm:min-w-56"
            >
              {isInStock
                ? isPending
                  ? "Adding ..."
                  : "Add to Cart"
                : "Out of stock"}
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}
