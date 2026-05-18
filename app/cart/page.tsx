"use client";

import { getApiUrl, getAssetUrl } from "@/config/api";
import { type CartItem, type CartView, useCart } from "@/Hooks/cart/useCart";
import { useAuth } from "@/Context/auth/authContext";
import { useProfile } from "@/Context/profile/profileContext";
import type { GetMeResponse } from "@/Hooks/user/useGetMe";
import { useGetMe } from "@/Hooks/user/useGetMe";
import { useCreateOrder } from "@/Hooks/order/useCreateOrder";
import {
  clearGuestCart,
  updateGuestCartItemQuantity,
} from "@/lib/utils/guestCart";
import { CheckoutSchema, type CheckoutType } from "@/schemas/order.schema";
import { jordanGovernates } from "@/lib/options/jordanGovernates";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import InputError from "@/components/shared/ui/InputError";

type UpdateCartType = "INCREMENT" | "DECREMENT" | "REMOVE";

const initialCheckoutForm: CheckoutType = {
  orderEmail: "",
  orderPhoneNumber: "",
  orderFirstName: "",
  orderLastName: "",
  orderGovernate: "",
  orderAddress: "",
};

const buildCartWithTotals = (cart: CartView): CartView => {
  const items = cart.items.map((item) => ({
    ...item,
    linePrice: Number(item.price) * item.quantity,
  }));

  return {
    ...cart,
    items,
    noOfItems: items.reduce((total, item) => total + item.quantity, 0),
    totalPrice: items.reduce(
      (total, item) => total + Number(item.linePrice ?? 0),
      0,
    ),
  };
};

const updateCartItems = (
  items: CartItem[],
  productId: number,
  updateType: UpdateCartType,
) => {
  return items
    .map((item) => {
      if (item.productId !== productId) return item;

      if (updateType === "INCREMENT") {
        const maxQuantity = item.maxQuantity ?? Number.MAX_SAFE_INTEGER;

        return {
          ...item,
          quantity: Math.min(item.quantity + 1, maxQuantity),
        };
      }

      if (updateType === "DECREMENT") {
        return {
          ...item,
          quantity: item.quantity - 1,
        };
      }

      return {
        ...item,
        quantity: 0,
      };
    })
    .filter((item) => item.quantity > 0);
};

export default function CartPage() {
  const { cart, isLoading, isError, isSignedIn } = useCart();
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();
  const { profile } = useProfile();
  const { data: user } = useGetMe();
  const createOrder = useCreateOrder();
  const {
    register,
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutType>({
    resolver: zodResolver(CheckoutSchema),
    defaultValues: initialCheckoutForm,
  });
  const [isSyncingCart, setIsSyncingCart] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const isDirtyRef = useRef(false);
  const cartRef = useRef<CartView | null | undefined>(cart);
  const syncPromiseRef = useRef<Promise<void> | null>(null);
  const items = cart?.items ?? [];
  const isBusy = isCheckingOut || isSyncingCart || createOrder.isPending;

  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);

  useEffect(() => {
    if (!isSignedIn) return;

    setValue("orderEmail", user?.email ?? "", {
      shouldDirty: false,
      shouldValidate: false,
    });
  }, [isSignedIn, setValue, user?.email]);

  useEffect(() => {
    if (!profile) return;

    reset({
      orderEmail: user?.email ?? "",
      orderFirstName: profile.firstName,
      orderLastName: profile.lastName,
      orderPhoneNumber: profile.phoneNumber,
      orderGovernate: profile.governate,
      orderAddress: profile.address,
    });
  }, [profile, reset, user?.email]);

  const syncCart = useCallback(
    async (options?: { keepalive?: boolean }) => {
      if (!isSignedIn || !isDirtyRef.current || !accessToken) return;
      if (syncPromiseRef.current) return await syncPromiseRef.current;

      const currentCart = cartRef.current;
      if (!currentCart) return;

      const syncPromise = (async () => {
        if (!options?.keepalive) setIsSyncingCart(true);

        const response = await fetch(getApiUrl("/cart/sync"), {
          method: "PATCH",
          body: JSON.stringify({
            items: currentCart.items
              .filter((item) => item.cartItemId)
              .map((item) => ({
                cartItemId: item.cartItemId,
                productId: item.productId,
                quantity: item.quantity,
              })),
          }),
          keepalive: options?.keepalive,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Could not sync cart");
        }

        isDirtyRef.current = false;
      })();

      syncPromiseRef.current = syncPromise;

      try {
        await syncPromise;
      } finally {
        syncPromiseRef.current = null;
        if (!options?.keepalive) setIsSyncingCart(false);
      }
    },
    [accessToken, isSignedIn],
  );

  const syncCartForCheckout = async (currentCart: CartView) => {
    if (!isSignedIn || !accessToken) return;

    setIsSyncingCart(true);

    try {
      const response = await fetch(getApiUrl("/cart/sync"), {
        method: "PATCH",
        body: JSON.stringify({
          items: currentCart.items
            .filter((item) => item.cartItemId)
            .map((item) => ({
              cartItemId: item.cartItemId,
              productId: item.productId,
              quantity: item.quantity,
            })),
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Could not sync cart before checkout");
      }

      isDirtyRef.current = false;
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["get-me"] });
    } finally {
      setIsSyncingCart(false);
    }
  };

  useEffect(() => {
    if (!isSignedIn || !isDirtyRef.current) return;

    const timeoutId = window.setTimeout(() => {
      syncCart().catch(() => {
        isDirtyRef.current = true;
      });
    }, 600);

    return () => window.clearTimeout(timeoutId);
  }, [cart, isSignedIn, syncCart]);

  useEffect(() => {
    if (!isSignedIn) return;

    const syncCartBeforeLeaving = () => {
      syncCart({ keepalive: true }).catch(() => {
        isDirtyRef.current = true;
      });
    };

    const syncCartWhenHidden = () => {
      if (document.visibilityState === "hidden") {
        syncCartBeforeLeaving();
      }
    };

    window.addEventListener("pagehide", syncCartBeforeLeaving);
    window.addEventListener("beforeunload", syncCartBeforeLeaving);
    document.addEventListener("visibilitychange", syncCartWhenHidden);

    return () => {
      syncCartBeforeLeaving();
      window.removeEventListener("pagehide", syncCartBeforeLeaving);
      window.removeEventListener("beforeunload", syncCartBeforeLeaving);
      document.removeEventListener("visibilitychange", syncCartWhenHidden);
    };
  }, [isSignedIn, syncCart]);

  const handleUpdateCart = (
    updateType: UpdateCartType,
    item: (typeof items)[number],
  ) => {
    if (!isSignedIn) {
      updateGuestCartItemQuantity(item.productId, updateType);
      return;
    }

    isDirtyRef.current = true;

    queryClient.setQueryData<CartView | null>(["cart"], (currentCart) => {
      if (!currentCart) return currentCart;

      const nextCart = buildCartWithTotals({
        ...currentCart,
        items: updateCartItems(currentCart.items, item.productId, updateType),
      });

      cartRef.current = nextCart;

      return nextCart;
    });

    queryClient.setQueryData<GetMeResponse>(["get-me"], (currentUser) => {
      if (!currentUser) return currentUser;

      const nextCount =
        updateType === "INCREMENT"
          ? currentUser.cartProductsCount + 1
          : Math.max(0, currentUser.cartProductsCount - item.quantity);

      if (updateType === "DECREMENT") {
        return {
          ...currentUser,
          cartProductsCount: Math.max(0, currentUser.cartProductsCount - 1),
        };
      }

      return {
        ...currentUser,
        cartProductsCount: nextCount,
      };
    });
  };

  const onCheckout = async (checkoutForm: CheckoutType) => {
    if (isBusy) return;

    if (!cart || cart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsCheckingOut(true);

    try {
      await syncCartForCheckout(cart);

      await createOrder.mutateAsync(
        {
          ...checkoutForm,
          products: isSignedIn
            ? undefined
            : cart.items.map((item) => ({
                productId: item.productId,
                productName: item.productName,
                productImage: item.productImage,
                productPrice: Number(item.price),
                quantity: item.quantity,
                size: item.productSize,
              })),
        },
        {
          onSuccess: () => {
            if (!isSignedIn) {
              clearGuestCart();
              reset(initialCheckoutForm);
              return;
            }

            reset({
              ...checkoutForm,
              orderEmail: user?.email ?? checkoutForm.orderEmail,
            });
          },
        },
      );
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FBFD] px-4 py-24">
        <p className="text-lg font-semibold text-[#64748B]">Loading cart...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FBFD] px-4 py-24">
        <p className="text-lg font-semibold text-[#DC2626]">
          Failed to load cart
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FBFD] px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-7">
        <header className="flex flex-col gap-3 border-b border-[#D8EAF4] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#0089D3]">Cart</p>
            <h1 className="mt-2 text-3xl font-bold text-[#0F172A]">
              Shopping Cart
            </h1>
          </div>

          <p className="text-sm font-semibold text-[#64748B]">
            {cart?.noOfItems ?? 0}{" "}
            {(cart?.noOfItems ?? 0) === 1 ? "item" : "items"}
          </p>
        </header>

        {items.length === 0 ? (
          <section className="flex min-h-96 flex-col items-center justify-center rounded-2xl border border-dashed border-[#BFDCEB] bg-white p-8 text-center">
            <h2 className="text-2xl font-bold text-[#0F172A]">
              Your cart is empty
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#64748B]">
              Browse the store and add your favorite products here.
            </p>
            <Link
              href="/store"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[#0089D3] px-6 text-sm font-bold text-white transition hover:bg-[#007BBE]"
            >
              Continue shopping
            </Link>
          </section>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            <section className="flex flex-col gap-4">
              {items.map((item) => (
                <article
                  key={`${item.productId}-${item.cartItemId ?? "guest"}`}
                  className="grid gap-4 rounded-2xl border border-[#D8EAF4] bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.06)] sm:grid-cols-[120px_1fr_auto]"
                >
                  <div className="flex h-32 items-center justify-center rounded-xl bg-[#EEF7FB] p-3">
                    {item.productImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={getAssetUrl(item.productImage)}
                        alt={item.productName}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="text-xs font-semibold text-[#94A3B8]">
                        No image
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col justify-center">
                    <h2 className="text-lg font-bold text-[#0F172A]">
                      {item.productName}
                    </h2>
                    <p className="mt-2 text-sm font-semibold text-[#64748B]">
                      Size: {item.productSize}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <div className="flex h-10 overflow-hidden rounded-lg border border-[#CBD5E1] bg-white">
                        <button
                          type="button"
                          onClick={() => handleUpdateCart("DECREMENT", item)}
                          disabled={isCheckingOut || createOrder.isPending}
                          className="flex w-10 items-center justify-center text-lg font-semibold text-[#0089D3] transition hover:bg-[#E6F6FD] disabled:cursor-not-allowed disabled:text-[#CBD5E1]"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="flex w-12 items-center justify-center border-x border-[#CBD5E1] text-sm font-bold text-[#0F172A]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          disabled={
                            isCheckingOut ||
                            createOrder.isPending ||
                            Boolean(
                              item.maxQuantity &&
                                item.quantity >= item.maxQuantity,
                            )
                          }
                          onClick={() => handleUpdateCart("INCREMENT", item)}
                          className="flex w-10 items-center justify-center text-lg font-semibold text-[#0089D3] transition hover:bg-[#E6F6FD] disabled:cursor-not-allowed disabled:text-[#CBD5E1]"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleUpdateCart("REMOVE", item)}
                        disabled={isCheckingOut || createOrder.isPending}
                        className="text-sm font-bold text-red-600 transition hover:text-red-700 disabled:cursor-not-allowed disabled:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center">
                    <p className="text-sm font-semibold text-[#94A3B8]">
                      ${Number(item.price).toFixed(2)} each
                    </p>
                    <p className="text-xl font-extrabold text-[#0089D3]">
                      $
                      {Number(
                        item.linePrice ?? item.price * item.quantity,
                      ).toFixed(2)}
                    </p>
                  </div>
                </article>
              ))}
            </section>

            <form
              onSubmit={handleSubmit(onCheckout)}
              className="h-fit rounded-2xl border border-[#D8EAF4] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.08)]"
            >
              <h2 className="text-xl font-bold text-[#0F172A]">Summary</h2>
              <div className="mt-5 flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                <span className="text-sm font-semibold text-[#64748B]">
                  Items
                </span>
                <span className="text-sm font-bold text-[#0F172A]">
                  {cart?.noOfItems ?? 0}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-base font-bold text-[#0F172A]">
                  Total
                </span>
                <span className="text-2xl font-extrabold text-[#0089D3]">
                  ${Number(cart?.totalPrice ?? 0).toFixed(2)}
                </span>
              </div>

              <div className="mt-5 flex flex-col gap-3">
                <div>
                  {isSignedIn ? (
                    <>
                      <input type="hidden" {...register("orderEmail")} />
                      <input
                        value={user?.email ?? ""}
                        placeholder="Email"
                        disabled
                        className="h-11 w-full cursor-not-allowed rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3 text-sm font-semibold text-[#64748B] outline-none"
                      />
                    </>
                  ) : (
                    <input
                      {...register("orderEmail")}
                      placeholder="Email"
                      className="h-11 w-full rounded-lg border border-[#CBD5E1] px-3 text-sm font-semibold text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#0089D3] focus:ring-4 focus:ring-[#0089D3]/10"
                    />
                  )}
                  {errors.orderEmail?.message && (
                    <InputError errorMessage={errors.orderEmail.message} />
                  )}
                </div>
                <div>
                  <input
                    {...register("orderFirstName")}
                    placeholder="First name"
                    className="h-11 w-full rounded-lg border border-[#CBD5E1] px-3 text-sm font-semibold text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#0089D3] focus:ring-4 focus:ring-[#0089D3]/10"
                  />
                  {errors.orderFirstName?.message && (
                    <InputError errorMessage={errors.orderFirstName.message} />
                  )}
                </div>
                <div>
                  <input
                    {...register("orderLastName")}
                    placeholder="Last name"
                    className="h-11 w-full rounded-lg border border-[#CBD5E1] px-3 text-sm font-semibold text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#0089D3] focus:ring-4 focus:ring-[#0089D3]/10"
                  />
                  {errors.orderLastName?.message && (
                    <InputError errorMessage={errors.orderLastName.message} />
                  )}
                </div>
                <div>
                  <input
                    {...register("orderPhoneNumber")}
                    placeholder="Phone number"
                    className="h-11 w-full rounded-lg border border-[#CBD5E1] px-3 text-sm font-semibold text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#0089D3] focus:ring-4 focus:ring-[#0089D3]/10"
                  />
                  {errors.orderPhoneNumber?.message && (
                    <InputError
                      errorMessage={errors.orderPhoneNumber.message}
                    />
                  )}
                </div>
                <div>
                  <select
                    {...register("orderGovernate")}
                    className="h-11 w-full rounded-lg border border-[#CBD5E1] px-3 text-sm font-semibold text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#0089D3] focus:ring-4 focus:ring-[#0089D3]/10"
                  >
                    <option value="">Select governate</option>
                    {jordanGovernates.map((governate) => (
                      <option key={governate} value={governate}>
                        {governate}
                      </option>
                    ))}
                  </select>
                  {errors.orderGovernate?.message && (
                    <InputError errorMessage={errors.orderGovernate.message} />
                  )}
                </div>
                <div>
                  <textarea
                    {...register("orderAddress")}
                    placeholder="Delivery address"
                    className="min-h-24 w-full resize-none rounded-lg border border-[#CBD5E1] px-3 py-3 text-sm font-semibold text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#0089D3] focus:ring-4 focus:ring-[#0089D3]/10"
                  />
                  {errors.orderAddress?.message && (
                    <InputError errorMessage={errors.orderAddress.message} />
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isBusy}
                className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#0089D3] text-sm font-bold text-white shadow-[0_12px_24px_rgba(0,137,211,0.22)] transition hover:bg-[#007BBE] disabled:cursor-not-allowed disabled:bg-[#94A3B8]"
              >
                {isCheckingOut || createOrder.isPending
                  ? "Placing order..."
                  : isSyncingCart
                    ? "Saving cart..."
                    : "Checkout"}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
