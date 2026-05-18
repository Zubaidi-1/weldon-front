"use client";

import { Product, UpdateProductDto } from "@/lib/types/ProductTypes";
import { getApiUrl } from "@/config/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../api/useApi";

type UpdateProductVariables = {
  productId: number;
  data: UpdateProductDto;
};

export const useUpdateProduct = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, data }: UpdateProductVariables) => {
      const formData = new FormData();

      formData.append("productName", data.productName);
      formData.append("productDescription", data.productDescription);
      formData.append("productPrice", String(data.productPrice));
      formData.append("productSize", String(data.productSize));
      formData.append("productCategory", data.productCategory);
      formData.append("productStatus", data.productStatus);
      formData.append("productSku", data.productSku);
      formData.append("stockQuantity", String(data.stockQuantity));

      if (data.productImage) {
        formData.append("productImage", data.productImage);
      }

      const response = await api(getApiUrl(`/product/update-product/${productId}`), {
        method: "PATCH",
        body: formData,
      });

      return response as Product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-products"] });
    },
  });
};
