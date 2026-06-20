"use client";

import { getApiUrl } from "@/config/api";
import {
  CreateDiscountDto,
  Discount,
  UpdateDiscountDto,
} from "@/lib/types/DiscountTypes";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useApi } from "../api/useApi";

export const discountsQueryKey = ["discounts"];
export const activeDiscountsQueryKey = ["discounts", "active"];

export const useGetDiscounts = () => {
  const api = useApi();

  return useQuery({
    queryKey: discountsQueryKey,
    queryFn: async () => {
      const response = await api(getApiUrl("/discounts"));
      return response as Discount[];
    },
  });
};

export const useGetActiveDiscounts = () => {
  const api = useApi();

  return useQuery({
    queryKey: activeDiscountsQueryKey,
    queryFn: async () => {
      const response = await api(getApiUrl("/discounts/active"));
      return response as Discount[];
    },
  });
};

export const useCreateDiscount = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (discount: CreateDiscountDto) => {
      const response = await api(getApiUrl("/discounts"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(discount),
      });

      return response as Discount;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: discountsQueryKey });
      queryClient.invalidateQueries({ queryKey: activeDiscountsQueryKey });
      toast.success("Discount created");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Could not create discount"));
    },
  });
};

export const useUpdateDiscount = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      discountId,
      discount,
    }: {
      discountId: number;
      discount: UpdateDiscountDto;
    }) => {
      const response = await api(getApiUrl(`/discounts/${discountId}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(discount),
      });

      return response as Discount;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: discountsQueryKey });
      queryClient.invalidateQueries({ queryKey: activeDiscountsQueryKey });
      toast.success("Discount updated");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Could not update discount"));
    },
  });
};

export const useDeleteDiscount = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (discountId: number) => {
      const response = await api(getApiUrl(`/discounts/${discountId}`), {
        method: "DELETE",
      });

      return response as Discount;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: discountsQueryKey });
      queryClient.invalidateQueries({ queryKey: activeDiscountsQueryKey });
      toast.success("Discount deleted");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Could not delete discount"));
    },
  });
};

export const useSendDiscountReminders = () => {
  const api = useApi();

  return useMutation({
    mutationFn: async () => {
      return await api(getApiUrl("/discounts/send-reminders"), {
        method: "POST",
      });
    },
    onSuccess: () => {
      toast.success("Sale reminders queued");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Could not send reminders"));
    },
  });
};

export type ValidateCouponPayload = {
  couponCode: string;
  products: {
    productId: number;
    quantity: number;
  }[];
};

export type CouponPreview = {
  couponCode: string;
  discountId: number;
  discountName: string;
  couponDiscount: number;
  subtotal: number;
  total: number;
};

export const useValidateCoupon = () => {
  const api = useApi();

  return useMutation({
    mutationFn: async (payload: ValidateCouponPayload) => {
      const response = await api(getApiUrl("/discounts/validate-coupon"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      return response as CouponPreview;
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Could not apply coupon"));
    },
  });
};
