import Link from "next/link"
import { MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-cyan-600" />
            <span className="text-xl font-semibold">MicroSurvey</span>
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center bg-slate-50">
        <div className="container flex flex-col items-center px-4 text-center md:px-6">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-100">
            <MessageSquare className="h-10 w-10 text-cyan-600" />
          </div>
          <h1 className="mb-4 text-4xl font-bold">Page Not Found</h1>
          <p className="mb-8 max-w-md text-lg text-muted-foreground">
            Sorry, we couldn't find the page you're looking for. The page might have been moved or deleted.
          </p>
          <Button
            className="rounded-xl bg-cyan-600 hover:bg-cyan-700 transition-colors"
            asChild
          >
            <Link href="/dashboard">
              Return to Dashboard
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}