import { Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PricingEnhanced() {
  const features = [
    "Unlimited surveys",
    "Unlimited responses",
    "All question types",
    "Real-time analytics",
    "Export to CSV/Excel",
    "Custom branding",
    "Email notifications",
    "Embed anywhere",
    "Mobile responsive",
    "Lifetime updates",
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 to-white">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            One price, everything included. No hidden fees, no surprises.
          </p>
        </div>

        <div className="mx-auto max-w-lg">
          <div className="relative overflow-hidden rounded-3xl border-2 border-cyan-200 bg-white p-8 shadow-xl">
            <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 opacity-50"></div>

            <div className="relative">
              <div className="mb-2 flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-cyan-600" />
                <span className="rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 px-3 py-1 text-sm font-medium text-white">
                  Most Popular
                </span>
              </div>

              <div className="mb-6 text-center">
                <div className="mb-2">
                  <span className="text-6xl font-bold">$29</span>
                  <span className="text-xl text-muted-foreground"> one-time</span>
                </div>
                <p className="text-muted-foreground">Pay once, own forever</p>
              </div>

              <ul className="mb-8 space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button className="w-full rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 py-6 text-lg font-medium shadow-lg transition-all hover:shadow-xl hover:scale-105">
                Get MicroSurvey Now
              </Button>

              <p className="mt-4 text-center text-sm text-muted-foreground">30-day money-back guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
