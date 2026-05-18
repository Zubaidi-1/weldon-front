"use client";

import { getApiUrl } from "@/config/api";
import { useApi } from "@/Hooks/api/useApi";
import { useGetMe } from "@/Hooks/user/useGetMe";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";

export type UserProfile = {
  id: number | null;
  userId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  governate: string;
  address: string;
};

export type UserProfileInput = Omit<UserProfile, "id" | "userId">;

type ProfileContextType = {
  profile: UserProfile | null;
  isLoading: boolean;
  saveProfile: (profile: UserProfileInput) => Promise<UserProfile>;
  isSaving: boolean;
};

const ProfileContext = createContext<ProfileContextType | null>(null);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { data: user } = useGetMe();
  const isSignedIn = Boolean(user?.id);

  const profileQuery = useQuery<UserProfile | null>({
    queryKey: ["user-profile"],
    enabled: isSignedIn,
    queryFn: async () => {
      const response = await api(getApiUrl("/user/profile"));

      return response as UserProfile;
    },
  });

  const saveProfileMutation = useMutation({
    mutationFn: async (profile: UserProfileInput) => {
      const response = await api(getApiUrl("/user/profile"), {
        method: "PUT",
        body: JSON.stringify(profile),
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response as UserProfile;
    },
    onSuccess: (profile) => {
      queryClient.setQueryData(["user-profile"], profile);
      toast.success("Profile saved");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Could not save profile"));
    },
  });

  return (
    <ProfileContext.Provider
      value={{
        profile: profileQuery.data ?? null,
        isLoading: isSignedIn ? profileQuery.isLoading : false,
        saveProfile: saveProfileMutation.mutateAsync,
        isSaving: saveProfileMutation.isPending,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error("useProfile must be used inside ProfileProvider");
  }

  return context;
};
