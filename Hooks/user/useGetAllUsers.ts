"use client";

import { getApiUrl } from "@/config/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useApi } from "../api/useApi";

export type AdminUser = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  phoneNumber: string;
  role: string;
  isVerified: boolean;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedUsers = {
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats: {
    totalUsers: number;
    totalAdmins: number;
    totalVerified: number;
    totalBanned: number;
  };
};

type UseGetAllUsersParams = {
  page?: number;
  limit?: number;
  search?: string;
  role?: "ADMIN" | "USER";
  banStatus?: "ACTIVE" | "BANNED";
  verificationStatus?: "VERIFIED" | "UNVERIFIED";
};

export const useGetAllUsers = (params: UseGetAllUsersParams = {}) => {
  const api = useApi();
  const queryParams = {
    page: params.page ?? 1,
    limit: params.limit ?? 10,
    search: params.search?.trim(),
    role: params.role,
    banStatus: params.banStatus,
    verificationStatus: params.verificationStatus,
  };

  return useQuery({
    queryKey: ["all-users", queryParams],
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        page: String(queryParams.page),
        limit: String(queryParams.limit),
      });

      if (queryParams.search) searchParams.set("search", queryParams.search);
      if (queryParams.role) searchParams.set("role", queryParams.role);
      if (queryParams.banStatus) {
        searchParams.set("banStatus", queryParams.banStatus);
      }
      if (queryParams.verificationStatus) {
        searchParams.set(
          "verificationStatus",
          queryParams.verificationStatus,
        );
      }

      const response = await api(getApiUrl(`/user/all-users?${searchParams}`));

      return response as PaginatedUsers;
    },
  });
};
