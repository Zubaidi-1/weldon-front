"use client";

import {
  useCreateDiscount,
  useDeleteDiscount,
  useGetDiscounts,
  useSendDiscountReminders,
  useUpdateDiscount,
} from "@/Hooks/discounts/useDiscounts";
import { useGetAllProducts } from "@/Hooks/products/useGetAllProducts";
import ProductDashboardCard from "@/components/shared/dashboard/admin/products/ProductCards";
import CustomSelect from "@/components/shared/ui/DropDown";
import { categoryOptions } from "@/lib/options/options";
import type {
  CreateDiscountDto,
  Discount,
  DiscountScope,
  DiscountType,
  PromotionType,
} from "@/lib/types/DiscountTypes";
import type { ProductCategory } from "@/lib/types/ProductTypes";
import {
  getDiscountLabel,
  getDiscountTargetLabel,
  isDiscountActive,
} from "@/lib/utils/discounts";
import Link from "next/link";
import { useMemo, useState } from "react";

const discountTypeOptions: { label: string; value: DiscountType }[] = [
  { label: "Percentage", value: "PERCENTAGE" },
  { label: "Fixed Amount", value: "FIXED" },
];

const discountScopeOptions: { label: string; value: DiscountScope }[] = [
  { label: "Whole Store", value: "STORE" },
  { label: "Category", value: "CATEGORY" },
  { label: "Product", value: "PRODUCT" },
];

const promotionTypeOptions: { label: string; value: PromotionType }[] = [
  { label: "Sale", value: "SALE" },
  { label: "Coupon", value: "COUPON" },
];

const initialForm: CreateDiscountDto = {
  name: "",
  discountValue: 10,
  discountType: "PERCENTAGE",
  promotionType: "SALE",
  couponCode: "",
  minimumOrderTotal: undefined,
  usageLimit: undefined,
  discountScope: "STORE",
  isActive: true,
  startsAt: "",
  endsAt: "",
  discountCategories: [],
  productIds: [],
  priority: 0,
};

const formatDateInput = (date: string | null) =>
  date ? new Date(date).toISOString().slice(0, 16) : "";

export default function AdminDiscountsPage() {
  const discountsQuery = useGetDiscounts();
  const productsQuery = useGetAllProducts();
  const createDiscount = useCreateDiscount();
  const updateDiscount = useUpdateDiscount();
  const deleteDiscount = useDeleteDiscount();
  const sendReminders = useSendDiscountReminders();
  const [form, setForm] = useState<CreateDiscountDto>(initialForm);
  const [editingDiscountId, setEditingDiscountId] = useState<number | null>(
    null,
  );
  const [now] = useState(() => Date.now());

  const discounts = useMemo(() => discountsQuery.data ?? [], [discountsQuery.data]);
  const products = useMemo(() => productsQuery.data ?? [], [productsQuery.data]);
  const activeDiscounts = useMemo(
    () => discounts.filter((discount) => isDiscountActive(discount)),
    [discounts],
  );
  const endingSoonDiscounts = useMemo(
    () =>
      discounts.filter((discount) => {
        if (!discount.endsAt || !isDiscountActive(discount)) return false;

        const endsAt = new Date(discount.endsAt).getTime();
        const twoDaysFromNow = now + 48 * 60 * 60 * 1000;

        return endsAt <= twoDaysFromNow;
      }),
    [discounts, now],
  );

  const selectedProducts = useMemo(
    () =>
      products.filter((product) =>
        (form.productIds ?? []).includes(product.productId),
      ),
    [form.productIds, products],
  );

  const resetForm = () => {
    setForm(initialForm);
    setEditingDiscountId(null);
  };

  const setScope = (discountScope: DiscountScope) => {
    setForm((current) => ({
      ...current,
      discountScope,
      discountCategories:
        discountScope === "CATEGORY" ? current.discountCategories : [],
      productIds: discountScope === "PRODUCT" ? current.productIds : [],
    }));
  };

  const toggleCategory = (category: ProductCategory) => {
    setForm((current) => {
      const categories = current.discountCategories ?? [];

      return {
        ...current,
        discountCategories: categories.includes(category)
          ? categories.filter((item) => item !== category)
          : [...categories, category],
      };
    });
  };

  const toggleProduct = (productId: number) => {
    setForm((current) => {
      const productIds = current.productIds ?? [];

      return {
        ...current,
        productIds: productIds.includes(productId)
          ? productIds.filter((item) => item !== productId)
          : [...productIds, productId],
      };
    });
  };

  const startEditing = (discount: Discount) => {
    setEditingDiscountId(discount.discountId);
    setForm({
      name: discount.name,
      discountValue: Number(discount.discountValue),
      discountType: discount.discountType,
      promotionType: discount.promotionType,
      couponCode: discount.couponCode ?? "",
      minimumOrderTotal: discount.minimumOrderTotal
        ? Number(discount.minimumOrderTotal)
        : undefined,
      usageLimit: discount.usageLimit ?? undefined,
      discountScope: discount.discountScope,
      isActive: discount.isActive,
      startsAt: formatDateInput(discount.startsAt),
      endsAt: formatDateInput(discount.endsAt),
      discountCategories: discount.discountCategories ?? [],
      productIds: discount.products.map((product) => product.productId),
      priority: discount.priority,
    });
  };

  const submitDiscount = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: CreateDiscountDto = {
      name: form.name,
      discountValue: form.discountValue,
      discountType: form.discountType,
      promotionType: form.promotionType,
      discountScope: form.discountScope,
      isActive: form.isActive,
      startsAt: form.startsAt || undefined,
      endsAt: form.endsAt || undefined,
      priority: form.priority,
    };

    if (form.promotionType === "COUPON") {
      payload.couponCode = form.couponCode?.trim().toUpperCase();
      payload.minimumOrderTotal = form.minimumOrderTotal || undefined;
      payload.usageLimit = form.usageLimit || undefined;
    }

    if (form.discountScope === "CATEGORY") {
      payload.discountCategories = form.discountCategories;
    }

    if (form.discountScope === "PRODUCT") {
      payload.productIds = form.productIds;
    }

    if (editingDiscountId) {
      updateDiscount.mutate(
        { discountId: editingDiscountId, discount: payload },
        { onSuccess: resetForm },
      );
      return;
    }

    createDiscount.mutate(payload, { onSuccess: resetForm });
  };

  if (discountsQuery.isLoading || productsQuery.isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FBFD]">
        <p className="text-lg font-semibold text-[#64748B]">
          Loading discounts...
        </p>
      </main>
    );
  }

  if (discountsQuery.isError || productsQuery.isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FBFD]">
        <p className="text-lg font-semibold text-[#DC2626]">
          Failed to load discounts
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen justify-center bg-[#F8FBFD] px-6 py-24">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-4 border-b border-[#D8EAF4] pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#0089D3]">Admin</p>
            <h1 className="mt-2 text-3xl font-bold text-[#0F172A]">
              Discounts
            </h1>
            <p className="mt-2 text-sm text-[#64748B]">
              Create store-wide, category, and product sales, then notify
              customers when offers go live or end soon.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => sendReminders.mutate()}
              disabled={sendReminders.isPending}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[#0089D3] px-4 text-sm font-bold text-white transition hover:bg-[#007BBE] disabled:cursor-not-allowed disabled:bg-[#94A3B8]"
            >
              {sendReminders.isPending ? "Sending..." : "Send reminders"}
            </button>
            <Link
              href="/admin"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[#CBD5E1] bg-white px-4 text-sm font-bold text-[#475569] transition hover:bg-[#F8FBFD]"
            >
              Back to dashboard
            </Link>
          </div>
        </header>

        <section className="grid w-full grid-cols-1 gap-5 md:grid-cols-3">
          <ProductDashboardCard
            title="Total Discounts"
            value={discounts.length}
            badgeText="Sales"
            description="All configured store, category, and product discounts."
            variant="blue"
          />
          <ProductDashboardCard
            title="Active Now"
            value={activeDiscounts.length}
            badgeText="Live"
            description="Discounts currently visible and applied to products."
            variant="green"
          />
          <ProductDashboardCard
            title="Ending Soon"
            value={endingSoonDiscounts.length}
            badgeText="48 hours"
            description="Active discounts that are close to their end date."
            variant="yellow"
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
          <form
            onSubmit={submitDiscount}
            className="h-fit rounded-2xl border border-[#D8EAF4] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.06)]"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#E2E8F0] pb-4">
              <div>
                <h2 className="text-xl font-bold text-[#0F172A]">
                  {editingDiscountId ? "Edit Discount" : "Create Discount"}
                </h2>
                <p className="mt-1 text-sm text-[#64748B]">
                  Pick where the sale applies and how much customers save.
                </p>
              </div>
              {editingDiscountId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-sm font-bold text-[#0089D3]"
                >
                  New
                </button>
              )}
            </div>

            <div className="mt-5 grid gap-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#334155]">
                  Discount name
                </span>
                <input
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  required
                  minLength={3}
                  maxLength={80}
                  placeholder="Summer skincare sale"
                  className="w-full rounded-xl border border-[#CBD5E1] px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-[#0089D3] focus:ring-4 focus:ring-[#0089D3]/10"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <CustomSelect<PromotionType>
                  label="Promotion"
                  options={promotionTypeOptions}
                  value={form.promotionType ?? "SALE"}
                  onChange={(promotionType) =>
                    setForm((current) => ({
                      ...current,
                      promotionType,
                      couponCode:
                        promotionType === "COUPON" ? current.couponCode : "",
                      minimumOrderTotal:
                        promotionType === "COUPON"
                          ? current.minimumOrderTotal
                          : undefined,
                      usageLimit:
                        promotionType === "COUPON"
                          ? current.usageLimit
                          : undefined,
                    }))
                  }
                />
                <CustomSelect<DiscountType>
                  label="Type"
                  options={discountTypeOptions}
                  value={form.discountType}
                  onChange={(discountType) =>
                    setForm((current) => ({ ...current, discountType }))
                  }
                />
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#334155]">
                    Value
                  </span>
                  <input
                    value={form.discountValue}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        discountValue: Number(event.target.value),
                      }))
                    }
                    type="number"
                    min="0.01"
                    max={form.discountType === "PERCENTAGE" ? 100 : undefined}
                    step="0.01"
                    required
                    className="w-full rounded-xl border border-[#CBD5E1] px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-[#0089D3] focus:ring-4 focus:ring-[#0089D3]/10"
                  />
                </label>
              </div>

              {form.promotionType === "COUPON" && (
                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[#334155]">
                      Coupon code
                    </span>
                    <input
                      value={form.couponCode ?? ""}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          couponCode: event.target.value.toUpperCase(),
                        }))
                      }
                      required
                      minLength={3}
                      maxLength={32}
                      placeholder="SKIN10"
                      className="w-full rounded-xl border border-[#CBD5E1] px-4 py-3 text-sm font-bold uppercase text-[#0F172A] outline-none transition focus:border-[#0089D3] focus:ring-4 focus:ring-[#0089D3]/10"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[#334155]">
                      Min total
                    </span>
                    <input
                      value={form.minimumOrderTotal ?? ""}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          minimumOrderTotal: event.target.value
                            ? Number(event.target.value)
                            : undefined,
                        }))
                      }
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Optional"
                      className="w-full rounded-xl border border-[#CBD5E1] px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-[#0089D3] focus:ring-4 focus:ring-[#0089D3]/10"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[#334155]">
                      Usage limit
                    </span>
                    <input
                      value={form.usageLimit ?? ""}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          usageLimit: event.target.value
                            ? Number(event.target.value)
                            : undefined,
                        }))
                      }
                      type="number"
                      min="1"
                      placeholder="Optional"
                      className="w-full rounded-xl border border-[#CBD5E1] px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-[#0089D3] focus:ring-4 focus:ring-[#0089D3]/10"
                    />
                  </label>
                </div>
              )}

              <CustomSelect<DiscountScope>
                label="Scope"
                options={discountScopeOptions}
                value={form.discountScope}
                onChange={setScope}
              />

              {form.discountScope === "CATEGORY" && (
                <div>
                  <p className="mb-2 text-sm font-semibold text-[#334155]">
                    Categories
                  </p>
                  <div className="grid max-h-52 gap-2 overflow-y-auto rounded-xl border border-[#E2E8F0] bg-[#F8FBFD] p-3 sm:grid-cols-2">
                    {categoryOptions.map((category) => (
                      <label
                        key={category.value}
                        className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-[#475569]"
                      >
                        <input
                          type="checkbox"
                          checked={(form.discountCategories ?? []).includes(
                            category.value,
                          )}
                          onChange={() => toggleCategory(category.value)}
                          className="h-4 w-4 accent-[#0089D3]"
                        />
                        {category.label}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {form.discountScope === "PRODUCT" && (
                <div>
                  <p className="mb-2 text-sm font-semibold text-[#334155]">
                    Products
                  </p>
                  <div className="max-h-64 space-y-2 overflow-y-auto rounded-xl border border-[#E2E8F0] bg-[#F8FBFD] p-3">
                    {products.map((product) => (
                      <label
                        key={product.productId}
                        className="flex cursor-pointer items-start gap-3 rounded-lg bg-white p-3 text-sm text-[#475569]"
                      >
                        <input
                          type="checkbox"
                          checked={(form.productIds ?? []).includes(
                            product.productId,
                          )}
                          onChange={() => toggleProduct(product.productId)}
                          className="mt-1 h-4 w-4 accent-[#0089D3]"
                        />
                        <span>
                          <span className="block font-bold text-[#0F172A]">
                            {product.productName}
                          </span>
                          <span className="text-xs font-semibold text-[#64748B]">
                            ${product.productPrice}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                  {selectedProducts.length > 0 && (
                    <p className="mt-2 text-xs font-semibold text-[#64748B]">
                      {selectedProducts.length} product
                      {selectedProducts.length === 1 ? "" : "s"} selected
                    </p>
                  )}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#334155]">
                    Starts at
                  </span>
                  <input
                    value={form.startsAt}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        startsAt: event.target.value,
                      }))
                    }
                    type="datetime-local"
                    className="w-full rounded-xl border border-[#CBD5E1] px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-[#0089D3] focus:ring-4 focus:ring-[#0089D3]/10"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#334155]">
                    Ends at
                  </span>
                  <input
                    value={form.endsAt}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        endsAt: event.target.value,
                      }))
                    }
                    type="datetime-local"
                    className="w-full rounded-xl border border-[#CBD5E1] px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-[#0089D3] focus:ring-4 focus:ring-[#0089D3]/10"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#334155]">
                    Priority
                  </span>
                  <input
                    value={form.priority}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        priority: Number(event.target.value),
                      }))
                    }
                    type="number"
                    min="0"
                    max="1000"
                    className="w-full rounded-xl border border-[#CBD5E1] px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-[#0089D3] focus:ring-4 focus:ring-[#0089D3]/10"
                  />
                </label>
                <label className="flex h-12 cursor-pointer items-center gap-3 rounded-xl border border-[#CBD5E1] bg-[#F8FBFD] px-4 text-sm font-bold text-[#334155]">
                  <input
                    type="checkbox"
                    checked={Boolean(form.isActive)}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        isActive: event.target.checked,
                      }))
                    }
                    className="h-4 w-4 accent-[#0089D3]"
                  />
                  Active
                </label>
              </div>

              <button
                type="submit"
                disabled={createDiscount.isPending || updateDiscount.isPending}
                className="h-12 rounded-xl bg-[#0089D3] px-5 text-sm font-bold text-white transition hover:bg-[#007BBE] disabled:cursor-not-allowed disabled:bg-[#94A3B8]"
              >
                {editingDiscountId
                  ? updateDiscount.isPending
                    ? "Saving..."
                    : "Save discount"
                  : createDiscount.isPending
                    ? "Creating..."
                    : "Create discount"}
              </button>
            </div>
          </form>

          <section className="overflow-hidden rounded-2xl border border-[#D8EAF4] bg-white shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
            <div className="border-b border-[#E2E8F0] px-5 py-4">
              <h2 className="text-xl font-bold text-[#0F172A]">
                Current Discounts
              </h2>
              <p className="mt-1 text-sm text-[#64748B]">
                {discounts.length} discounts configured
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse">
                <thead className="bg-[#F0F9FF]">
                  <tr>
                    {[
                      "Name",
                      "Value",
                      "Scope",
                      "Dates",
                      "Status",
                      "Actions",
                    ].map(
                      (heading) => (
                        <th
                          key={heading}
                          className="px-5 py-4 text-left text-sm font-bold text-[#0089D3]"
                        >
                          {heading}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {discounts.map((discount) => (
                    <tr key={discount.discountId} className="hover:bg-[#F8FBFD]">
                      <td className="px-5 py-4">
                        <p className="font-bold text-[#0F172A]">
                          {discount.name}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-[#94A3B8]">
                          Priority {discount.priority}
                        </p>
                        {discount.promotionType === "COUPON" && (
                          <p className="mt-1 text-xs font-bold text-[#0089D3]">
                            Code {discount.couponCode}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-[#0089D3]">
                        {getDiscountLabel(discount)}
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-[#475569]">
                        <p>{discount.discountScope}</p>
                        <p className="mt-1 max-w-72 truncate text-xs text-[#94A3B8]">
                          {getDiscountTargetLabel(discount)}
                        </p>
                        {discount.promotionType === "COUPON" && (
                          <p className="mt-1 text-xs text-[#94A3B8]">
                            Used {discount.usedCount}
                            {discount.usageLimit
                              ? `/${discount.usageLimit}`
                              : ""}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-[#475569]">
                        <p>
                          {discount.startsAt
                            ? new Date(discount.startsAt).toLocaleDateString()
                            : "Starts now"}
                        </p>
                        <p className="mt-1 text-xs text-[#94A3B8]">
                          {discount.endsAt
                            ? `Ends ${new Date(discount.endsAt).toLocaleDateString()}`
                            : "No end date"}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            updateDiscount.mutate({
                              discountId: discount.discountId,
                              discount: { isActive: !discount.isActive },
                            })
                          }
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            isDiscountActive(discount)
                              ? "bg-[#DCFCE7] text-[#16A34A]"
                              : discount.isActive
                                ? "bg-[#FEF3C7] text-[#D97706]"
                                : "bg-[#FEE2E2] text-[#DC2626]"
                          }`}
                        >
                          {isDiscountActive(discount)
                            ? "Live"
                            : discount.isActive
                              ? "Scheduled"
                              : "Inactive"}
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => startEditing(discount)}
                            className="rounded-lg border border-[#0089D3]/20 px-3 py-2 text-xs font-bold text-[#0089D3] transition hover:bg-[#E6F6FD]"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              deleteDiscount.mutate(discount.discountId)
                            }
                            disabled={deleteDiscount.isPending}
                            className="rounded-lg border border-[#DC2626]/20 px-3 py-2 text-xs font-bold text-[#DC2626] transition hover:bg-[#FEE2E2] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {discounts.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-16 text-center text-sm font-semibold text-[#64748B]"
                      >
                        No discounts yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
