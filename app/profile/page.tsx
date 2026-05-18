"use client";

import InputError from "@/components/shared/ui/InputError";
import { useProfile } from "@/Context/profile/profileContext";
import { useGetMe } from "@/Hooks/user/useGetMe";
import { ProfileSchema, type ProfileType } from "@/schemas/profile.schema";
import { jordanGovernates } from "@/lib/options/jordanGovernates";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const emptyProfile: ProfileType = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  governate: "",
  address: "",
};

export default function ProfilePage() {
  const { data: user } = useGetMe();
  const { profile, isLoading, saveProfile, isSaving } = useProfile();
  const isSignedIn = Boolean(user?.id);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileType>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: emptyProfile,
  });

  useEffect(() => {
    if (!profile) return;

    reset({
      firstName: profile.firstName,
      lastName: profile.lastName,
      phoneNumber: profile.phoneNumber,
      governate: profile.governate,
      address: profile.address,
    });
  }, [profile, reset]);

  const onSubmit = async (data: ProfileType) => {
    await saveProfile(data);
  };

  if (!isSignedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FBFD] px-4 py-24">
        <section className="w-full max-w-md rounded-2xl border border-[#D8EAF4] bg-white p-6 text-center shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
          <h1 className="text-2xl font-bold text-[#0F172A]">Profile</h1>
          <p className="mt-3 text-sm font-semibold text-[#64748B]">
            Sign in to manage your delivery information.
          </p>
          <Link
            href="/auth/login"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[#0089D3] px-6 text-sm font-bold text-white transition hover:bg-[#007BBE]"
          >
            Sign in
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FBFD] px-4 py-24 sm:px-6 lg:px-8 ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto flex w-full max-w-2xl flex-col gap-5 rounded-2xl border border-[#D8EAF4] bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.08)]"
      >
        <header className="border-b border-[#E2E8F0] pb-5">
          <p className="text-sm font-semibold text-[#0089D3]">Account</p>
          <h1 className="mt-2 text-3xl font-bold text-[#0F172A]">Profile</h1>
        </header>

        {isLoading ? (
          <p className="text-sm font-semibold text-[#64748B]">
            Loading profile...
          </p>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <input
                  {...register("firstName")}
                  placeholder="First name"
                  className="h-11 w-full rounded-lg border border-[#CBD5E1] px-3 text-sm font-semibold text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#0089D3] focus:ring-4 focus:ring-[#0089D3]/10"
                />
                {errors.firstName?.message && (
                  <InputError errorMessage={errors.firstName.message} />
                )}
              </div>
              <div>
                <input
                  {...register("lastName")}
                  placeholder="Last name"
                  className="h-11 w-full rounded-lg border border-[#CBD5E1] px-3 text-sm font-semibold text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#0089D3] focus:ring-4 focus:ring-[#0089D3]/10"
                />
                {errors.lastName?.message && (
                  <InputError errorMessage={errors.lastName.message} />
                )}
              </div>
            </div>

            <div>
              <input
                {...register("phoneNumber")}
                placeholder="Phone number"
                className="h-11 w-full rounded-lg border border-[#CBD5E1] px-3 text-sm font-semibold text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#0089D3] focus:ring-4 focus:ring-[#0089D3]/10"
              />
              {errors.phoneNumber?.message && (
                <InputError errorMessage={errors.phoneNumber.message} />
              )}
            </div>

            <div>
              <select
                {...register("governate")}
                className="h-11 w-full rounded-lg border border-[#CBD5E1] px-3 text-sm font-semibold text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#0089D3] focus:ring-4 focus:ring-[#0089D3]/10"
              >
                <option value="">Select governate</option>
                {jordanGovernates.map((governate) => (
                  <option key={governate} value={governate}>
                    {governate}
                  </option>
                ))}
              </select>
              {errors.governate?.message && (
                <InputError errorMessage={errors.governate.message} />
              )}
            </div>

            <div>
              <textarea
                {...register("address")}
                placeholder="Delivery address"
                className="min-h-28 w-full resize-none rounded-lg border border-[#CBD5E1] px-3 py-3 text-sm font-semibold text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#0089D3] focus:ring-4 focus:ring-[#0089D3]/10"
              />
              {errors.address?.message && (
                <InputError errorMessage={errors.address.message} />
              )}
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#0089D3] text-sm font-bold text-white shadow-[0_12px_24px_rgba(0,137,211,0.22)] transition hover:bg-[#007BBE] disabled:cursor-not-allowed disabled:bg-[#94A3B8]"
            >
              {isSaving ? "Saving..." : "Save profile"}
            </button>
          </>
        )}
      </form>
    </main>
  );
}
