"use client";
import { useAuth } from "@/Context/auth/authContext";
import { getApiUrl } from "@/config/api";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "../api/useApi";

export type GetMeResponse = {
  id: number | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  name: string | null;
  roleName: "GUEST" | "USER" | "ADMIN" | string;
  isBanned: boolean;
  cartProductsCount: number;
};

type UseGetMeOptions = {
  enabled?: boolean;
};

export const useGetMe = (options?: UseGetMeOptions) => {
  const api = useApi();
  const { isReady } = useAuth();

  return useQuery<GetMeResponse>({
    queryKey: ["get-me"],
    enabled: options?.enabled ?? isReady,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,

    queryFn: async () => {
      try {
        const response = await api(getApiUrl("/user/me"));

        return response as GetMeResponse;
      } catch (error) {
        console.log(error, "ERROR");
        throw error;
      }
    },
  });
};
