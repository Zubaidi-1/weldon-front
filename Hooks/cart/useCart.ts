"use client";

import { getApiUrl } from "@/config/api";
import type { CartProduct } from "@/lib/types/ProductTypes";
import {
  getGuestCartItems,
  guestCartUpdatedEvent,
} from "@/lib/utils/guestCart";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useApi } from "../api/useApi";
import { useGetMe } from "../user/useGetMe";

export type CartItem = CartProduct & {
  cartItemId?: number;
  linePrice?: number;
};

export type CartView = {
  cartId?: number;
  items: CartItem[];
  noOfItems: number;
  totalPrice: number;
};

const buildGuestCart = (items: CartProduct[]): CartView => {
  const cartItems = items.map((item) => ({
    ...item,
    linePrice: item.price * item.quantity,
  }));

  return {
    items: cartItems,
    noOfItems: cartItems.reduce((total, item) => total + item.quantity, 0),
    totalPrice: cartItems.reduce(
      (total, item) => total + (item.linePrice ?? 0),
      0,
    ),
  };
};

export const useCart = () => {
  const api = useApi();
  const { data: user } = useGetMe();
  const [guestItems, setGuestItems] = useState<CartProduct[]>([]);
  const isSignedIn = Boolean(user?.id);

  useEffect(() => {
    if (isSignedIn) return;

    const updateGuestItems = () => setGuestItems(getGuestCartItems());

    updateGuestItems();
    window.addEventListener(guestCartUpdatedEvent, updateGuestItems);
    window.addEventListener("storage", updateGuestItems);

    return () => {
      window.removeEventListener(guestCartUpdatedEvent, updateGuestItems);
      window.removeEventListener("storage", updateGuestItems);
    };
  }, [isSignedIn]);

  const userCartQuery = useQuery<CartView | null>({
    queryKey: ["cart"],
    enabled: isSignedIn,
    queryFn: async () => {
      const response = await api(getApiUrl("/cart"));

      return response as CartView | null;
    },
  });

  const guestCart = useMemo(() => buildGuestCart(guestItems), [guestItems]);

  return {
    cart: isSignedIn ? userCartQuery.data : guestCart,
    isLoading: isSignedIn ? userCartQuery.isLoading : false,
    isError: isSignedIn ? userCartQuery.isError : false,
    isSignedIn,
  };
};
