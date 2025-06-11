import { Star, Quote } from "lucide-react"

export function TestimonialsEnhanced() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Content Creator",
      avatar: "SC",
      content:
        "MicroSurvey helped me understand my audience better than any other tool. The insights I get are incredible, and setting up surveys takes literally seconds.",
      rating: 5,
      color: "from-pink-500 to-rose-500",
    },
    {
      name: "Michael Rodriguez",
      role: "Business Coach",
      avatar: "MR",
      content:
        "I love that there's no subscription. I paid once and can create unlimited surveys for all my coaching programs. The ROI has been amazing.",
      rating: 5,
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Alex Thompson",
      role: "Indie Developer",
      avatar: "AT",
      content:
        "The clean design matches my brand perfectly. My users actually enjoy filling out these micro-surveys, which means better response rates for me.",
      rating: 5,
      color: "from-green-500 to-teal-500",
    },
  ]

  return (
    <section className="py-24 bg-white">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Loved by creators worldwide</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See what our community has to say about MicroSurvey
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-3xl border bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <div className="absolute top-4 right-4 opacity-10">
                <Quote className="h-12 w-12 text-slate-400" />
              </div>

              <div className="relative">
                <div className="mb-4 flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="mb-6 text-muted-foreground leading-relaxed">"{testimonial.content}"</p>

                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${testimonial.color} text-white font-bold`}
                  >
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
