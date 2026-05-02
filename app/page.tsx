import Brand from "@/components/shared/Landing/Brand";
import Footer from "@/components/shared/Landing/Footer";
import GreenPeel from "@/components/shared/Landing/GreenPeel";
import Hero from "@/components/shared/Landing/Hero";


export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-white py-10 gap-16 overflow-x-hidden">
      {/* HERO SECTION */}
      <Hero />

      {/* SECOND SECTION (Green Peel) */}
      <GreenPeel />

      {/* BRAND STORY SECTION */}
      <Brand />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
