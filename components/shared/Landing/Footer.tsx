import InstagramIcon from "@/components/svg/Instagram";
import WhatsappIcon from "@/components/svg/whatsapp";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-blue-100 bg-[#f7fbfd] px-5 sm:px-8 lg:px-10 pt-14  text-gray-700">
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.35fr_0.85fr_0.85fr_1fr]">
        <div className="max-w-md">
          <p className="font-serif text-3xl font-semibold text-gray-950">
            Dr. Schrammek Jordan
          </p>
          <p className="mt-4 text-sm leading-6 text-gray-600">
            Professional skincare inspired by dermatological expertise, designed
            to support healthy, confident skin every day.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-100 bg-white text-sm font-semibold text-[#0089d3] shadow-sm transition hover:border-[#0089d3] hover:bg-blue-50"
            >
              <InstagramIcon />
            </a>
            <a
              href="#"
              aria-label="WhatsApp"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-100 bg-white text-sm font-semibold text-[#ffffff] shadow-sm transition hover:border-[#0089d3] hover:bg-blue-50"
            >
              <WhatsappIcon />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-950">
            Shop
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <Link href="/shop" className="transition hover:text-[#0089d3]">
                All Products
              </Link>
            </li>
            <li>
              <Link
                href="/new-arrivals"
                className="transition hover:text-[#0089d3]"
              >
                New Arrivals
              </Link>
            </li>
            <li>
              <Link href="/bundles" className="transition hover:text-[#0089d3]">
                Bundles & Value Sets
              </Link>
            </li>
            <li>
              <Link
                href="/equipment"
                className="transition hover:text-[#0089d3]"
              >
                Equipment
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-950">
            Company
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <Link href="/" className="transition hover:text-[#0089d3]">
                Home
              </Link>
            </li>
            <li>
              <Link href="/blogs" className="transition hover:text-[#0089d3]">
                Blogs
              </Link>
            </li>
            <li>
              <Link href="/careers" className="transition hover:text-[#0089d3]">
                Careers
              </Link>
            </li>
            <li>
              <Link href="/contact" className="transition hover:text-[#0089d3]">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-950">
            Visit Us
          </h3>
          <div className="mt-5 space-y-3 text-sm leading-6 text-gray-600">
            <p>Amman, Jordan</p>
            <p>
              <a
                href="mailto:info@drschrammek.jo"
                className="transition hover:text-[#0089d3]"
              >
                info@drschrammek.jo
              </a>
            </p>
            <p>
              <a
                href="tel:+962000000000"
                className="transition hover:text-[#0089d3]"
              >
                +962 00 000 0000
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 flex w-full max-w-7xl flex-col gap-4 border-t border-blue-100 pt-6 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Dr. Schrammek Jordan. All rights reserved.</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <a href="#" className="transition hover:text-[#0089d3]">
            Privacy Policy
          </a>
          <a href="#" className="transition hover:text-[#0089d3]">
            Terms
          </a>
          <a href="#" className="transition hover:text-[#0089d3]">
            Shipping
          </a>
        </div>
      </div>
    </footer>
  );
}
