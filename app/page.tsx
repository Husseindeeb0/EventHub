import { Hero } from "@/components/landing-page/hero";
import { Mission } from "@/components/landing-page/mission";
import { HowItWorks } from "@/components/landing-page/how-it-works";
import { Features } from "@/components/landing-page/features";
import { PlatformPurpose } from "@/components/landing-page/platform-purpose";
import { CTA } from "@/components/landing-page/cta";

export default function Home() {
  return (
    <main className="bg-transparent font-sans text-slate-900 dark:text-slate-200 selection:bg-indigo-100 dark:selection:bg-indigo-900 selection:text-indigo-900 dark:selection:text-indigo-100">
      <Hero />
      <Mission />
      <HowItWorks />
      <Features />
      <PlatformPurpose />
      <CTA />
    </main>
  );
}
