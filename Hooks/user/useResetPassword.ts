import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export interface ResetPasswordDto {
  token: string;
  password: string;
}

const resetPassword = async ({ token, password }: ResetPasswordDto) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}auth/forgot-password?token=${encodeURIComponent(token)}`,
    { password },
  );
  return response.data as { message?: string };
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
  });
};
