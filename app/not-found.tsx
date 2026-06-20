import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FBFD] px-4 py-24 sm:px-6 lg:px-8">
      <section className="mx-auto grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex justify-center lg:justify-end">
          <div className="relative flex aspect-square w-full max-w-sm items-center justify-center overflow-hidden rounded-full border border-[#D8EAF4] bg-white shadow-[0_20px_60px_rgba(0,137,211,0.14)]">
            <div className="absolute inset-8 rounded-full border border-dashed border-[#BFDCEB]" />
            <Image
              src="/top.webp"
              alt="Dr. Schrammek Jordan"
              width={160}
              height={160}
              className="relative h-36 w-36 rounded-full object-cover shadow-[0_16px_34px_rgba(15,23,42,0.14)] sm:h-40 sm:w-40"
              priority
            />
          </div>
        </div>

        <div className="text-center lg:text-left">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0089D3]">
            404
          </p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight text-[#0F172A] sm:text-5xl">
            This page is not available
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-[#64748B] lg:mx-0">
            The page may have moved, expired, or never existed. You can head
            back home or keep browsing the skincare store.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href="/"
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#0089D3] px-6 text-sm font-bold text-white shadow-[0_12px_24px_rgba(0,137,211,0.22)] transition hover:bg-[#0077B8] sm:w-auto"
            >
              Go Home
            </Link>
            <Link
              href="/store"
              className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-[#CBD5E1] bg-white px-6 text-sm font-bold text-[#334155] transition hover:bg-[#F8FAFC] sm:w-auto"
            >
              Browse Store
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
