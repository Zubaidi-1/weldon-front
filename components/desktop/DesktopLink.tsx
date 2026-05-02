"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  href: string;
  title: string;
};

// Active Links handling
export default function DesktopLink({ href, title }: Props) {
  const pathname = usePathname();

  return (
    <Link
      className={pathname === href ? "text-blue-500 hover:text-blue-300" : "hover:text-blue-300" }
      href={href}
    >
      {title}
    </Link>
  );
}
