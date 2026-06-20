"use client";

import Input from "@/components/shared/ui/Input";
import { Button } from "@/components/shared/ui/CtaBtn";
import { useResetPassword } from "@/Hooks/user/useResetPassword";
import { ResetPasswordSchema, ResetPasswordType } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type Props = {
  token: string;
};

export default function ResetPasswordForm({ token }: Props) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResetPasswordType>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const { mutate, isPending } = useResetPassword();

  const onSubmit = (data: ResetPasswordType) => {
    if (!token) {
      toast.error("Reset token is missing");
      return;
    }

    mutate(
      { token, password: data.password },
      {
        onSuccess: () => {
          toast.success("Password reset successfully");
          reset();
          router.push("/auth/login");
        },
        onError: (error: unknown) => {
          const message = axios.isAxiosError(error)
            ? error.response?.data?.message || error.message
            : error instanceof Error
              ? error.message
              : "An error has occured";

          toast.error(Array.isArray(message) ? message.join(", ") : message);
        },
      },
    );
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-md border border-gray-200 rounded-2xl p-6 sm:p-8 text-center animate-fade-right">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Reset link invalid
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-gray-500">
            Please request a new password reset link.
          </p>
          <Link
            href="/auth/forgot-password"
            className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-[#0089d3] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#007bbd] sm:text-base"
          >
            Request new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md border border-gray-200 rounded-2xl p-6 sm:p-8 animate-fade-right">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 sm:gap-6"
        >
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              Reset password
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Choose a new password for your account
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Input
                register={register("password")}
                title="New Password"
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

            <div className="flex flex-col gap-1">
              <Input
                register={register("confirmPassword")}
                title="Confirm Password"
                placeholder="********"
                type="password"
                disabled={isPending}
              />
              {errors.confirmPassword && (
                <span className="text-red-500 text-xs sm:text-sm">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
          </div>

          <Button type="submit" isLoading={isPending}>
            Reset password
          </Button>

          <p className="text-center text-xs sm:text-sm text-gray-500">
            Back to{" "}
            <Link
              href="/auth/login"
              className="text-[#0089d3] cursor-pointer hover:underline"
            >
              sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
