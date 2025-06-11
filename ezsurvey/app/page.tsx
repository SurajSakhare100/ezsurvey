import Link from "next/link"
import { ArrowRight, CheckCircle, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DemoSurvey } from "@/components/survey/demo-survey"
import { FeatureIllustration } from "@/components/home/feature-illustration"
import { StatsSection } from "@/components/home/stats-section"
import { TestimonialsEnhanced } from "@/components/home/testimonials-enhanced"
import { PricingEnhanced } from "@/components/home/pricing-enhanced"
import { CTASection } from "@/components/home/cta-section"
import { HeroIllustration } from "@/components/home/hero-illustration"


export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-cyan-600" />
            <span className="text-xl font-semibold">MicroSurvey</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
            <Button asChild size="sm" variant="outline">
              <Link href="/login">Log in</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-cyan-50/30 to-slate-50 py-24">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fillRule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23f1f5f9&quot; fillOpacity=&quot;0.4&quot;%3E%3Ccircle cx=&quot;7&quot; cy=&quot;7&quot; r=&quot;1&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
          <div className="container relative px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col justify-center space-y-8">
                <div className="space-y-6">
                  <div className="inline-flex items-center rounded-full border bg-white/80 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                    <span className="mr-2 h-2 w-2 rounded-full bg-green-500"></span>
                    No subscriptions • Pay once, use forever
                  </div>
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                    Surveys That Don't Feel Like Surveys.
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    Built for humans, not spreadsheets. Delightfully fast, zero-friction, and beautifully simple.
                  </p>

                </div>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button
                    size="lg"
                    className="rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 px-8 py-6 text-lg font-medium shadow-lg transition-all hover:shadow-xl hover:scale-105"
                    asChild
                  >
                    <a href="#demo">
                      Try Interactive Demo <ArrowRight className="ml-2 h-5 w-5" />
                    </a>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-2xl border-2 px-8 py-6 text-lg font-medium transition-all hover:bg-slate-50"
                    asChild
                  >
                    <Link href="/dashboard/new">Create Your First Survey</Link>
                  </Button>
                </div>
                <div className="flex items-center gap-8 pt-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">No coding required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">Setup in 60 seconds</span>
                  </div>
                </div>
              </div>
              <div className="relative flex items-center justify-center">
                <HeroIllustration />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Why Creators Love MicroSurvey</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to collect meaningful feedback — without code, clutter, or confusion.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="group relative overflow-hidden rounded-3xl border bg-gradient-to-br from-white to-slate-50/50 p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 opacity-50"></div>
                <div className="relative">
                  <div className="mb-6 flex justify-center">
                    <FeatureIllustration type="speed" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-center">Instant Setup</h3>
                  <p className="text-muted-foreground leading-relaxed text-center">
                    Launch your first survey in under a minute. No learning curve, just clarity.
                  </p>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-3xl border bg-gradient-to-br from-white to-slate-50/50 p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 opacity-50"></div>
                <div className="relative">
                  <div className="mb-6 flex justify-center">
                    <FeatureIllustration type="simple" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-center">Truly No-Code</h3>
                  <p className="text-muted-foreground leading-relaxed text-center">
                    Built for non-techies. Create, customize, and share — no dev help required.
                  </p>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-3xl border bg-gradient-to-br from-white to-slate-50/50 p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 opacity-50"></div>
                <div className="relative">
                  <div className="mb-6 flex justify-center">
                    <FeatureIllustration type="payment" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-center">One-Time Payment</h3>
                  <p className="text-muted-foreground leading-relaxed text-center">
                    No subscriptions. Just a simple one-time fee for unlimited surveys and responses.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <StatsSection />

        {/* Demo Section */}
        <section id="demo" className="py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Try it yourself</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Experience how easy it is to create and complete a micro-survey
              </p>
            </div>
            <div className="mx-auto max-w-2xl rounded-3xl border-2 bg-white p-8 shadow-xl">
              <DemoSurvey />
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <TestimonialsEnhanced />

        {/* Pricing */}
        <PricingEnhanced/>

        {/* CTA Section */}
        <CTASection />
      </main>

      <footer className="border-t bg-white py-6">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-cyan-600" />
            <span className="text-sm font-semibold">MicroSurvey</span>
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground">
              Contact
            </Link>
          </div>
          <div className="text-sm text-muted-foreground">© 2025 MicroSurvey. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
