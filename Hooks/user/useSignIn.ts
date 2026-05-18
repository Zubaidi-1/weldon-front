import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export interface SigninUserDto {
  email: string;
  password: string;
}

export type SigninResponse = {
  accessToken: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    name: string;
    roleName: string;
    cartProductsCount: number;
  };
};

// API call function
const signinUser = async (data: SigninUserDto) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}auth/signin`,
    data,
    {
      withCredentials: true,
    },
  );
  return response.data as SigninResponse;
};

export const useSigninUser = () => {
  return useMutation({
    mutationFn: signinUser,
  });
};
