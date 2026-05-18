"use client";

import { getApiUrl } from "@/config/api";
import { useAuth } from "@/Context/auth/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useApi } from "../api/useApi";
import type { GetMeResponse } from "./useGetMe";

const guestUser: GetMeResponse = {
  id: null,
  email: null,
  firstName: null,
  lastName: null,
  name: null,
  roleName: "GUEST",
  cartProductsCount: 0,
};

export const useLogout = () => {
  const api = useApi();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setAccessToken } = useAuth();

  return useMutation({
    mutationFn: async () => {
      return await api(getApiUrl("/auth/logout"), {
        method: "POST",
      });
    },
    onSettled: () => {
      setAccessToken(null);
      queryClient.setQueryData<GetMeResponse>(["get-me"], guestUser);
      router.push("/");
    },
  });
};
