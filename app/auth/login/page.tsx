"use client";

import Input from "@/components/shared/ui/Input";

import { Button } from "@/components/shared/ui/CtaBtn";
import { useForm } from "react-hook-form";
import { SignInSchema, SigninType } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSigninUser } from "@/Hooks/user/useSignIn";
import type { GetMeResponse } from "@/Hooks/user/useGetMe";
import toast from "react-hot-toast";
import { redirect, useRouter } from "next/navigation";
import { useAuth } from "@/Context/auth/authContext";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function Login() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setAccessToken } = useAuth();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninType>({
    resolver: zodResolver(SignInSchema),
  });

  // login
  const { mutate, isPending } = useSigninUser();
  const onSubmit = (data: SigninType) => {
    const payload = {
      email: data.email,
      password: data.password,
    };

    mutate(payload, {
      onSuccess: async (response) => {
        setAccessToken(response.accessToken);
        queryClient.setQueryData<GetMeResponse>(["get-me"], response.user);
        toast.success("signed in successfully");
        redirect("/store");
        reset();
      },
      onError: (error: unknown) => {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : error instanceof Error
            ? error.message
            : "An error has occured";

        toast.error(Array.isArray(message) ? message.join(", ") : message);
      },
    });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md border border-gray-200 rounded-2xl p-6 sm:p-8  animate-fade-right">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 sm:gap-6"
        >
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              Sign in
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Sign in to get started
            </p>
          </div>

          {/* Inputs */}
          <div className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1">
              <Input
                register={register("email")}
                title="Email"
                placeholder="Johndoe@example.com"
                disabled={isPending}
              />
              {errors.email && (
                <span className="text-red-500 text-xs sm:text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <Input
                register={register("password")}
                title="Password"
                placeholder="********"
                type="password"
                disabled={isPending}
              />
              {errors.password && (
                <span className="text-red-500 text-xs sm:text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>
          </div>

          {/* Submit */}
          <Button type="submit" isLoading={isPending}>
            Sign in
          </Button>

          {/* Footer */}
          <p className="text-center text-xs sm:text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <span
              onClick={() => router.push("/auth/register")}
              className="text-[#0089d3] cursor-pointer hover:underline"
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
