"use client";

import Input from "@/components/shared/ui/Input";
import { Button } from "@/components/shared/ui/CtaBtn";
import { useForgotPassword } from "@/Hooks/user/useForgotPassword";
import {
  ForgotPasswordSchema,
  ForgotPasswordType,
} from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordType>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const { mutate, isPending, isSuccess } = useForgotPassword();

  const onSubmit = (data: ForgotPasswordType) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Reset link sent to your email");
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
      <div className="w-full max-w-md border border-gray-200 rounded-2xl p-6 sm:p-8 animate-fade-right">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 sm:gap-6"
        >
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              Forgot password
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Enter your email to receive a reset link
            </p>
          </div>

          {isSuccess && (
            <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-[#0089d3]">
              If an account exists for that email, check your inbox for the
              reset link.
            </div>
          )}

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

          <Button type="submit" isLoading={isPending}>
            Send reset link
          </Button>

          <p className="text-center text-xs sm:text-sm text-gray-500">
            Remember your password?{" "}
            <Link
              href="/auth/login"
              className="text-[#0089d3] cursor-pointer hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
