import { Hero } from "@/components/landing-page/hero"
import { Mission } from "@/components/landing-page/mission"
import { HowItWorks } from "@/components/landing-page/how-it-works"
import { Features } from "@/components/landing-page/features"
import { PlatformPurpose } from "@/components/landing-page/platform-purpose"
import { CTA } from "@/components/landing-page/cta"

export default function Home() {
    return (
        <main className="bg-white font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
            <Hero />
            <Mission />
            <HowItWorks />
            <Features />
            <PlatformPurpose />
            <CTA />
        </main>
    )
}
