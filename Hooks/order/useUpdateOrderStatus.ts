"use client";

import { getApiUrl } from "@/config/api";
import type { Order, OrderStatus } from "@/lib/types/OrderTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useApi } from "../api/useApi";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";

type UpdateOrderStatusPayload = {
  orderId: number;
  orderStatus: OrderStatus;
};

export const useUpdateOrderStatus = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, orderStatus }: UpdateOrderStatusPayload) => {
      const response = await api(getApiUrl(`/order/${orderId}/status`), {
        method: "PATCH",
        body: JSON.stringify({ orderStatus }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response as Order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order status updated");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Could not update order status"));
    },
  });
};
