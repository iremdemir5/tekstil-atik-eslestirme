import Footer from "@/components/landing/Footer";
import FactoryLogos from "@/components/landing/FactoryLogos";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import Navbar from "@/components/landing/Navbar";
import StatsCounter from "@/components/landing/StatsCounter";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main>
        <HeroSection />

        <section className="mx-auto max-w-6xl px-4 pb-6">
          <div className="rounded-3xl border border-white/50 bg-white/35 shadow-sm backdrop-blur-md p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold">Platform İstatistikleri</h2>
              <div className="text-sm text-foreground/65">
                /api/stats ile gerçek zamanlı güncellenir (hazırda placeholder)
              </div>
            </div>
            <div className="mt-4">
              <StatsCounter />
            </div>
          </div>
        </section>

        <HowItWorks />
        <FactoryLogos />
      </main>

      <Footer />
    </div>
  );
}
