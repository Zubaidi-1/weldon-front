"use client";

import Input from "@/components/shared/ui/Input";
import { useCreateUser } from "@/Hooks/user/useCreateUser";
import { RegisterSchema, RegisterType } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/shared/ui/CtaBtn";
import axios from "axios";

export default function Register() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterType>({
    resolver: zodResolver(RegisterSchema),
  });

  const { mutate, isPending } = useCreateUser();

  const onSubmit = (data: RegisterType) => {
    const payload = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      password: data.password,
    };

    mutate(payload, {
      onSuccess: () => {
        console.log("User created successfully");

        reset();

        router.push("/auth/register/verify");
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
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              Create Account
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Sign up to get started
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

            {/* Name */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <Input
                  title="First Name"
                  placeholder="John"
                  register={register("firstName")}
                  disabled={isPending}
                />
                {errors.firstName && (
                  <span className="text-red-500 text-xs sm:text-sm">
                    {errors.firstName.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <Input
                  title="Last Name"
                  placeholder="Doe"
                  register={register("lastName")}
                  disabled={isPending}
                />
                {errors.lastName && (
                  <span className="text-red-500 text-xs sm:text-sm">
                    {errors.lastName.message}
                  </span>
                )}
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1">
              <Input
                register={register("phoneNumber")}
                title="Phone Number"
                placeholder="+962790000000"
                type="tel"
                disabled={isPending}
              />
              {errors.phoneNumber && (
                <span className="text-red-500 text-xs sm:text-sm">
                  {errors.phoneNumber.message}
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

            {/* Confirm Password */}
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

          {/* Submit */}
          <Button type="submit" isLoading={isPending}>
            Register
          </Button>

          {/* Footer */}
          <p className="text-center text-xs sm:text-sm text-gray-500">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/auth/login")}
              className="text-[#0089d3] cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
