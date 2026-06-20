"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Locale = "en" | "ar";

type Dictionary = typeof dictionaries.en;
type TranslationKey = keyof Dictionary;

type LanguageContextType = {
  locale: Locale;
  direction: "ltr" | "rtl";
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
};

const languageStorageKey = "locale";

const dictionaries = {
  en: {
    "nav.home": "Home",
    "nav.store": "Store",
    "nav.contact": "Contact",
    "nav.admin": "Admin",
    "nav.profile": "Profile",
    "nav.orders": "My orders",
    "nav.discounts": "Discounts",
    "nav.logout": "Logout",
    "nav.loggingOut": "Logging out...",
    "nav.notifications": "Notifications",
    "nav.noNotifications": "No notifications yet",
    "nav.markAllRead": "Mark all read",
    "nav.language": "Language",
    "nav.menu": "Menu",
    "nav.close": "Close",
    "nav.cart": "Cart",
    "nav.register": "Register",
    "cart.title": "Shopping Cart",
    "cart.eyebrow": "Cart",
    "cart.item": "item",
    "cart.items": "items",
    "cart.emptyTitle": "Your cart is empty",
    "cart.emptyBody": "Browse the store and add your favorite products here.",
    "cart.continueShopping": "Continue shopping",
    "cart.loading": "Loading cart...",
    "cart.failed": "Failed to load cart",
    "cart.summary": "Summary",
    "cart.total": "Total",
    "cart.couponCode": "Coupon code",
    "cart.apply": "Apply",
    "cart.checking": "Checking",
    "cart.remove": "Remove",
    "cart.checkout": "Checkout",
    "cart.placingOrder": "Placing order...",
    "cart.savingCart": "Saving cart...",
    "cart.email": "Email",
    "cart.firstName": "First name",
    "cart.lastName": "Last name",
    "cart.phone": "Phone number",
    "cart.selectGovernate": "Select governate",
    "cart.address": "Delivery address",
    "cart.size": "Size",
    "cart.each": "each",
    "cart.delete": "Delete",
  },
  ar: {
    "nav.home": "الرئيسية",
    "nav.store": "المتجر",
    "nav.contact": "تواصل معنا",
    "nav.admin": "الإدارة",
    "nav.profile": "الملف الشخصي",
    "nav.orders": "طلباتي",
    "nav.discounts": "الخصومات",
    "nav.logout": "تسجيل الخروج",
    "nav.loggingOut": "جار تسجيل الخروج...",
    "nav.notifications": "الإشعارات",
    "nav.noNotifications": "لا توجد إشعارات بعد",
    "nav.markAllRead": "تعليم الكل كمقروء",
    "nav.language": "اللغة",
    "nav.menu": "القائمة",
    "nav.close": "إغلاق",
    "nav.cart": "السلة",
    "nav.register": "إنشاء حساب",
    "cart.title": "سلة التسوق",
    "cart.eyebrow": "السلة",
    "cart.item": "منتج",
    "cart.items": "منتجات",
    "cart.emptyTitle": "سلتك فارغة",
    "cart.emptyBody": "تصفحي المتجر وأضيفي منتجاتك المفضلة هنا.",
    "cart.continueShopping": "متابعة التسوق",
    "cart.loading": "جار تحميل السلة...",
    "cart.failed": "تعذر تحميل السلة",
    "cart.summary": "الملخص",
    "cart.total": "الإجمالي",
    "cart.couponCode": "كود الخصم",
    "cart.apply": "تطبيق",
    "cart.checking": "جار التحقق",
    "cart.remove": "إزالة",
    "cart.checkout": "إتمام الطلب",
    "cart.placingOrder": "جار إنشاء الطلب...",
    "cart.savingCart": "جار حفظ السلة...",
    "cart.email": "البريد الإلكتروني",
    "cart.firstName": "الاسم الأول",
    "cart.lastName": "اسم العائلة",
    "cart.phone": "رقم الهاتف",
    "cart.selectGovernate": "اختاري المحافظة",
    "cart.address": "عنوان التوصيل",
    "cart.size": "الحجم",
    "cart.each": "للقطعة",
    "cart.delete": "حذف",
  },
} as const;

const LanguageContext = createContext<LanguageContextType | null>(null);

const getInitialLocale = (): Locale => {
  if (typeof window === "undefined") return "en";

  const storedLocale = window.localStorage.getItem(languageStorageKey);

  return storedLocale === "ar" ? "ar" : "en";
};

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);
  const direction = locale === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
    document.body.dir = direction;
    window.localStorage.setItem(languageStorageKey, locale);
  }, [direction, locale]);

  const value = useMemo<LanguageContextType>(
    () => ({
      locale,
      direction,
      setLocale: setLocaleState,
      t: (key) => dictionaries[locale][key] ?? dictionaries.en[key],
    }),
    [direction, locale],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
};
