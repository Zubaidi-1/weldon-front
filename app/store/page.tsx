"use client";

import ProductStoreCard from "@/components/shared/dashboard/admin/products/ProductsStoreCard";
import { useGetActiveDiscounts } from "@/Hooks/discounts/useDiscounts";
import { useGetAllProducts } from "@/Hooks/products/useGetAllProducts";
import { categoryOptions } from "@/lib/options/options";
import { ProductCategory } from "@/lib/types/ProductTypes";
import { getDiscountLabel, getDiscountTargetLabel } from "@/lib/utils/discounts";
import {
  formatCategoryLabels,
  getProductCategories,
} from "@/lib/utils/productCategories";
import { isProductInStock } from "@/lib/utils/productStock";
import { getFeaturedSaleDiscounts } from "@/lib/utils/discounts";
import { useMemo, useState } from "react";

const pageSize = 6;

type CategoryFilter = ProductCategory | "ALL";
type StockFilter = "ALL" | "IN_STOCK" | "OUT_OF_STOCK";

export default function StorePage() {
  const { data, isLoading, isError } = useGetAllProducts();
  const { data: activeDiscounts = [] } = useGetActiveDiscounts();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("ALL");
  const [stockFilter, setStockFilter] = useState<StockFilter>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const featuredDiscounts = useMemo(
    () => getFeaturedSaleDiscounts(activeDiscounts),
    [activeDiscounts],
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const products = data || [];

    return products
      .filter((product) => product.productStatus !== "DRAFT")
      .filter((product) => {
        if (!normalizedQuery) return true;

        return [
          product.productName,
          product.productSubTitle,
          product.productDescription,
          formatCategoryLabels(product.productCategory),
          (product.productShades ?? []).join(" "),
          product.productSku,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .filter(
        (product) =>
          categoryFilter === "ALL" ||
          getProductCategories(product.productCategory).includes(
            categoryFilter,
          ),
      )
      .filter((product) => {
        if (stockFilter === "ALL") return true;
        if (stockFilter === "IN_STOCK") return isProductInStock(product);

        return !isProductInStock(product);
      });
  }, [categoryFilter, data, searchQuery, stockFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const visiblePage = Math.min(currentPage, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (visiblePage - 1) * pageSize,
    visiblePage * pageSize,
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: CategoryFilter) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };

  const handleStockChange = (value: StockFilter) => {
    setStockFilter(value);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FBFD]">
        <p className="text-lg font-semibold text-[#64748B]">
          Loading products...
        </p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FBFD]">
        <p className="text-lg font-semibold text-[#DC2626]">
          Failed to load products
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FBFD] px-4 pb-12 pt-24 sm:px-6 md:pt-28 lg:px-8 lg:pt-32 flex justify-center items-start animate-fade-right">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 ">
        <header className="flex flex-col gap-5 border-b border-[#D8EAF4] pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#0089D3]">Store</p>
            <h1 className="mt-2 text-3xl font-bold text-[#0F172A] sm:text-4xl">
              All Products
            </h1>
          </div>

          <div className="w-full lg:max-w-md">
            <label htmlFor="store-search" className="sr-only">
              Search products
            </label>
            <input
              id="store-search"
              value={searchQuery}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search by name, category, or SKU"
              className="h-12 w-full rounded-xl border border-[#CBD5E1] bg-white px-4 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#0089D3] focus:ring-4 focus:ring-[#0089D3]/10"
            />
          </div>
        </header>

        {featuredDiscounts.length > 0 && (
          <section className="rounded-2xl border border-[#F7C6C6] bg-white p-5 shadow-[0_10px_28px_rgba(220,38,38,0.08)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-bold text-[#DC2626]">
                  Active Sales
                </p>
                <h2 className="mt-1 text-2xl font-bold text-[#0F172A]">
                  Save on selected skincare
                </h2>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {featuredDiscounts.map((discount) => (
                  <div
                    key={discount.discountId}
                    className="min-w-56 rounded-xl bg-[#FFF7F7] p-4"
                  >
                    <p className="text-sm font-bold text-[#0F172A]">
                      {discount.name}
                    </p>
                    <p className="mt-1 text-lg font-extrabold text-[#DC2626]">
                      {getDiscountLabel(discount)}
                    </p>
                    <p className="mt-1 truncate text-xs font-semibold text-[#64748B]">
                      {getDiscountTargetLabel(discount)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-2xl border border-[#D8EAF4] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
              <h2 className="text-lg font-bold text-[#0F172A]">Filters</h2>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("ALL");
                  setStockFilter("ALL");
                  setCurrentPage(1);
                }}
                className="text-sm font-semibold text-[#0089D3] transition hover:text-[#006FA8]"
              >
                Clear
              </button>
            </div>

            <div className="mt-5">
              <p className="text-sm font-bold text-[#334155]">Category</p>
              <div className="mt-3 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleCategoryChange("ALL")}
                  className={`rounded-xl px-3 py-2 text-left text-sm font-semibold transition ${
                    categoryFilter === "ALL"
                      ? "bg-[#0089D3] text-white"
                      : "bg-[#F8FBFD] text-[#475569] hover:bg-[#E6F6FD]"
                  }`}
                >
                  All categories
                </button>
                {categoryOptions.map((category) => (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => handleCategoryChange(category.value)}
                    className={`rounded-xl px-3 py-2 text-left text-sm font-semibold transition ${
                      categoryFilter === category.value
                        ? "bg-[#0089D3] text-white"
                        : "bg-[#F8FBFD] text-[#475569] hover:bg-[#E6F6FD]"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-[#E2E8F0] pt-5">
              <p className="text-sm font-bold text-[#334155]">Availability</p>
              <div className="mt-3 flex flex-col gap-2">
                {[
                  { label: "All products", value: "ALL" },
                  { label: "In stock", value: "IN_STOCK" },
                  { label: "Out of stock", value: "OUT_OF_STOCK" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-center gap-3 rounded-xl bg-[#F8FBFD] px-3 py-2 text-sm font-semibold text-[#475569]"
                  >
                    <input
                      type="radio"
                      name="stockFilter"
                      checked={stockFilter === option.value}
                      onChange={() =>
                        handleStockChange(option.value as StockFilter)
                      }
                      className="h-4 w-4 accent-[#0089D3]"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          </aside>

          <section className="flex min-w-0 flex-col gap-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold text-[#64748B]">
                Showing {paginatedProducts.length} of {filteredProducts.length}{" "}
                products
              </p>
              <p className="text-sm font-semibold text-[#94A3B8]">
                Page {visiblePage} of {totalPages}
              </p>
            </div>

            {paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {paginatedProducts.map((product) => (
                  <ProductStoreCard
                    key={product.productId}
                    product={product}
                    discounts={activeDiscounts}
                  />
                ))}
              </div>
            ) : (
              <div className="flex min-h-80 items-center justify-center rounded-2xl border border-dashed border-[#BFDCEB] bg-white">
                <p className="text-base font-semibold text-[#64748B]">
                  No products match these filters
                </p>
              </div>
            )}

            {filteredProducts.length > pageSize && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  disabled={visiblePage === 1}
                  onClick={() => setCurrentPage(Math.max(1, visiblePage - 1))}
                  className="h-10 rounded-xl border border-[#CBD5E1] bg-white px-4 text-sm font-semibold text-[#475569] transition hover:bg-[#F8FBFD] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1,
                ).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`h-10 w-10 rounded-xl text-sm font-bold transition ${
                      visiblePage === page
                        ? "bg-[#0089D3] text-white"
                        : "border border-[#CBD5E1] bg-white text-[#475569] hover:bg-[#F8FBFD]"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={visiblePage === totalPages}
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, visiblePage + 1))
                  }
                  className="h-10 rounded-xl border border-[#CBD5E1] bg-white px-4 text-sm font-semibold text-[#475569] transition hover:bg-[#F8FBFD] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
