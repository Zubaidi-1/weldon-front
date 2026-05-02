import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

//  match your backend DTO
export interface CreateUserDto {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
}

// API call function
const createUser = async (data: CreateUserDto) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}user/create-user`,
    data,
  );
  return response.data;
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: createUser,
  });
};
