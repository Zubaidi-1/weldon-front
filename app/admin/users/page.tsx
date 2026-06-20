"use client";

import ProductDashboardCard from "@/components/shared/dashboard/admin/products/ProductCards";
import { useBanUser } from "@/Hooks/user/useBanUser";
import { useGetAllUsers } from "@/Hooks/user/useGetAllUsers";
import { useDebounce } from "@/Hooks/useDebounce";
import Link from "next/link";
import { useMemo, useState } from "react";

type RoleFilter = "ALL" | "ADMIN" | "USER";
type BanFilter = "ALL" | "ACTIVE" | "BANNED";
type VerificationFilter = "ALL" | "VERIFIED" | "UNVERIFIED";

const roleFilters: RoleFilter[] = ["ALL", "ADMIN", "USER"];
const banFilters: BanFilter[] = ["ALL", "ACTIVE", "BANNED"];
const verificationFilters: VerificationFilter[] = [
  "ALL",
  "VERIFIED",
  "UNVERIFIED",
];
const limitOptions = [10, 25, 50];

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(value));

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery.trim(), 350);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
  const [banFilter, setBanFilter] = useState<BanFilter>("ALL");
  const [verificationFilter, setVerificationFilter] =
    useState<VerificationFilter>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, isError, isFetching } = useGetAllUsers({
    page: currentPage,
    limit,
    search: debouncedSearch,
    role: roleFilter === "ALL" ? undefined : roleFilter,
    banStatus: banFilter === "ALL" ? undefined : banFilter,
    verificationStatus:
      verificationFilter === "ALL" ? undefined : verificationFilter,
  });
  const toggleBan = useBanUser();

  const users = useMemo(() => data?.users ?? [], [data?.users]);
  const totalPages = Math.max(1, data?.totalPages ?? 1);
  const page = Math.min(data?.page ?? currentPage, totalPages);
  const stats = data?.stats ?? {
    totalUsers: 0,
    totalAdmins: 0,
    totalVerified: 0,
    totalBanned: 0,
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FBFD]">
        <p className="text-lg font-semibold text-[#64748B]">
          Loading users...
        </p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FBFD]">
        <p className="text-lg font-semibold text-[#DC2626]">
          Failed to load users
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FBFD] px-6 py-24">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8">
        <header className="flex flex-col gap-4 border-b border-[#D8EAF4] pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#0089D3]">Admin</p>
            <h1 className="mt-2 text-3xl font-bold text-[#0F172A]">Users</h1>
            <p className="mt-2 text-sm text-[#64748B]">
              Review registered accounts and manage access.
            </p>
          </div>

          <Link
            href="/admin"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-[#CBD5E1] bg-white px-4 text-sm font-bold text-[#475569] transition hover:bg-[#F8FBFD]"
          >
            Back to dashboard
          </Link>
        </header>

        <section className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <ProductDashboardCard
            title="Users"
            value={stats.totalUsers}
            badgeText="All"
            description="All registered customer and admin accounts."
            variant="blue"
          />
          <ProductDashboardCard
            title="Admins"
            value={stats.totalAdmins}
            badgeText="Roles"
            description="Users with admin dashboard access."
            variant="yellow"
          />
          <ProductDashboardCard
            title="Verified"
            value={stats.totalVerified}
            badgeText="Email"
            description="Accounts with completed email verification."
            variant="green"
          />
          <ProductDashboardCard
            title="Banned"
            value={stats.totalBanned}
            badgeText="Access"
            description="Accounts currently blocked from access."
            variant="red"
          />
        </section>

        <div className="grid gap-4 rounded-3xl border border-[#0089D3]/20 bg-white p-4 shadow-[0_8px_30px_rgba(0,137,211,0.08)] lg:grid-cols-[1fr_160px_160px_170px_auto]">
          <input
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search name, email, phone, role, or user id"
            className="h-11 rounded-xl border border-[#CBD5E1] bg-white px-4 text-sm font-semibold text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#0089D3] focus:ring-4 focus:ring-[#0089D3]/10"
          />
          <select
            value={roleFilter}
            onChange={(event) => {
              setRoleFilter(event.target.value as RoleFilter);
              setCurrentPage(1);
            }}
            className="h-11 rounded-xl border border-[#CBD5E1] bg-white px-3 text-sm font-bold text-[#475569] outline-none transition focus:border-[#0089D3] focus:ring-4 focus:ring-[#0089D3]/10"
          >
            {roleFilters.map((filter) => (
              <option key={filter} value={filter}>
                {filter === "ALL" ? "All roles" : filter}
              </option>
            ))}
          </select>
          <select
            value={banFilter}
            onChange={(event) => {
              setBanFilter(event.target.value as BanFilter);
              setCurrentPage(1);
            }}
            className="h-11 rounded-xl border border-[#CBD5E1] bg-white px-3 text-sm font-bold text-[#475569] outline-none transition focus:border-[#0089D3] focus:ring-4 focus:ring-[#0089D3]/10"
          >
            {banFilters.map((filter) => (
              <option key={filter} value={filter}>
                {filter === "ALL" ? "All access" : filter}
              </option>
            ))}
          </select>
          <select
            value={verificationFilter}
            onChange={(event) => {
              setVerificationFilter(event.target.value as VerificationFilter);
              setCurrentPage(1);
            }}
            className="h-11 rounded-xl border border-[#CBD5E1] bg-white px-3 text-sm font-bold text-[#475569] outline-none transition focus:border-[#0089D3] focus:ring-4 focus:ring-[#0089D3]/10"
          >
            {verificationFilters.map((filter) => (
              <option key={filter} value={filter}>
                {filter === "ALL" ? "All verification" : filter}
              </option>
            ))}
          </select>
          {(searchQuery ||
            roleFilter !== "ALL" ||
            banFilter !== "ALL" ||
            verificationFilter !== "ALL") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setRoleFilter("ALL");
                setBanFilter("ALL");
                setVerificationFilter("ALL");
                setCurrentPage(1);
              }}
              className="h-11 rounded-xl border border-[#CBD5E1] bg-white px-4 text-sm font-bold text-[#475569] transition hover:bg-[#F8FBFD]"
            >
              Clear
            </button>
          )}
        </div>

        <section className="w-full overflow-hidden rounded-3xl border border-[#0089D3]/20 bg-white shadow-[0_8px_30px_rgba(0,137,211,0.10)]">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-5">
            <div>
              <h2 className="text-xl font-bold text-[#0F172A]">All Users</h2>
              <p className="mt-1 text-sm text-[#64748B]">
                {data?.total ?? 0} matching users
              </p>
            </div>
            <select
              value={limit}
              onChange={(event) => {
                setLimit(Number(event.target.value));
                setCurrentPage(1);
              }}
              className="h-11 rounded-xl border border-[#CBD5E1] bg-white px-4 text-sm font-bold text-[#475569] outline-none transition focus:border-[#0089D3] focus:ring-4 focus:ring-[#0089D3]/10"
              aria-label="Users per page"
            >
              {limitOptions.map((option) => (
                <option key={option} value={option}>
                  {option} / page
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] border-collapse">
              <thead className="bg-[#F0F9FF]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#0089D3]">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#0089D3]">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#0089D3]">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#0089D3]">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#0089D3]">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#0089D3]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E2E8F0] bg-white">
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <h3 className="text-lg font-bold text-[#0F172A]">
                        No users found
                      </h3>
                      <p className="mt-2 text-sm text-[#64748B]">
                        Try changing the search or filters.
                      </p>
                    </td>
                  </tr>
                )}

                {users.map((user) => (
                  <tr key={user.id} className="transition hover:bg-[#F8FBFD]">
                    <td className="min-w-56 px-6 py-4 text-sm font-semibold text-[#0F172A]">
                      {user.name}
                      <span className="mt-1 block text-xs font-medium text-[#94A3B8]">
                        User #{user.id}
                      </span>
                    </td>
                    <td className="min-w-72 px-6 py-4 text-sm font-medium text-[#334155]">
                      {user.email}
                      <span className="mt-1 block text-xs font-medium text-[#64748B]">
                        {user.phoneNumber}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="rounded-full bg-[#E6F6FD] px-3 py-1 text-xs font-bold text-[#0089D3]">
                        {user.role}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            user.isVerified
                              ? "bg-[#DCFCE7] text-[#16A34A]"
                              : "bg-[#FEF3C7] text-[#D97706]"
                          }`}
                        >
                          {user.isVerified ? "VERIFIED" : "UNVERIFIED"}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            user.isBanned
                              ? "bg-[#FEE2E2] text-[#DC2626]"
                              : "bg-[#DCFCE7] text-[#16A34A]"
                          }`}
                        >
                          {user.isBanned ? "BANNED" : "ACTIVE"}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-[#334155]">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {user.role === "ADMIN" ? (
                        <span className="rounded-lg border border-[#CBD5E1] px-3 py-2 text-xs font-bold text-[#94A3B8]">
                          Protected
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={
                            toggleBan.isPending &&
                            toggleBan.variables === user.id
                          }
                          onClick={() => toggleBan.mutate(user.id)}
                          className={`h-9 rounded-lg border px-3 text-xs font-bold transition disabled:cursor-not-allowed disabled:border-[#CBD5E1] disabled:text-[#94A3B8] ${
                            user.isBanned
                              ? "border-[#16A34A]/20 text-[#16A34A] hover:bg-[#DCFCE7]"
                              : "border-[#DC2626]/20 text-[#DC2626] hover:bg-[#FEE2E2]"
                          }`}
                        >
                          {toggleBan.isPending &&
                          toggleBan.variables === user.id
                            ? "Updating..."
                            : user.isBanned
                              ? "Unban user"
                              : "Ban user"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="flex flex-col gap-3 rounded-2xl border border-[#D8EAF4] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)] sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-[#64748B]">
            Showing page {page} of {totalPages} - {data?.total ?? 0} matching
            users
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={page <= 1 || isFetching}
              onClick={() =>
                setCurrentPage((current) => Math.max(1, current - 1))
              }
              className="h-10 rounded-xl border border-[#CBD5E1] bg-white px-4 text-sm font-semibold text-[#475569] transition hover:bg-[#F8FBFD] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .filter(
                (pageNumber) =>
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  Math.abs(pageNumber - page) <= 1,
              )
              .map((pageNumber, index, pages) => {
                const previousPage = pages[index - 1];
                const showGap = previousPage && pageNumber - previousPage > 1;

                return (
                  <span key={pageNumber} className="flex items-center gap-2">
                    {showGap ? (
                      <span className="px-1 text-sm font-bold text-[#94A3B8]">
                        ...
                      </span>
                    ) : null}
                    <button
                      type="button"
                      disabled={isFetching}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`h-10 w-10 rounded-xl text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                        page === pageNumber
                          ? "bg-[#0089D3] text-white"
                          : "border border-[#CBD5E1] bg-white text-[#475569] hover:bg-[#F8FBFD]"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  </span>
                );
              })}
            <button
              type="button"
              disabled={page >= totalPages || isFetching}
              onClick={() =>
                setCurrentPage((current) => Math.min(totalPages, current + 1))
              }
              className="h-10 rounded-xl border border-[#CBD5E1] bg-white px-4 text-sm font-semibold text-[#475569] transition hover:bg-[#F8FBFD] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
