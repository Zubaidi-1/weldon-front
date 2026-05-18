"use client";

import {
  getGuestCartCount,
  guestCartUpdatedEvent,
} from "@/lib/utils/guestCart";
import { useEffect, useState } from "react";

export const useGuestCartCount = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCount = () => setCount(getGuestCartCount());

    updateCount();
    window.addEventListener(guestCartUpdatedEvent, updateCount);
    window.addEventListener("storage", updateCount);

    return () => {
      window.removeEventListener(guestCartUpdatedEvent, updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  return count;
};
