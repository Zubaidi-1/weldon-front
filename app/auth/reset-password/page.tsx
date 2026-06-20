import ResetPasswordForm from "./ResetPasswordForm";

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const tokenParam = (await searchParams).token;
  const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam;

  return <ResetPasswordForm token={token ?? ""} />;
}
