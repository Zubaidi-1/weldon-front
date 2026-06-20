"use client";
import { getApiUrl } from "@/config/api";
import type { UserOrder } from "@/lib/types/OrderTypes";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useApi } from "../api/useApi";

type UseGetUserOrdersOptions = {
  enabled?: boolean;
};

export const useGetUserOrders = (options?: UseGetUserOrdersOptions) => {
  const api = useApi();

  return useQuery<UserOrder[]>({
    queryKey: ["user-orders"],
    enabled: options?.enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,

    queryFn: async () => {
      try {
        const response = await api(getApiUrl("/order/user-orders-by-id"));

        return response as UserOrder[];
      } catch (error) {
        console.log(error, "ERROR");
        throw error;
      }
    },
  });
};

export const useCancelUserOrder = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: number) => {
      const response = await api(getApiUrl(`/order/cancel-order/${orderId}`), {
        method: "PATCH",
      });

      return response as UserOrder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order cancelled");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Could not cancel order"));
    },
  });
};
