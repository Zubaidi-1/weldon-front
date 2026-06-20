"use client";

import ProductDashboardCard from "@/components/shared/dashboard/admin/products/ProductCards";
import EditProductModal from "@/components/shared/dashboard/admin/products/Products";
import ProductsTable from "@/components/shared/dashboard/admin/products/ProductsTable";
import CustomSelect from "@/components/shared/ui/DropDown";
import SearchInput from "@/components/shared/ui/SearchBar";
import { useGetAllProducts } from "@/Hooks/products/useGetAllProducts";
import {
  Product,
  ProductCategory,
  ProductStatus,
} from "@/lib/types/ProductTypes";
import {
  formatCategoryLabel,
  formatCategoryLabels,
  getProductCategories,
} from "@/lib/utils/productCategories";
import Link from "next/link";
import { useState } from "react";

const pageSize = 5;

type SelectOption<T extends string> = {
  label: string;
  value: T;
};

const categories: ProductCategory[] = [
  "MELA_WHITE",
  "ESSENTIAL",
  "HYDRATING",
  "REGULATING",
  "SENSITIVE",
  "GREEN_PEEL",
  "BEAUTY_ELEMENTS",
  "VITALITY",
  "BODY_SCIENCE",
  "BODY_CARE",
  "HAIR",
  "MEN",
  "NIGHT_CARE",
  "AMPOULE",
  "DRY_SKIN",
];

const statuses: ProductStatus[] = ["ACTIVE", "DRAFT", "OUT_OF_STOCK"];

const categoryOptions: SelectOption<ProductCategory | "ALL">[] = [
  { label: "All Categories", value: "ALL" },
  ...categories.map((category) => ({
    label: formatCategoryLabel(category),
    value: category,
  })),
];

const statusOptions: SelectOption<ProductStatus | "ALL">[] = [
  { label: "All Statuses", value: "ALL" },
  ...statuses.map((status) => ({
    label: status.replaceAll("_", " "),
    value: status,
  })),
];

function getProductStatus(product: Product): ProductStatus {
  if (product.productStatus === "OUT_OF_STOCK" || product.stockQuantity === 0) {
    return "OUT_OF_STOCK";
  }

  return product.productStatus;
}

export default function ProductsDashboard() {
  const { data: products, isLoading, error } = useGetAllProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | "ALL">(
    "ALL",
  );
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "ALL">(
    "ALL",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleOpenEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: ProductCategory | "ALL") => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: ProductStatus | "ALL") => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FBFD]">
        <p className="text-lg font-semibold text-[#64748B]">
          Loading products...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FBFD]">
        <p className="text-lg font-semibold text-[#DC2626]">
          Failed to load products
        </p>
      </div>
    );
  }

  const allProducts = products || [];

  const activeProducts = allProducts.filter(
    (product) => getProductStatus(product) === "ACTIVE",
  );

  const draftProducts = allProducts.filter(
    (product) => getProductStatus(product) === "DRAFT",
  );

  const outOfStockProducts = allProducts.filter(
    (product) => getProductStatus(product) === "OUT_OF_STOCK",
  );

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  const filteredProducts = allProducts
    .filter((product) => {
      if (!normalizedSearchQuery) return true;

      const searchableProductText = [
        product.productName,
        product.productSubTitle,
        product.productSku,
        formatCategoryLabels(product.productCategory),
        product.productStatus,
        (product.productShades ?? []).join(" "),
        String(product.productSize),
        String(product.productId),
      ]
        .join(" ")
        .replaceAll("_", " ")
        .toLowerCase();

      return searchableProductText.includes(normalizedSearchQuery);
    })
    .filter(
      (product) =>
        categoryFilter === "ALL" ||
        getProductCategories(product.productCategory).includes(categoryFilter),
    )
    .filter(
      (product) =>
        statusFilter === "ALL" || getProductStatus(product) === statusFilter,
    );

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const visiblePage = Math.min(currentPage, totalPages);
  const tableProducts = filteredProducts.slice(
    (visiblePage - 1) * pageSize,
    visiblePage * pageSize,
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FBFD] px-6 py-24 animate-fade-right">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        {/* Header */}
        <header className="flex flex-col gap-4 border-b border-[#D8EAF4] pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#0089D3]">Admin</p>
            <h1 className="mt-2 text-3xl font-bold text-[#0F172A]">
              Products
            </h1>
            <p className="mt-2 text-sm text-[#64748B]">
              Manage your products, track stock levels, and monitor product
              status from one place.
            </p>
          </div>

          <Link
            href="/admin"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-[#CBD5E1] bg-white px-4 text-sm font-bold text-[#475569] transition hover:bg-[#F8FBFD]"
          >
            Back to dashboard
          </Link>
        </header>

        {/* Cards */}
        <section className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <ProductDashboardCard
            title="Total Products"
            value={allProducts.length}
            badgeText="All"
            description="Total number of products available in your store."
            variant="blue"
          />

          <ProductDashboardCard
            title="Active Products"
            value={activeProducts.length}
            badgeText="Live"
            description="Products currently available for customers."
            variant="green"
          />

          <ProductDashboardCard
            title="Out of Stock"
            value={outOfStockProducts.length}
            badgeText="Alert"
            description="Products that need restocking."
            variant="red"
          />

          <ProductDashboardCard
            title="Draft Products"
            value={draftProducts.length}
            badgeText="Draft"
            description="Products saved but not published to the store yet."
            variant="yellow"
          />
        </section>
        <div className="flex w-full flex-col gap-4 rounded-3xl border border-[#0089D3]/20 bg-white p-4 shadow-[0_8px_30px_rgba(0,137,211,0.08)] md:flex-row md:items-center">
          <SearchInput
            value={searchQuery}
            onChange={handleSearchChange}
            onClear={() => handleSearchChange("")}
          />

          <CustomSelect<ProductCategory | "ALL">
            options={categoryOptions}
            value={categoryFilter}
            onChange={handleCategoryChange}
            className="md:w-56"
          />

          <CustomSelect<ProductStatus | "ALL">
            options={statusOptions}
            value={statusFilter}
            onChange={handleStatusChange}
            className="md:w-48"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-[#64748B]">
              Showing {tableProducts.length} of {filteredProducts.length}{" "}
              products
            </p>
            <p className="text-sm font-semibold text-[#94A3B8]">
              Page {visiblePage} of {totalPages}
            </p>
          </div>

          <ProductsTable
            products={tableProducts}
            totalProducts={filteredProducts.length}
            getProductStatus={getProductStatus}
            onEdit={handleOpenEdit}
          />

          {filteredProducts.length > pageSize && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                disabled={visiblePage === 1}
                onClick={() => setCurrentPage(Math.max(1, visiblePage - 1))}
                className="h-10 rounded-xl border border-[#CBD5E1] bg-white px-4 text-sm font-semibold text-[#475569] transition hover:bg-[#F8FBFD] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
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
                ),
              )}

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
        </div>
      </div>

      <EditProductModal
        open={isEditOpen}
        product={selectedProduct}
        onClose={handleCloseEdit}
      />
    </main>
  );
}
