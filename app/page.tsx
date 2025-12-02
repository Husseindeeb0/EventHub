import { Navbar } from "@/components/landing-page/navbar"
import { Hero } from "@/components/landing-page/hero"
import { Mission } from "@/components/landing-page/mission"
import { Stats } from "@/components/landing-page/stats"
import { HowItWorks } from "@/components/landing-page/how-it-works"
import { Features } from "@/components/landing-page/features"
import { PlatformPurpose } from "@/components/landing-page/platform-purpose"
import { Testimonials } from "@/components/landing-page/testimonials"
import { SocialProof } from "@/components/landing-page/social-proof"
import { CTA } from "@/components/landing-page/cta"

export default function Home() {
    return (
        <main className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
            <Navbar />
            <Hero />
            <Mission />
            <Stats />
            <HowItWorks />
            <Features />
            <PlatformPurpose />
            <Testimonials />
            <SocialProof />
            <CTA />

            {/* Simple Footer for completeness */}
            <footer className="py-8 border-t bg-slate-50">
                <div className="container px-4 md:px-6 text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} EventHub. All rights reserved.
                </div>
            </footer>
        </main>
    )
}
