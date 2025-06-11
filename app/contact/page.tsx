import Link from "next/link"
import { ArrowLeft, Mail, MessageSquare, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/help">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to Help</span>
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-cyan-600" />
              <span className="text-xl font-semibold">MicroSurvey</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-slate-50 py-8">
        <div className="container max-w-2xl px-4 md:px-6">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Contact Support</h1>
            <p className="text-xl text-muted-foreground">
              We're here to help! Send us a message and we'll get back to you as soon as possible.
            </p>
          </div>

          <Card className="rounded-2xl shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-cyan-600" />
                <CardTitle>Send us a message</CardTitle>
              </div>
              <CardDescription>
                Fill out the form below and our support team will respond within 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="What can we help you with?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Issue</SelectItem>
                    <SelectItem value="billing">Billing Question</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="general">General Question</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Please describe your question or issue in detail..." rows={6} />
              </div>

              <Button className="w-full rounded-xl bg-cyan-600 hover:bg-cyan-700 py-6 text-lg">
                <Send className="mr-2 h-5 w-5" />
                Send Message
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                <p>
                  You can also reach us at{" "}
                  <a href="mailto:support@microsurvey.com" className="text-cyan-600 hover:underline">
                    support@microsurvey.com
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Card className="rounded-2xl">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold mb-2">Response Time</h3>
                <p className="text-sm text-muted-foreground">
                  We typically respond within 24 hours during business days
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold mb-2">Business Hours</h3>
                <p className="text-sm text-muted-foreground">Monday - Friday, 9 AM - 6 PM EST</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
