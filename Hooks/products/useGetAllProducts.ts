"use client";
import { Product } from "@/lib/types/ProductTypes";
import { getApiUrl } from "@/config/api";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "../api/useApi";

export const useGetAllProducts = () => {
  const api = useApi();

  return useQuery({
    queryKey: ["all-products"],

    queryFn: async () => {
      try {
        console.log("QUERY RUNNING");

        const response = await api(getApiUrl("/product/all-products"));

        return response as Product[];
      } catch (error) {
        console.log(error, "ERROR");
        throw error;
      }
    },
  });
};
