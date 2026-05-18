"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../api/useApi";
import { CartProduct } from "@/lib/types/ProductTypes";
import { getApiUrl } from "@/config/api";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { useGetMe } from "../user/useGetMe";
import { addGuestCartItem, type GuestCartInput } from "@/lib/utils/guestCart";

export const useAddToCart = () => {
  const api = useApi();
  const { data: user } = useGetMe();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: GuestCartInput) => {
      if (!user?.id) {
        return addGuestCartItem(data);
      }

      const cartProduct: CartProduct = {
        productId: data.productId,
        productName: data.productName,
        productSize: data.productSize,
        price: data.price,
        quantity: data.quantity,
        productImage: data.productImage,
      };

      return await api(getApiUrl("/cart/add"), {
        method: "POST",
        body: JSON.stringify(cartProduct),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },

    onSuccess: () => {
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ["get-me"] });
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }

      toast.success("Added to cart");
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Could not add item to cart"));
    },
  });
};
