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
import Link from "next/link";
import { useState } from "react";

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
  "BEAUTY_ELEMENTS",
  "VITALITY",
  "BODY_SCIENCE",
  "HAIR",
  "MEN",
];

const statuses: ProductStatus[] = ["ACTIVE", "DRAFT", "OUT_OF_STOCK"];

const categoryOptions: SelectOption<ProductCategory | "ALL">[] = [
  { label: "All Categories", value: "ALL" },
  ...categories.map((category) => ({
    label: category.replaceAll("_", " "),
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

  const handleOpenEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
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
        product.productSku,
        product.productCategory,
        product.productStatus,
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
        categoryFilter === "ALL" || product.productCategory === categoryFilter,
    )
    .filter(
      (product) =>
        statusFilter === "ALL" || getProductStatus(product) === statusFilter,
    );

  const tableProducts = filteredProducts.slice(0, 5);

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
            onChange={setSearchQuery}
            onClear={() => setSearchQuery("")}
          />

          <CustomSelect<ProductCategory | "ALL">
            options={categoryOptions}
            value={categoryFilter}
            onChange={setCategoryFilter}
            className="md:w-56"
          />

          <CustomSelect<ProductStatus | "ALL">
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            className="md:w-48"
          />
        </div>

        {/* Table */}
        <ProductsTable
          products={tableProducts}
          getProductStatus={getProductStatus}
          onEdit={handleOpenEdit}
        />
      </div>

      <EditProductModal
        open={isEditOpen}
        product={selectedProduct}
        onClose={handleCloseEdit}
      />
    </main>
  );
}
