"use client";
import { Product } from "@/lib/types/ProductTypes";
import { getApiUrl } from "@/config/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../api/useApi";
import toast from "react-hot-toast";

export const useDeleteProduct = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: number) => {
      const response = await api(getApiUrl(`/product/delete-product/${productId}`), {
        method: "DELETE",
      });
      return response as Product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-products"] });
      toast.success("Product deleted successfully!");
    },
    onError: (error: unknown) => {
      console.log(error);
      toast.error("Delete failed");
    },
  });
};
