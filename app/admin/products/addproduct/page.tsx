"use client";

import CustomSelect from "@/components/shared/ui/DropDown";
import Input from "@/components/shared/ui/Input";
import { categoryOptions, statusOptions } from "@/lib/options/options";
import { useForm, useWatch } from "react-hook-form";
import {
  AddProductSchema,
  AddProductType,
} from "@/schemas/products/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateProductDto,
  ProductCategory,
  ProductStatus,
} from "@/lib/types/ProductTypes";
import { useCreateProduct } from "@/Hooks/products/useCreateProduct";
import InputError from "@/components/shared/ui/InputError";
import Link from "next/link";

export default function CreateProductForm() {
  const { mutate, isPending } = useCreateProduct();

  //  Form handling
  const {
    register,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AddProductType>({
    resolver: zodResolver(AddProductSchema),
  });
  const selectedCategory = useWatch({ control, name: "productCategory" });
  const selectedStatus = useWatch({ control, name: "productStatus" });

  // Form submission
  const onSubmit = (data: CreateProductDto) => {
    mutate(data);
  };
  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-white animate-fade-right">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-3xl rounded-2xl border border-[#0089D3]/25 bg-white p-6 shadow-[0_8px_30px_rgba(0,137,211,0.12)]"
      >
        <div className="mb-8">
          <p className="text-sm font-medium text-[#0089D3]">Product</p>
          <h1 className="mt-1 text-3xl font-bold text-[#0F172A]">
            Create Product
          </h1>
          <p className="mt-2 text-sm text-[#64748B]">
            Add a new product to your store.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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

          <div>
            <div className="w-full flex flex-col gap-1">
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
          </div>

          <div className="flex flex-col gap-1">
            <Input
              title="Product Price"
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
            <label className="mb-2 block text-sm font-medium text-[#334155]">
              Product Image
            </label>
            <input
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (!file) return;

                setValue("productImage", file, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                });
              }}
              type="file"
              accept="image/*"
              className="w-full cursor-pointer rounded-xl border border-dashed border-[#0089D3]/40 bg-[#F8FBFD] px-4 py-4 text-sm text-[#64748B] outline-none file:mr-4 file:rounded-lg file:border-0 file:bg-[#0089D3] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:bg-[#F1F9FD]"
            />
            {errors.productImage?.message && (
              <InputError errorMessage={errors.productImage.message} />
            )}
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-[#334155]">
              Description
            </label>
            <textarea
              {...register("productDescription")}
              rows={5}
              placeholder="Write product description..."
              className="w-full resize-none rounded-xl border border-[#CBD5E1] px-4 py-3 text-sm outline-none transition focus:border-[#0089D3] focus:ring-4 focus:ring-[#0089D3]/10 text-gray-700"
            />
            {errors.productDescription?.message && (
              <InputError errorMessage={errors.productDescription.message} />
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Link
            href={"/admin/products"}
            type="button"
            className="rounded-xl border border-[#CBD5E1] px-5 py-3 text-sm font-semibold text-[#475569] transition hover:bg-[#F8FAFC]"
          >
            Cancel
          </Link>

          <button
            disabled={isPending}
            type="submit"
            className="rounded-xl bg-[#0089D3] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(0,137,211,0.25)] transition hover:bg-[#0077B8]"
          >
            {isPending ? "Creating...." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
