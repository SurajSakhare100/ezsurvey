import { ArrowRight, Edit3, Share2, BarChart3 } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: Edit3,
      title: "Create Your Survey",
      description: "Use our intuitive builder to craft the perfect questions in minutes.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Share2,
      title: "Share with Your Audience",
      description: "Get a beautiful link to share anywhere - email, social media, or embed on your site.",
      color: "from-cyan-500 to-teal-500",
    },
    {
      icon: BarChart3,
      title: "Analyze Responses",
      description: "View insights, export data, and make informed decisions based on feedback.",
      color: "from-teal-500 to-green-500",
    },
  ]

  return (
    <section className="py-24 bg-slate-50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How it works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">From idea to insights in three simple steps</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="text-center">
                <div
                  className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} text-white shadow-lg`}
                >
                  <step.icon className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>

              {index < steps.length - 1 && (
                <div className="absolute top-8 left-1/2 hidden md:block">
                  <ArrowRight className="h-6 w-6 text-muted-foreground translate-x-8" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
