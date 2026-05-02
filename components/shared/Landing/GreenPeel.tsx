import Image from "next/image";

export default function GreenPeel() {
  return (
    <section className="w-full min-h-195 lg:min-h-screen flex items-center justify-center bg-linear-to-br from-white via-blue-50 to-white px-5 sm:px-8 lg:px-10 py-14 sm:py-20 lg:py-16">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-10 sm:gap-14 lg:gap-12">
        {/* LEFT: Content */}
        <div className="w-full max-w-2xl text-center lg:text-left">
          {/* Badge */}
          <div className="mx-auto lg:mx-0 mb-5 w-fit rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#0089d3] shadow-sm">
            Skin Renewal
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            GREEN PEEL
            <br />
            <span className="text-[#0089d3]">Herbal Peeling Treatment</span>
          </h2>

          {/* Description */}
          <p className="mt-5 sm:mt-6 text-gray-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
            A worldwide success story for beauty, trusted for more than 60 years
            in over 60 countries. Experience the natural, original method to
            improve your skin effectively.
          </p>

          {/* CTA */}
          <button className="mt-7 sm:mt-8 w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0089d3] text-white font-medium shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition">
            See for yourself
          </button>
        </div>

        {/* RIGHT: Image */}
        <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-xl flex justify-center lg:justify-end">
          {/* Glow */}
          <div className="absolute inset-8 sm:inset-10 bg-blue-300/30 blur-[90px] rounded-full" />

          {/* Image Card */}
          <div className="relative z-10 w-full rounded-3xl sm:rounded-4xl bg-white/70 backdrop-blur-md border border-blue-100 p-5 sm:p-7 lg:p-8 shadow-xl shadow-blue-200/40">
            <Image
              src="/GreenPeel.webp"
              width={520}
              height={520}
              alt="Green Peel"
              className="w-full h-auto object-contain mx-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
