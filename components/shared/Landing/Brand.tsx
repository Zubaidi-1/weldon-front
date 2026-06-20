import Image from "next/image";

export default function Brand() {
  return (
    <section className="flex min-h-screen w-full items-center px-5 py-20 sm:px-8 lg:px-10">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        {/* LEFT: People Image */}
        <div className="relative mx-auto w-full max-w-md sm:max-w-xl lg:max-w-none">
          <div className="absolute -inset-3 rounded-4xl bg-white shadow-xl shadow-blue-100/60" />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-blue-100 bg-white shadow-lg">
            <Image
              src="/people.jpeg"
              width={760}
              height={920}
              alt="Dr. med. Christine Schrammek-Drusio and Christina Drusio, MD"
              className="h-105 w-full object-cover object-top sm:h-140 lg:h-170"
            />
          </div>
        </div>

        {/* RIGHT: Story Content */}
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center lg:items-start lg:text-left">
          <div className="mb-5 w-fit rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#0089d3] shadow-sm">
            Our Story
          </div>

          <h2 className="font-serif text-4xl font-semibold leading-tight text-gray-950 sm:text-5xl lg:text-6xl">
            A life dedicated to beauty.
          </h2>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
            For more than 60 years, we have helped people achieve beautiful,
            healthy skin. Who are we? Get to know us.
          </p>

          <div className="mt-8 flex w-full max-w-3xl flex-col items-center border-y border-blue-100 py-7 text-center sm:py-8">
            <p className="max-w-3xl font-serif text-2xl leading-snug text-gray-900 sm:text-3xl lg:text-4xl">
              &quot;The symbiosis of medicine and cosmetics turns our products
              into highly-effective problem solvers.&quot;
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
              Beautiful skin significantly contributes to physical and
              psychological well-being.
            </p>
          </div>

          <div className="mt-7 flex w-full flex-col items-center gap-5 sm:flex-row sm:justify-center lg:justify-start">
            <Image
              src="/signature_cmd.png"
              width={190}
              height={82}
              alt="Dr. med. Christine Schrammek-Drusio signature"
              className="h-14 w-auto object-contain"
            />
            <div className="hidden h-12 w-px bg-blue-100 sm:block" />
            <Image
              src="/signature_csd.png"
              width={190}
              height={82}
              alt="Christina Drusio signature"
              className="h-14 w-auto object-contain"
            />
          </div>

          <p className="mt-6 max-w-xl text-xs leading-6 text-gray-500 sm:text-sm">
            Dr. med. Christine Schrammek-Drusio, Dermatologist, Allergist &
            Anti-Aging Expert. Christina Drusio, MD, Medical Specialist for
            Dermatology and Venerology.
          </p>
        </div>
      </div>
    </section>
  );
}
