import type { CartProduct } from "@/lib/types/ProductTypes";

export const guestCartKey = "guest-cart";
export const guestCartUpdatedEvent = "guest-cart-updated";

export type GuestCartInput = CartProduct & {
  maxQuantity?: number;
};

export const getGuestCartItems = () => {
  if (typeof window === "undefined") return [];

  const storedCart = localStorage.getItem(guestCartKey);
  if (!storedCart) return [];

  try {
    return JSON.parse(storedCart) as CartProduct[];
  } catch {
    return [];
  }
};

export const getGuestCartCount = () => {
  return getGuestCartItems().reduce((total, item) => total + item.quantity, 0);
};

export const addGuestCartItem = (item: GuestCartInput) => {
  const cartItems = getGuestCartItems();
  const existingItem = cartItems.find(
    (cartItem) => cartItem.productId === item.productId,
  );
  const maxQuantity = item.maxQuantity ?? Number.MAX_SAFE_INTEGER;
  const cartItem: CartProduct = {
    productId: item.productId,
    productName: item.productName,
    productSize: item.productSize,
    price: item.price,
    quantity: Math.min(item.quantity, maxQuantity),
    productImage: item.productImage,
    maxQuantity,
  };

  const updatedCart = existingItem
    ? cartItems.map((cartItem) =>
        cartItem.productId === item.productId
          ? {
              ...cartItem,
              quantity: Math.min(cartItem.quantity + item.quantity, maxQuantity),
            }
          : cartItem,
      )
    : [...cartItems, cartItem];

  localStorage.setItem(guestCartKey, JSON.stringify(updatedCart));
  window.dispatchEvent(new Event(guestCartUpdatedEvent));

  return updatedCart;
};

export const updateGuestCartItemQuantity = (
  productId: number,
  updateType: "INCREMENT" | "DECREMENT" | "REMOVE",
  quantity = 1,
) => {
  const cartItems = getGuestCartItems();

  const updatedCart = cartItems
    .map((item) => {
      if (item.productId !== productId) return item;

      if (updateType === "INCREMENT") {
        const maxQuantity = item.maxQuantity ?? Number.MAX_SAFE_INTEGER;

        return {
          ...item,
          quantity: Math.min(item.quantity + quantity, maxQuantity),
        };
      }

      if (updateType === "DECREMENT") {
        return {
          ...item,
          quantity: item.quantity - quantity,
        };
      }

      return {
        ...item,
        quantity: 0,
      };
    })
    .filter((item) => item.quantity > 0);

  localStorage.setItem(guestCartKey, JSON.stringify(updatedCart));
  window.dispatchEvent(new Event(guestCartUpdatedEvent));

  return updatedCart;
};

export const clearGuestCart = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(guestCartKey);
  window.dispatchEvent(new Event(guestCartUpdatedEvent));
};
