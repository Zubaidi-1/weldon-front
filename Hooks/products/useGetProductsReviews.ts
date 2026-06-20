"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useApi } from "../api/useApi";
import { getApiUrl } from "@/config/api";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";

export type ProductReview = {
  reviewId: number;
  review: string;
  stars: number;
  is_Verified_review: boolean;
  user: {
    id: number;
    name: string | null;
    firstName: string | null;
    lastName: string | null;
  };
};

export type ProductReviewsResponse = {
  averageRating: number;
  ratingsCount: number;
  verifiedReviewsCount: number;
  page: number;
  limit: number;
  hasMore: boolean;
  reviews: ProductReview[];
};

type CreateReviewInput = {
  productId: number;
  review: string;
  stars: number;
};

export const productReviewsQueryKey = (productId: number) => [
  "productReviews",
  productId,
];

export const useGetProductReviews = (productId: number) => {
  const api = useApi();

  return useInfiniteQuery<ProductReviewsResponse>({
    queryKey: productReviewsQueryKey(productId),
    enabled: Number.isFinite(productId) && productId > 0,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const page = Number(pageParam);
      const response = await api(
        getApiUrl(`/reviews/review/${productId}?page=${page}&limit=20`),
      );

      return response as ProductReviewsResponse;
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });
};

export const useCreateProductReview = (productId: number) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateReviewInput) => {
      const response = await api(getApiUrl("/reviews"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      return response as ProductReview;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productReviewsQueryKey(productId),
      });
      toast.success("Review submitted");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Could not submit review"));
    },
  });
};
