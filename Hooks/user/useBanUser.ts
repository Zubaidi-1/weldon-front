"use client";

import { getApiUrl } from "@/config/api";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useApi } from "../api/useApi";

export const useBanUser = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: number) => {
      const response = await api(getApiUrl(`/user/ban-user/${userId}`));

      return response as boolean;
    },
    onSuccess: (isBanned) => {
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
      toast.success(isBanned ? "User banned" : "User unbanned");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Could not ban user"));
    },
  });
};
