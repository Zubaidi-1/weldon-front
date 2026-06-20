"use client";

import { getApiUrl } from "@/config/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useApi } from "../api/useApi";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";

export type CreateOrderPayload = {
  orderEmail: string;
  orderPhoneNumber: string;
  orderFirstName: string;
  orderLastName: string;
  orderGovernate: string;
  orderAddress: string;
  couponCode?: string;
  products?: {
    productId: number;
    productName: string;
    productImage: string | null;
    productPrice: number;
    quantity: number;
    size: number;
  }[];
};

export const useCreateOrder = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateOrderPayload) => {
      return await api(getApiUrl("/order"), {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["get-me"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["all-products"] });
      toast.success("Order placed successfully");
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Could not place order"));
    },
  });
};
