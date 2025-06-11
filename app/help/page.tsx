import Link from "next/link"
import { ArrowLeft, Book, HelpCircle, MessageSquare, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I create my first survey?",
      answer:
        "Click the 'New Survey' button from your dashboard, add your questions, and publish. It takes less than 60 seconds!",
    },
    {
      question: "Can I customize the look of my surveys?",
      answer:
        "Yes! You can customize colors, fonts, and branding to match your style. Premium themes are also available.",
    },
    {
      question: "How many responses can I collect?",
      answer:
        "There's no limit! With your one-time purchase, you can collect unlimited responses across all your surveys.",
    },
    {
      question: "Can I export my survey data?",
      answer: "You can export your responses to CSV or Excel format for further analysis.",
    },
    {
      question: "Is there a mobile app?",
      answer: "MicroSurvey works perfectly in any web browser on mobile devices. No app download required!",
    },
    {
      question: "How do I share my surveys?",
      answer:
        "Each survey gets a unique link that you can share anywhere - email, social media, or embed on your website.",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to Dashboard</span>
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-cyan-600" />
              <span className="text-xl font-semibold">MicroSurvey</span>
            </div>
          </div>
          <Button size="sm" variant="outline" asChild>
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 bg-slate-50 py-8">
        <div className="container max-w-4xl px-4 md:px-6">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-4">How can we help?</h1>
            <p className="text-xl text-muted-foreground mb-6">Find answers to common questions and get support</p>

            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search for help..."
                className="pl-10 rounded-xl border-2 py-6 text-lg focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-12">
            <Card className="rounded-2xl border-2 border-cyan-100 bg-gradient-to-br from-cyan-50 to-white">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100">
                  <Book className="h-6 w-6 text-cyan-600" />
                </div>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>Learn the basics of creating and managing surveys</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/help/getting-started">View Guide</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <HelpCircle className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>FAQ</CardTitle>
                <CardDescription>Quick answers to the most common questions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Browse FAQ
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-2 border-green-100 bg-gradient-to-br from-green-50 to-white">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>Get personalized help from our support team</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/contact">Get Help</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find quick answers to common questions about MicroSurvey</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
