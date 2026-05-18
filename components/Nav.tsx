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

export default function Nav() {
  // Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

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
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsAccountMenuOpen(false);
    logout();
  };

  // navigate
  return (
    <nav className="w-full h-14 md:h-16 lg:h-20 bg-white flex items-center px-4 md:px-8 text-black shadow-sm fixed z-50">
      {/* LEFT: Logo */}
      <div className="flex items-center gap-2 flex-1">
        <span className="font-medium text-sm md:text-base whitespace-nowrap">
          Dr. Schrammek Jordan
        </span>
      </div>

      {/* CENTER: Desktop Links */}
      <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
        <DesktopLink href="/" title="Home" />
        <DesktopLink href="/new-arrivals" title="New Arrivals" />
        <DesktopLink href="/bundles" title="Bundles & Value Sets" />
        <DesktopLink href="/store" title="store" />
        <DesktopLink href="/equipment" title="Equipment" />
        <DesktopLink href="/contact" title="Contact" />
        <DesktopLink href="/careers" title="Careers" />
        <DesktopLink href="/blogs" title="Blogs" />
        {user?.roleName === "ADMIN" ? (
          <DesktopLink href="/admin" title="Admin" />
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
          <button onClick={() => setOpenSearchbar((prev) => !prev)}>
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
          {isSignedIn ? (
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
                  className="absolute right-0 top-12 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 text-sm shadow-lg"
                >
                  <Link
                    href="/profile"
                    role="menuitem"
                    onClick={() => setIsAccountMenuOpen(false)}
                    className="block px-4 py-2.5 text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/orders"
                    role="menuitem"
                    onClick={() => setIsAccountMenuOpen(false)}
                    className="block px-4 py-2.5 text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    My orders
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="block w-full px-4 py-2.5 text-left text-red-600 transition-colors hover:bg-red-50"
                  >
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href={"/auth/register"} aria-label="Register">
              <UserIcon size={26} />
            </Link>
          )}
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative inline-flex h-8 w-8 items-center justify-center"
          >
            <ShoppingCartIcon className="w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:animate-rotate-y" />
            {cartProductsCount > 0 && (
              <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#0089d3] px-1.5 text-[11px] font-bold leading-none text-white shadow-sm">
                {cartProductsCount > 99 ? "99+" : cartProductsCount}
              </span>
            )}
          </Link>

          <button onClick={handleSidebar}>
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
