"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
type Props = {
  href: string;
  title: string;
};
export default function MobileLink({ href, title }: Props) {
  // get path for active links
  const pathname = usePathname();
  return (
    <Link
      href={href}
      className={
        pathname === `${href}`
          ? `text-lg py-3 border-b border-blue-300/70 text-blue-500`
          : `text-lg py-3 border-b border-blue-300/70 `
      }
    >
      {title}
    </Link>
  );
}
