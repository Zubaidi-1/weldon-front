"use client";

import { getApiUrl } from "@/config/api";
import type { PaginatedOrders } from "@/lib/types/OrderTypes";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useApi } from "../api/useApi";

type UseGetOrdersParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export const useGetOrders = (
  pageOrParams: number | UseGetOrdersParams = 1,
  limit = 10,
) => {
  const api = useApi();
  const params =
    typeof pageOrParams === "number"
      ? { page: pageOrParams, limit }
      : {
          page: pageOrParams.page ?? 1,
          limit: pageOrParams.limit ?? 10,
          search: pageOrParams.search?.trim(),
        };

  return useQuery({
    queryKey: ["orders", params],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        page: String(params.page),
        limit: String(params.limit),
      });

      if (params.search) {
        searchParams.set("search", params.search);
      }

      const response = await api(getApiUrl(`/order?${searchParams}`));

      return response as PaginatedOrders;
    },
  });
};

export const useGetAllOrders = () => {
  const api = useApi();

  return useQuery({
    queryKey: ["orders", "all"],
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const limit = 50;
      const firstSearchParams = new URLSearchParams({
        page: "1",
        limit: String(limit),
      });
      const firstResponse = (await api(
        getApiUrl(`/order?${firstSearchParams}`),
      )) as PaginatedOrders;

      if (firstResponse.totalPages <= 1) return firstResponse;

      const remainingPages = Array.from(
        { length: firstResponse.totalPages - 1 },
        (_, index) => index + 2,
      );
      const remainingResponses = await Promise.all(
        remainingPages.map(async (page) => {
          const searchParams = new URLSearchParams({
            page: String(page),
            limit: String(limit),
          });

          return (await api(
            getApiUrl(`/order?${searchParams}`),
          )) as PaginatedOrders;
        }),
      );

      return {
        ...firstResponse,
        orders: [
          ...firstResponse.orders,
          ...remainingResponses.flatMap((response) => response.orders),
        ],
        page: 1,
        limit: firstResponse.total,
        totalPages: 1,
      };
    },
  });
};
