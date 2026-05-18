"use client";

import { getApiUrl } from "@/config/api";
import type { PaginatedOrders } from "@/lib/types/OrderTypes";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "../api/useApi";

export const useGetOrders = (page = 1, limit = 10) => {
  const api = useApi();

  return useQuery({
    queryKey: ["orders", page, limit],
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      const response = await api(getApiUrl(`/order?${searchParams}`));

      return response as PaginatedOrders;
    },
  });
};
