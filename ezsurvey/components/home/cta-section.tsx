import { ArrowRight, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fillRule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fillOpacity=&quot;0.1&quot;%3E%3Ccircle cx=&quot;7&quot; cy=&quot;7&quot; r=&quot;1&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      <div className="container relative px-4 md:px-6">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center justify-center rounded-full bg-white/10 p-3 backdrop-blur-sm">
            <MessageSquare className="h-8 w-8" />
          </div>

          <h2 className="mb-4 text-4xl font-bold">Ready to collect better feedback?</h2>
          <p className="mb-8 text-xl text-cyan-100 max-w-2xl mx-auto">
            Join thousands of creators who are already using MicroSurvey to understand their audience better.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="rounded-2xl bg-white px-8 py-6 text-lg font-medium text-cyan-600 shadow-lg transition-all hover:shadow-xl hover:scale-105 hover:bg-slate-50"
              asChild
            >
              <Link href="/dashboard/new">
                Start Creating Surveys <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-2xl border-2 border-white/30 px-8 py-6 text-lg font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10"
              asChild
            >
              <a href="#demo">Try Demo First</a>
            </Button>
          </div>

          <p className="mt-6 text-sm text-cyan-100">No credit card required • Setup in 60 seconds</p>
        </div>
      </div>
    </section>
  )
}
