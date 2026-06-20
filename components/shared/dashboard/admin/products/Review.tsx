"use client";

import { useAuth } from "@/Context/auth/authContext";
import {
  useCreateProductReview,
  useGetProductReviews,
  type ProductReview,
} from "@/Hooks/products/useGetProductsReviews";
import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";

type Props = {
  productId: number;
};

const getReviewerName = (review: ProductReview) => {
  const fullName = [review.user.firstName, review.user.lastName]
    .filter(Boolean)
    .join(" ");

  return review.user.name || fullName || "Customer";
};

const Stars = ({
  value,
  size = "text-lg",
  interactive = false,
  onChange,
}: {
  value: number;
  size?: string;
  interactive?: boolean;
  onChange?: (value: number) => void;
}) => (
  <div className="flex items-center gap-0.5" aria-label={`${value} out of 5`}>
    {[1, 2, 3, 4, 5].map((star) => {
      const isFilled = star <= Math.round(value);
      const className = `${size} leading-none transition ${
        isFilled ? "text-[#F59E0B]" : "text-[#CBD5E1]"
      }`;

      if (interactive) {
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange?.(star)}
            className={`${className} hover:text-[#F59E0B]`}
            aria-label={`Rate ${star} star${star === 1 ? "" : "s"}`}
          >
            ★
          </button>
        );
      }

      return (
        <span key={star} className={className}>
          ★
        </span>
      );
    })}
  </div>
);

export default function ReviewStars() {
  return null;
}

export function ProductReviews({ productId }: Props) {
  const { accessToken } = useAuth();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetProductReviews(productId);
  const { mutate: createReview, isPending } = useCreateProductReview(productId);
  const [isOpen, setIsOpen] = useState(false);
  const [stars, setStars] = useState(5);
  const [review, setReview] = useState("");

  const firstPage = data?.pages[0];
  const averageRating = firstPage?.averageRating ?? 0;
  const ratingsCount = firstPage?.ratingsCount ?? 0;
  const verifiedReviewsCount = firstPage?.verifiedReviewsCount ?? 0;
  const reviews = useMemo(
    () => data?.pages.flatMap((page) => page.reviews) ?? [],
    [data?.pages],
  );

  const submitReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedReview = review.trim();
    if (!trimmedReview) return;

    createReview(
      { productId, review: trimmedReview, stars },
      {
        onSuccess: () => {
          setReview("");
          setStars(5);
        },
      },
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-5 flex w-fit items-center gap-3 rounded-lg border border-[#D8EAF4] bg-[#F8FBFD] px-4 py-3 text-left transition hover:border-[#0089D3]/50 hover:bg-[#F0F9FF] max-lg:mx-auto"
      >
        <Stars value={averageRating} />
        <span className="text-sm font-bold text-[#0F172A]">
          {isLoading ? "Loading reviews..." : averageRating.toFixed(1)}
        </span>
        <span className="text-sm font-semibold text-[#64748B]">
          ({ratingsCount} {ratingsCount === 1 ? "rating" : "ratings"})
        </span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#F8FBFD]/90 px-4 py-8 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-[#D8EAF4] bg-[#F8FBFD] shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
            <div className="flex items-start justify-between gap-4 border-b border-[#E2E8F0] bg-white p-5 sm:p-6">
              <div>
                <h2 className="text-2xl font-bold text-[#0F172A]">
                  Product reviews
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <Stars value={averageRating} />
                  <span className="text-sm font-semibold text-[#64748B]">
                    {averageRating.toFixed(1)} from {ratingsCount}{" "}
                    {ratingsCount === 1 ? "rating" : "ratings"}
                  </span>
                  {verifiedReviewsCount > 0 && (
                    <span className="rounded-full bg-[#EAF8F0] px-3 py-1 text-xs font-bold text-[#15803D]">
                      {verifiedReviewsCount} verified
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#CBD5E1] text-xl font-semibold text-[#475569] transition hover:bg-[#F8FBFD]"
                aria-label="Close reviews"
              >
                ×
              </button>
            </div>

            <div className="p-5 sm:p-6">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-[#334155]">
                  Showing {reviews.length} of {ratingsCount}
                </p>
                {hasNextPage && (
                  <button
                    type="button"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="rounded-lg border border-[#B8DDEE] bg-white px-3 py-2 text-xs font-bold text-[#0089D3] transition hover:bg-[#F0F9FF] disabled:cursor-not-allowed disabled:text-[#94A3B8]"
                  >
                    {isFetchingNextPage ? "Loading..." : "Load more"}
                  </button>
                )}
              </div>

              <div className="max-h-[32vh] space-y-3 overflow-y-auto pr-1">
                {reviews.length > 0 ? (
                  reviews.map((item) => (
                    <article
                      key={item.reviewId}
                      className="rounded-lg border border-[#E2E8F0] bg-white p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-bold text-[#0F172A]">
                              {getReviewerName(item)}
                            </p>
                            {item.is_Verified_review && (
                              <span className="rounded-full bg-[#EAF8F0] px-2.5 py-1 text-xs font-bold text-[#15803D]">
                                Verified review
                              </span>
                            )}
                          </div>
                          {item.is_Verified_review && (
                            <p className="mt-1 text-xs font-semibold text-[#64748B]">
                              Purchased before reviewing
                            </p>
                          )}
                        </div>
                        <Stars value={item.stars} size="text-base" />
                      </div>
                      <p className="mt-3 text-sm leading-6 text-[#475569]">
                        {item.review}
                      </p>
                    </article>
                  ))
                ) : (
                  <p className="rounded-xl border border-dashed border-[#CBD5E1] p-5 text-sm font-semibold text-[#64748B]">
                    No reviews yet.
                  </p>
                )}
              </div>

              <div className="mt-6 border-t border-[#E2E8F0] bg-[#F8FBFD] pt-6">
                {accessToken ? (
                  <form onSubmit={submitReview} className="space-y-4">
                    <div>
                      <p className="mb-2 text-sm font-bold text-[#334155]">
                        Your rating
                      </p>
                      <Stars
                        value={stars}
                        interactive
                        onChange={setStars}
                        size="text-2xl"
                      />
                    </div>

                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-[#334155]">
                        Your review
                      </span>
                      <textarea
                        value={review}
                        onChange={(event) => setReview(event.target.value)}
                        maxLength={100}
                        rows={4}
                        className="w-full resize-none rounded-xl border border-[#CBD5E1] px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-[#0089D3] focus:ring-2 focus:ring-[#0089D3]/15"
                        placeholder="Share what you think about this product"
                        required
                      />
                    </label>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs font-semibold text-[#94A3B8]">
                        {review.length}/100
                      </p>
                      <button
                        type="submit"
                        disabled={isPending || !review.trim()}
                        className="inline-flex h-11 items-center justify-center rounded-lg bg-[#0089D3] px-5 text-sm font-bold text-white transition hover:bg-[#007BBE] disabled:cursor-not-allowed disabled:bg-[#94A3B8]"
                      >
                        {isPending ? "Submitting..." : "Submit review"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="rounded-xl bg-[#F8FBFD] p-5">
                    <p className="text-sm font-semibold text-[#475569]">
                      Log in to submit a review for this product.
                    </p>
                    <Link
                      href={`/auth/login?redirectTo=/store/${productId}`}
                      className="mt-3 inline-flex h-10 items-center justify-center rounded-lg bg-[#0089D3] px-4 text-sm font-bold text-white transition hover:bg-[#007BBE]"
                    >
                      Log in
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
