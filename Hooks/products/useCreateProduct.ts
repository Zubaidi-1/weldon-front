"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../api/useApi";
import { CreateProductDto } from "@/lib/types/ProductTypes";
import { getApiUrl } from "@/config/api";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";

export const useCreateProduct = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProductDto) => {
      const formData = new FormData();

      formData.append("productName", data.productName);
      formData.append("productSubTitle", data.productSubTitle ?? "");
      formData.append("productDescription", data.productDescription);
      formData.append("productPrice", String(data.productPrice));
      formData.append("productSize", String(data.productSize));
      formData.append("productCategory", JSON.stringify(data.productCategory));
      formData.append("productStatus", data.productStatus);
      formData.append("productSku", data.productSku);
      formData.append("stockQuantity", String(data.stockQuantity));

      data.productImages.forEach((productImage) => {
        formData.append("productImages", productImage);
      });

      if (data.productShades?.length) {
        formData.append("productShades", JSON.stringify(data.productShades));
      }

      return await api(getApiUrl("/product/create-product"), {
        method: "POST",
        body: formData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-products"] });
      toast.success("Product added successfully");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to add product"));
    },
  });
};
