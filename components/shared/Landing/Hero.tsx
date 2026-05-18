import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="flex flex-col-reverse lg:flex-row items-center justify-center lg:justify-around w-full gap-8 sm:gap-12 lg:gap-10 min-h-190 lg:min-h-screen px-5 sm:px-8 lg:px-10 pt-20 sm:pt-24 lg:pt-10 pb-10">
      {/* LEFT: Image */}
      <div className="relative w-full max-w-sm sm:max-w-lg lg:max-w-none lg:w-140 h-90 sm:h-130 lg:h-175">
        {/* Glass layer (desktop only) */}
        <div className="absolute inset-0 rounded-4xl bg-white/40 backdrop-blur-sm border border-blue-100 hidden lg:block" />

        {/* Image */}
        <div className="relative h-full w-full rounded-3xl sm:rounded-4xl overflow-hidden shadow-md shadow-gray-400 animate-fade-right">
          <Image
            src="/Landing.jpg"
            alt="blemish"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      </div>

      {/* RIGHT: Content */}
      <div className="flex flex-col justify-center items-center lg:items-start w-full max-w-xl lg:max-w-lg text-center lg:text-left animate-fade-left">
        <div className="mb-5 w-fit rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#0089d3] shadow-sm">
          Skin-first beauty
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-5xl font-bold leading-tight text-gray-900">
          More than makeup
          <br />
          <span className="text-[#0089d3]">it&apos;s skin therapy</span>
        </h1>

        <p className="mt-5 sm:mt-6 text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl">
          Science-backed skincare designed to restore, protect, and enhance your
          natural glow.
        </p>

        <Link
          href={"/store"}
          className="mt-7 sm:mt-8 w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0089d3] text-white font-medium shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
}
