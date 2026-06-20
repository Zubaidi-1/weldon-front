import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="flex min-h-screen w-full flex-col-reverse items-center justify-center gap-8 px-5 pb-10 pt-20 sm:gap-12 sm:px-8 sm:pt-24 lg:flex-row lg:justify-around lg:gap-10 lg:px-10 lg:pt-20">
      {/* LEFT: Image */}
      <div className="relative w-full max-w-sm sm:max-w-lg lg:max-w-none lg:w-140 h-90 sm:h-130 lg:h-175">
        {/* Glass layer (desktop only) */}
        <div className="absolute inset-0 rounded-4xl bg-white/40 backdrop-blur-sm border border-blue-100 hidden lg:block" />

        {/* Image */}
        <div className="relative h-full w-full rounded-3xl sm:rounded-4xl overflow-hidden shadow-md shadow-gray-400 animate-fade-right">
          <Image
            src="/Composing-mit-Body-Men-Moisture-Plus_web_1000x749px.webp"
            alt="Dr. Schrammek skincare composition"
            fill
            className="object-contain object-center"
            priority
          />
        </div>
      </div>

      {/* RIGHT: Content */}
      <div className="flex w-full max-w-6xl flex-col items-center justify-center text-center animate-fade-left lg:max-w-lg lg:items-start lg:text-left">
        <div className="mb-5 w-fit rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#0089d3] shadow-sm">
          Skin-first beauty
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-5xl font-bold leading-tight text-gray-900">
          Healthy skin, beautifully
          <span className="text-[#0089d3]"> expertly cared for.</span>
        </h1>

        <p className="mt-5 sm:mt-6 text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl">
          Dermatological skincare made to support real skin concerns with
          formulas that feel refined, effective, and easy to trust.
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
