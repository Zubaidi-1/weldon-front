"use client";

import Input from "@/components/shared/ui/Input";

import { Button } from "@/components/shared/ui/CtaBtn";
import { useForm } from "react-hook-form";
import { SignInSchema, SigninType } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Login() {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninType>({
    resolver: zodResolver(SignInSchema),
  });

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md border border-gray-200 rounded-2xl p-6 sm:p-8">
        <form className="flex flex-col gap-5 sm:gap-6">
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
                disabled
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
                disabled
              />
              {errors.password && (
                <span className="text-red-500 text-xs sm:text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>
          </div>

          {/* Submit */}
          <Button type="submit">
            {/* isLoading={isPending} */}
            Sign in
          </Button>

          {/* Footer */}
          <p className="text-center text-xs sm:text-sm text-gray-500">
            Don't have an account?{" "}
            <span
              //   onClick={() => router.push("/auth/login")}
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
