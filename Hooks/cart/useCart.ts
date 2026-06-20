"use client";

import { getApiUrl } from "@/config/api";
import type { Discount } from "@/lib/types/DiscountTypes";
import type { CartProduct, Product } from "@/lib/types/ProductTypes";
import { getBestProductDiscount } from "@/lib/utils/discounts";
import {
  getGuestCartItems,
  guestCartUpdatedEvent,
  setGuestCartItems,
} from "@/lib/utils/guestCart";
import { getPrimaryProductImage } from "@/lib/utils/productImages";
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

const refreshGuestCartItems = (
  items: CartProduct[],
  products?: Product[],
  discounts: Discount[] = [],
): CartProduct[] => {
  if (!products?.length) return items;

  const productsById = new Map(
    products.map((product) => [product.productId, product]),
  );

  return items
    .map((item) => {
      const product = productsById.get(item.productId);
      if (!product) return item;

      const maxQuantity = Math.max(0, product.stockQuantity - 5);

      return {
        ...item,
        productName: product.productName,
        productImage: getPrimaryProductImage(product),
        productSize: product.productSize,
        price:
          getBestProductDiscount(product, discounts)?.price ??
          product.productPrice,
        maxQuantity,
        quantity: Math.min(item.quantity, maxQuantity),
      };
    })
    .filter((item) => item.quantity > 0);
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

  const productsQuery = useQuery<Product[]>({
    queryKey: ["all-products"],
    enabled: !isSignedIn && guestItems.length > 0,
    queryFn: async () => {
      const response = await api(getApiUrl("/product/all-products"));

      return response as Product[];
    },
  });

  const activeDiscountsQuery = useQuery<Discount[]>({
    queryKey: ["discounts", "active"],
    enabled: !isSignedIn && guestItems.length > 0,
    queryFn: async () => {
      const response = await api(getApiUrl("/discounts/active"));

      return response as Discount[];
    },
  });

  useEffect(() => {
    if (isSignedIn || !productsQuery.data) return;

    const refreshedItems = refreshGuestCartItems(
      guestItems,
      productsQuery.data,
      activeDiscountsQuery.data,
    );
    if (JSON.stringify(refreshedItems) === JSON.stringify(guestItems)) return;

    setGuestCartItems(refreshedItems);
  }, [activeDiscountsQuery.data, guestItems, isSignedIn, productsQuery.data]);

  const guestCart = useMemo(
    () =>
      buildGuestCart(
        refreshGuestCartItems(
          guestItems,
          productsQuery.data,
          activeDiscountsQuery.data,
        ),
      ),
    [activeDiscountsQuery.data, guestItems, productsQuery.data],
  );

  return {
    cart: isSignedIn ? userCartQuery.data : guestCart,
    isLoading: isSignedIn ? userCartQuery.isLoading : false,
    isError: isSignedIn ? userCartQuery.isError : false,
    isSignedIn,
  };
};
