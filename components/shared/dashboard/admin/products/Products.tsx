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
import { getProductImages } from "@/lib/utils/productImages";
import { parseProductShades } from "@/lib/utils/productShades";
import { getProductCategories } from "@/lib/utils/productCategories";
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
  const selectedCategories =
    useWatch({ control, name: "productCategory" }) ?? [];
  const selectedStatus = useWatch({ control, name: "productStatus" });
  const selectedProductImages =
    useWatch({ control, name: "productImages" }) ?? [];
  const imagesToDelete = useWatch({ control, name: "imagesToDelete" }) ?? [];

  useEffect(() => {
    if (!open || !product) return;

      reset({
        productName: product.productName,
        productSubTitle: product.productSubTitle ?? "",
        productCategory: getProductCategories(product.productCategory),
        productStatus: product.productStatus,
        productDescription: product.productDescription,
        productPrice: Number(product.productPrice),
        productSize: Number(product.productSize),
        stockQuantity: Number(product.stockQuantity),
        productSku: product.productSku,
        productImages: undefined,
        productShades: (product.productShades ?? []).join(", "),
        imagesToDelete: [],
      });
  }, [open, product, reset]);

  if (!product) return null;

  const onSubmit = (data: EditProductType) => {
    const productData: UpdateProductDto = {
      ...data,
      productSubTitle: data.productSubTitle || undefined,
      productShades: parseProductShades(data.productShades),
    };

    mutate(
      { productId: product.productId, data: productData },
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

  const toggleCategory = (category: ProductCategory) => {
    const nextCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((item) => item !== category)
      : [...selectedCategories, category];

    setValue("productCategory", nextCategories, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const existingProductImages = getProductImages(product);
  const visibleProductImages = existingProductImages.filter(
    (image) => !imagesToDelete.includes(image),
  );

  const toggleImageDelete = (image: string) => {
    const nextImagesToDelete = imagesToDelete.includes(image)
      ? imagesToDelete.filter((item) => item !== image)
      : [...imagesToDelete, image];

    if (
      existingProductImages.length - nextImagesToDelete.length === 0 &&
      selectedProductImages.length === 0
    ) {
      toast.error("Product must have at least one image");
      return;
    }

    setValue("imagesToDelete", nextImagesToDelete, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
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
                Product Images
              </label>
              <div className="flex items-center gap-4 rounded-xl border border-[#CBD5E1] bg-[#F8FBFD] p-4">
                <div className="grid shrink-0 grid-cols-3 gap-2">
                  {visibleProductImages.map((image) => (
                    <div key={image} className="relative">
                      <div
                        role="img"
                        aria-label={product.productName}
                        className="h-20 w-20 rounded-xl border border-[#E2E8F0] bg-cover bg-center bg-no-repeat"
                        style={{
                          backgroundImage: `url(${getAssetUrl(image)})`,
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => toggleImageDelete(image)}
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#DC2626] text-xs font-bold text-white"
                        aria-label="Remove product image"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  key={`${product.productId}-${open ? "open" : "closed"}`}
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => {
                    setValue("productImages", Array.from(e.target.files ?? []), {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                  }}
                  className="w-full cursor-pointer text-sm text-[#64748B] file:mr-4 file:rounded-lg file:border-0 file:bg-[#0089D3] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                />
              </div>
              {errors.productImages?.message && (
                <InputError errorMessage={errors.productImages.message} />
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
                register={register("productSubTitle")}
                title="Product Subtitle"
                type="text"
                placeholder="Brightening night cream"
              />
              {errors.productSubTitle?.message && (
                <InputError errorMessage={errors.productSubTitle.message} />
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

            <div className="md:col-span-2 flex flex-col gap-1">
              <p className="mb-2 block text-sm font-semibold text-[#334155]">
                Categories
              </p>
              <div className="flex flex-wrap gap-2">
                {categoryOptions.map((category) => {
                  const isSelected = selectedCategories.includes(
                    category.value,
                  );

                  return (
                    <button
                      key={category.value}
                      type="button"
                      onClick={() => toggleCategory(category.value)}
                      className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${
                        isSelected
                          ? "border-[#0089D3] bg-[#0089D3] text-white"
                          : "border-[#CBD5E1] bg-white text-[#475569] hover:border-[#0089D3] hover:bg-[#F0F9FF]"
                      }`}
                    >
                      {category.label}
                    </button>
                  );
                })}
              </div>
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

            <div className="flex flex-col gap-1">
              <Input
                register={register("productShades")}
                title="Product Shades"
                type="text"
                placeholder="#f4e7dd, #d8b99d, #7a513c"
              />
              {errors.productShades?.message && (
                <InputError errorMessage={errors.productShades.message} />
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
