"use client";

import ShoppingCartIcon from "./svg/ShoppingCart.svg";
import MenuIcon from "./svg/HamburgerMenu";
import { useEffect, useRef, useState } from "react";
import MobileSideBar from "./mobile/NavSidebar";
import DesktopLink from "./desktop/DesktopLink";
import UserIcon from "./svg/User.svg";
import SearchIcon from "./svg/Search";
import Searchbar from "./shared/searchbar";
import Link from "next/link";
import { useGetMe } from "@/Hooks/user/useGetMe";
import { useLogout } from "@/Hooks/user/useLogout";
import { useGuestCartCount } from "@/Hooks/cart/useGuestCartCount";
import Image from "next/image";
import BellIcon from "./svg/Bell";
import { useNotifications } from "@/Hooks/notifications/useNotifications";
import type { AppNotification } from "@/lib/types/NotificationTypes";
import { useLanguage, type Locale } from "@/Context/language/languageContext";

const languageOptions: { label: string; value: Locale }[] = [
  { label: "EN", value: "en" },
  { label: "عربي", value: "ar" },
];

export default function Nav() {
  // Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement | null>(null);
  const { direction, locale, setLocale, t } = useLanguage();

  const handleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsSidebarOpen(false);
      setIsClosing(false);
    }, 300);
  };

  // Search
  const [openSearchbar, setOpenSearchbar] = useState(false);

  const { data: user } = useGetMe();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const guestCartCount = useGuestCartCount();
  const isSignedIn = Boolean(user?.id);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    isMarkingAllAsRead,
  } = useNotifications(isSignedIn);
  const cartProductsCount = isSignedIn
    ? (user?.cartProductsCount ?? 0)
    : guestCartCount;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setIsAccountMenuOpen(false);
      }

      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsAccountMenuOpen(false);
    logout();
  };

  const handleNotificationClick = (notification: AppNotification) => {
    if (!notification.isRead) {
      markAsRead(notification.notificationId);
    }
  };

  // navigate
  return (
    <nav className="w-full h-14 md:h-16 lg:h-20 bg-white flex items-center px-4 md:px-8 text-black shadow-sm fixed z-50">
      {/* LEFT: Logo */}
      <div className="flex items-center gap-2 flex-1">
        <Image
          src="/top.webp"
          alt="Dr. Schrammek Jordan"
          width={36}
          height={36}
          className="h-8 w-8 rounded-full object-cover md:h-9 md:w-9"
          priority
        />
        <span className="font-medium text-sm md:text-base whitespace-nowrap">
          Dr. Schrammek Jordan
        </span>
      </div>

      {/* CENTER: Desktop Links */}
      <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
        <DesktopLink href="/" title={t("nav.home")} />
        <DesktopLink href="/store" title={t("nav.store")} />
        <DesktopLink href="/contact" title={t("nav.contact")} />
        {user?.roleName === "ADMIN" ? (
          <DesktopLink href="/admin" title={t("nav.admin")} />
        ) : undefined}
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-3 flex-1 justify-end relative">
        {/* 🔍 Search Area */}
        <div
          className={`
            flex items-center gap-3 transition-all duration-300 ease-in-out
            ${openSearchbar ? "w-full max-w-md" : "w-auto"}
          `}
        >
          {/* Search Icon (always visible) */}
          <button
            type="button"
            onClick={() => setOpenSearchbar((prev) => !prev)}
            aria-label="Search"
          >
            <SearchIcon size={22} />
          </button>

          {/* Expanding Searchbar */}
          <div
            className={`
              overflow-hidden transition-all duration-300 ease-in-out
              ${openSearchbar ? "w-full opacity-100 ml-2" : "w-0 opacity-0"}
            `}
          >
            <div
              className={`
                transform transition-all duration-300
                ${openSearchbar ? "translate-x-0" : "translate-x-4"}
              `}
            >
              <Searchbar active={openSearchbar} />
            </div>
          </div>
        </div>

        {/* 👤 🛒 ☰ (hide when search is open) */}
        <div
          className={`
            flex items-center gap-4 transition-all duration-300
            ${
              openSearchbar
                ? "opacity-0 scale-95 pointer-events-none w-0 overflow-hidden"
                : "opacity-100 scale-100"
            }
          `}
        >
          <label
            className="flex h-8 items-center rounded-full border border-gray-200 bg-white px-2 text-xs font-bold text-gray-700"
            aria-label={t("nav.language")}
          >
            <span className="sr-only">{t("nav.language")}</span>
            <select
              value={locale}
              onChange={(event) => setLocale(event.target.value as Locale)}
              className="bg-transparent text-xs font-bold outline-none"
            >
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          {isSignedIn ? (
            <>
              <div ref={notificationsRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsNotificationsOpen((prev) => !prev)}
                  className="relative inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-800 transition-colors hover:bg-gray-100"
                  aria-haspopup="menu"
                  aria-expanded={isNotificationsOpen}
                  aria-label={t("nav.notifications")}
                >
                  <BellIcon size={22} />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold leading-none text-white shadow-sm">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>

                {isNotificationsOpen && (
                  <div
                    role="menu"
                    className={`absolute top-12 w-80 overflow-hidden rounded-lg border border-gray-200 bg-white text-sm shadow-lg ${
                      direction === "rtl" ? "left-0" : "right-0"
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                      <span className="font-semibold text-gray-900">
                        {t("nav.notifications")}
                      </span>
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={() => markAllAsRead()}
                          disabled={isMarkingAllAsRead}
                          className="text-xs font-medium text-[#0089d3] hover:text-[#006aa4] disabled:opacity-50"
                        >
                          {t("nav.markAllRead")}
                        </button>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto py-1">
                      {notifications.length === 0 ? (
                        <p className="px-4 py-5 text-center text-sm text-gray-500">
                          {t("nav.noNotifications")}
                        </p>
                      ) : (
                        notifications.map((notification) => (
                          <button
                            key={notification.notificationId}
                            type="button"
                            role="menuitem"
                            onClick={() =>
                              handleNotificationClick(notification)
                            }
                            className={`block w-full border-b border-gray-100 px-4 py-3 transition-colors last:border-b-0 hover:bg-gray-50 ${
                              direction === "rtl" ? "text-right" : "text-left"
                            } ${
                              notification.isRead ? "bg-white" : "bg-blue-50/70"
                            }`}
                          >
                            <span className="block text-sm font-semibold text-gray-900">
                              {notification.title}
                            </span>
                            <span className="mt-1 block text-xs leading-5 text-gray-600">
                              {notification.message}
                            </span>
                            <span className="mt-2 block text-[11px] text-gray-400">
                              {formatNotificationDate(notification.createdAt)}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div ref={accountMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsAccountMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full px-2 py-1 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-100"
                  aria-haspopup="menu"
                  aria-expanded={isAccountMenuOpen}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0089d3] text-xs font-semibold text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden max-w-28 truncate md:block">
                    {user?.name}
                  </span>
                  <span
                    className={`text-xs transition-transform ${
                      isAccountMenuOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▾
                  </span>
                </button>

                {isAccountMenuOpen && (
                  <div
                    role="menu"
                    className={`absolute top-12 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 text-sm shadow-lg ${
                      direction === "rtl" ? "left-0" : "right-0"
                    }`}
                  >
                    <Link
                      href="/profile"
                      role="menuitem"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="block px-4 py-2.5 text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      {t("nav.profile")}
                    </Link>
                    <Link
                      href="/profile/orders"
                      role="menuitem"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="block px-4 py-2.5 text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      {t("nav.orders")}
                    </Link>
                    {user?.roleName === "ADMIN" && (
                      <Link
                        href="/admin/discounts"
                        role="menuitem"
                        onClick={() => setIsAccountMenuOpen(false)}
                        className="block px-4 py-2.5 text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        {t("nav.discounts")}
                      </Link>
                    )}
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className={`block w-full px-4 py-2.5 text-red-600 transition-colors hover:bg-red-50 ${
                        direction === "rtl" ? "text-right" : "text-left"
                      }`}
                    >
                      {isLoggingOut ? t("nav.loggingOut") : t("nav.logout")}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link href={"/auth/register"} aria-label={t("nav.register")}>
              <UserIcon size={26} />
            </Link>
          )}
          <Link
            href="/cart"
            aria-label={t("nav.cart")}
            className="relative inline-flex h-8 w-8 items-center justify-center"
          >
            <ShoppingCartIcon className="w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:animate-rotate-y" />
            {cartProductsCount > 0 && (
              <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#0089d3] px-1.5 text-[11px] font-bold leading-none text-white shadow-sm">
                {cartProductsCount > 99 ? "99+" : cartProductsCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={handleSidebar}
            aria-label={t("nav.menu")}
          >
            <MenuIcon className="w-5 h-5 cursor-pointer lg:hidden" />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        {isSidebarOpen && (
          <MobileSideBar onClose={handleClose} isClosing={isClosing} />
        )}
      </div>
    </nav>
  );
}

const formatNotificationDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(document.documentElement.lang || "en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};
