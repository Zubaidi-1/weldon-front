"use client";

import { getAssetUrl } from "@/config/api";
import { useAddToCart } from "@/Hooks/cart/useAddToCart";
import { useGetAllProducts } from "@/Hooks/products/useGetAllProducts";
import { getAvailableStock } from "@/lib/utils/productStock";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

const formatLabel = (value: string) =>
  value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function StoreProductPage() {
  const params = useParams<{ productId: string }>();
  const { data, isLoading, isError } = useGetAllProducts();
  const { mutate: addToCart, isPending } = useAddToCart();
  const [quantity, setQuantity] = useState(1);
  const product = data?.find(
    (item) => item.productId === Number(params.productId),
  );
  const availableStock = product ? getAvailableStock(product) : 0;
  const isInStock = availableStock > 0;
  const maxQuantity = Math.max(1, availableStock);
  const selectedQuantity = Math.min(Math.max(1, quantity), maxQuantity);

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

  const totalPrice = product.productPrice * selectedQuantity;

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
          <div className="flex items-center justify-center rounded-2xl border border-[#D8EAF4] bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.08)] sm:p-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getAssetUrl(product.productImage)}
              alt={product.productName}
              className="h-auto max-h-[440px] w-full max-w-[430px] object-contain"
            />
          </div>

          <section className="flex flex-col justify-center rounded-2xl border border-[#D8EAF4] bg-white p-6 text-center shadow-[0_10px_28px_rgba(15,23,42,0.06)] sm:p-8 lg:text-left">
            <p className="text-sm font-bold text-[#0089D3]">
              {formatLabel(product.productCategory)}
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-[#0F172A] sm:text-4xl">
              {product.productName}
            </h1>

            <p className="mt-5 text-base leading-8 text-[#64748B]">
              {product.productDescription}
            </p>

            <div className="mt-8 flex flex-col gap-4 border-y border-[#D8EAF4] py-6 sm:flex-row sm:items-center sm:justify-center lg:justify-between">
              <p className="text-4xl font-extrabold text-[#0089D3]">
                ${totalPrice.toFixed(2)}
              </p>
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
                  price: product.productPrice,
                  productId: product.productId,
                  productName: product.productName,
                  productSize: product.productSize,
                  productImage: product.productImage,
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
