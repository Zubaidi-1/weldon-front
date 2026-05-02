"use client";

import ShoppingCartIcon from "./svg/ShoppingCart.svg";
import MenuIcon from "./svg/HamburgerMenu";
import { useState } from "react";
import MobileSideBar from "./mobile/NavSidebar";
import DesktopLink from "./desktop/DesktopLink";
import UserIcon from "./svg/User.svg";
import SearchIcon from "./svg/Search";
import Searchbar from "./shared/searchbar";
import Link from "next/link";

export default function Nav() {
  // Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

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
        <DesktopLink href="/shop" title="Shop" />
        <DesktopLink href="/equipment" title="Equipment" />
        <DesktopLink href="/contact" title="Contact" />
        <DesktopLink href="/careers" title="Careers" />
        <DesktopLink href="/blogs" title="Blogs" />
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
          <Link href={"/auth/register"}>
            <UserIcon size={26} />
          </Link>
          <ShoppingCartIcon className="w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:animate-rotate-y" />

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
