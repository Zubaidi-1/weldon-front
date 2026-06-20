import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export interface ForgotPasswordDto {
  email: string;
}

const sendForgotPasswordEmail = async (data: ForgotPasswordDto) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}auth/forgot-password-email`,
    data,
  );
  return response.data as { message?: string } | undefined;
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: sendForgotPasswordEmail,
  });
};
