"use client";

import CustomSelect from "@/components/shared/ui/DropDown";
import Input from "@/components/shared/ui/Input";
import InputError from "@/components/shared/ui/InputError";
import { useUpdateProduct } from "@/Hooks/products/useUpdateProduct";
import { getAssetUrl } from "@/config/api";
import { categoryOptions, statusOptions } from "@/lib/options/options";
import {
  Product,
  ProductCategory,
  ProductStatus,
  UpdateProductDto,
} from "@/lib/types/ProductTypes";
import {
  EditProductSchema,
  EditProductType,
} from "@/schemas/products/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FieldErrors, useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

type EditProductModalProps = {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSave?: (product: Product) => void;
};

type ApiError = {
  status?: number;
  message?: string | string[];
};

export default function EditProductModal({
  open,
  product,
  onClose,
  onSave,
}: EditProductModalProps) {
  const { mutate, isPending } = useUpdateProduct();
  const {
    register,
    setValue,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EditProductType>({
    resolver: zodResolver(EditProductSchema),
  });
  const selectedCategory = useWatch({ control, name: "productCategory" });
  const selectedStatus = useWatch({ control, name: "productStatus" });

  useEffect(() => {
    if (!product) return;

    reset({
      productName: product.productName,
      productCategory: product.productCategory,
      productStatus: product.productStatus,
      productDescription: product.productDescription,
      productPrice: Number(product.productPrice),
      productSize: Number(product.productSize),
      stockQuantity: Number(product.stockQuantity),
      productSku: product.productSku,
      productImage: undefined,
    });
  }, [product, reset]);

  if (!product) return null;

  const onSubmit = (data: UpdateProductDto) => {
    mutate(
      { productId: product.productId, data },
      {
        onSuccess: (updatedProduct) => {
          toast.success("Product updated successfully");
          onSave?.(updatedProduct);
          onClose();
        },
        onError: (error: ApiError) => {
          if (error.status === 400) {
            toast.error(
              Array.isArray(error.message)
                ? error.message.join(", ")
                : error.message || "Please check the product details",
            );

            return;
          }

          toast.error("Failed to update product");
        },
      },
    );
  };

  const onInvalid = (formErrors: FieldErrors<EditProductType>) => {
    const firstError = Object.values(formErrors)[0];
    const message =
      typeof firstError?.message === "string"
        ? firstError.message
        : "Please fix the validation errors";

    toast.error(message);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/40 px-4 transition-opacity duration-200 ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div
        className={`w-full max-w-2xl overflow-hidden rounded-3xl border border-[#0089D3]/20 bg-white shadow-[0_8px_30px_rgba(0,137,211,0.18)] transition-all duration-200 ${
          open ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#F0F9FF] px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-[#0F172A]">Edit Product</h2>
            <p className="mt-1 text-sm text-[#64748B]">
              Update product details and stock information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg font-bold text-[#0089D3] shadow-sm transition hover:bg-[#E6F6FD]"
          >
            x
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
          <div className="grid gap-5 px-6 py-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-[#334155]">
                Product Image
              </label>
              <div className="flex items-center gap-4 rounded-xl border border-[#CBD5E1] bg-[#F8FBFD] p-4">
                <div
                  role="img"
                  aria-label={product.productName}
                  className="h-20 w-20 shrink-0 rounded-xl border border-[#E2E8F0] bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url(${getAssetUrl(product.productImage)})`,
                  }}
                />
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    setValue("productImage", file, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                  }}
                  className="w-full cursor-pointer text-sm text-[#64748B] file:mr-4 file:rounded-lg file:border-0 file:bg-[#0089D3] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                />
              </div>
              {errors.productImage?.message && (
                <InputError errorMessage={errors.productImage.message} />
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Input
                register={register("productName")}
                title="Product Name"
                type="text"
                placeholder="Nike Air Max"
              />
              {errors.productName?.message && (
                <InputError errorMessage={errors.productName.message} />
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Input
                title="Price"
                type="number"
                step="0.01"
                placeholder="$20.00"
                register={register("productPrice", { valueAsNumber: true })}
              />
              {errors.productPrice?.message && (
                <InputError errorMessage={errors.productPrice.message} />
              )}
            </div>

            <div className="flex flex-col gap-1">
              <CustomSelect<ProductCategory>
                label="Category"
                placeholder="Choose category"
                options={categoryOptions}
                value={selectedCategory}
                onChange={(value) =>
                  setValue("productCategory", value, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }
              />
              {errors.productCategory?.message && (
                <InputError errorMessage={errors.productCategory.message} />
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Input
                title="Stock Quantity"
                type="number"
                placeholder="120"
                register={register("stockQuantity", { valueAsNumber: true })}
              />
              {errors.stockQuantity?.message && (
                <InputError errorMessage={errors.stockQuantity.message} />
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Input
                title="Product Size"
                type="number"
                placeholder="50"
                register={register("productSize", { valueAsNumber: true })}
              />
              {errors.productSize?.message && (
                <InputError errorMessage={errors.productSize.message} />
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Input
                title="SKU"
                type="text"
                placeholder="SC123"
                register={register("productSku")}
              />
              {errors.productSku?.message && (
                <InputError errorMessage={errors.productSku.message} />
              )}
            </div>

            <div className="flex flex-col gap-1">
              <CustomSelect<ProductStatus>
                label="Status"
                placeholder="Choose status"
                options={statusOptions}
                value={selectedStatus}
                onChange={(value) =>
                  setValue("productStatus", value, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }
              />
              {errors.productStatus?.message && (
                <InputError errorMessage={errors.productStatus.message} />
              )}
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-[#334155]">
                Description
              </label>
              <textarea
                {...register("productDescription")}
                rows={4}
                placeholder="Write product description..."
                className="w-full resize-none rounded-xl border border-[#CBD5E1] px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-[#0089D3] focus:ring-4 focus:ring-[#0089D3]/10"
              />
              {errors.productDescription?.message && (
                <InputError errorMessage={errors.productDescription.message} />
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-[#E2E8F0] bg-[#F8FBFD] px-6 py-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#CBD5E1] bg-white px-5 py-3 text-sm font-semibold text-[#334155] transition hover:bg-[#F1F5F9]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="rounded-xl bg-[#0089D3] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0077B8] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
