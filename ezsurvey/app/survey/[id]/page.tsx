"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Star, MessageSquare, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/components/ui/use-toast"

interface Question {
  id: string
  type: string
  question: string
  options: string[]
  required: boolean
}

interface Survey {
  id: string
  title: string
  description: string
  questions: Question[]
  settings: {
    allowAnonymous: boolean
    requireEmail: boolean
  }
  status: 'draft' | 'published' | 'closed'
  theme: {
    colors: {
      background: string
      primary: string
      secondary: string
    }
  }
}

export default function SurveyResponsePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  const [survey, setSurvey] = useState<Survey | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [email, setEmail] = useState("")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const resolvedParams = use(params)

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await fetch(`/api/surveys/${resolvedParams.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch survey")
        }
        const data = await response.json()
        setSurvey(data.survey)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load survey. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSurvey()
  }, [resolvedParams.id, toast])

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < (survey?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    if (!survey || survey.status !== 'published') {
      toast({
        title: "Error",
        description: survey?.status === 'draft' 
          ? "This survey is not published yet." 
          : "This survey is closed and no longer accepting responses.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const answersArray = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer
      }))

      const response = await fetch(`/api/surveys/${resolvedParams.id}/responses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers: answersArray,
          email: survey.settings.requireEmail ? email : undefined,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to submit response")
      }

      setIsSubmitted(true)
      toast({
        title: "Success",
        description: "Your response has been recorded. Thank you!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-cyan-600 border-t-transparent"></div>
          <p className="text-muted-foreground">Loading survey...</p>
        </div>
      </div>
    )
  }

  if (!survey) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Survey Not Found</h1>
          <p className="mt-2 text-muted-foreground">The survey you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  if (survey.status !== 'published') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          
          <h2 className="text-2xl font-bold">{survey.title}</h2>
          {survey.description && (
            <p className="mt-2 text-muted-foreground">{survey.description}</p>
          )}
          <div className="mt-6 rounded-lg border bg-white p-6 shadow-sm">
            <p className="text-lg font-medium">
              {survey.status === 'draft' 
                ? "This survey is not published yet."
                : "This survey is closed and no longer accepting responses."}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {survey.status === 'draft'
                ? "Please check back later when the survey is published."
                : "The survey creator has closed this survey."}
            </p>
          </div>
          <Button onClick={() => router.push("/")} className="mt-6">
            Return Home
          </Button>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center" >
        <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-lg">
          <div className="text-center">
            <h1 className="text-2xl font-bold" >Thank You!</h1>
            <p className="mt-2 text-muted-foreground">Your response has been recorded.</p>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = survey.questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === survey.questions.length - 1

  return (
    <div className="min-h-screen" >
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="mb-6">
            <h1 className="text-xl font-bold" >
              {survey.title}
            </h1>
            {survey.description && (
              <p className="mt-1 text-sm text-muted-foreground">{survey.description}</p>
            )}
          </div>

          <div className="mb-4 flex items-center gap-1">
            {survey.questions.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 flex-1 rounded-full ${
                  index <= currentQuestionIndex 
                    ? `bg-gradient-to-r from-cyan-500 to-cyan-600` 
                    : "bg-slate-200"
                }`}
              />
            ))}
          </div>

          <div className="space-y-8">
            <div className="mb-6">
              <h4 className="mb-4 text-lg font-medium">
                {currentQuestion.question}
                {currentQuestion.required && <span className="ml-1 text-red-500">*</span>}
              </h4>

              {currentQuestion.type === 'text' && (
                <Input
                  placeholder="Type your answer here..."
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                  required={currentQuestion.required}
                />
              )}

              {currentQuestion.type === 'multiple_choice' && (
                <RadioGroup 
                  value={answers[currentQuestion.id] || ''}
                  onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
                  className="space-y-3"
                >
                  {currentQuestion.options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 rounded-lg border p-3 transition-colors hover:bg-slate-50"
                    >
                      <RadioGroupItem value={option} id={`${currentQuestion.id}-${index}`} />
                      <Label htmlFor={`${currentQuestion.id}-${index}`} className="w-full cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {currentQuestion.type === 'single_choice' && (
                <RadioGroup 
                  value={answers[currentQuestion.id] || ''}
                  onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
                  className="space-y-3"
                >
                  {currentQuestion.options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 rounded-lg border p-3 transition-colors hover:bg-slate-50"
                    >
                      <RadioGroupItem value={option} id={`${currentQuestion.id}-${index}`} />
                      <Label htmlFor={`${currentQuestion.id}-${index}`} className="w-full cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {currentQuestion.type === 'rating' && (
                <div className="flex justify-between py-4">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <div key={rating} className="flex flex-col items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className={`h-12 w-12 rounded-full border-slate-200 hover:bg-slate-50 ${
                          answers[currentQuestion.id] === rating.toString() 
                            ? `bg-gradient-to-r from-cyan-500 to-cyan-600 text-white` 
                            : ''
                        }`}
                        onClick={() => handleAnswer(currentQuestion.id, rating.toString())}
                      >
                        <Star className="h-6 w-6" />
                        <span className="sr-only">{rating} stars</span>
                      </Button>
                      <span className="text-xs text-muted-foreground">{rating}</span>
                    </div>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'scale' && (
                <div className="space-y-4">
                  <Slider
                    defaultValue={[5]}
                    max={10}
                    min={1}
                    step={1}
                    value={[parseInt(answers[currentQuestion.id] || '5')]}
                    onValueChange={(value) => handleAnswer(currentQuestion.id, value[0].toString())}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>1</span>
                    <span>5</span>
                    <span>10</span>
                  </div>
                  <div className="text-center text-sm font-medium">
                    Selected: {answers[currentQuestion.id] || '5'}
                  </div>
                </div>
              )}
            </div>

            {survey.settings.requireEmail && isLastQuestion && (
              <div className="space-y-2">
                <Label className="text-lg font-medium" >
                  Email Address
                  <span className="ml-1 text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                variant="outline"
              >
                Previous
              </Button>
              
              {isLastQuestion ? (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !answers[currentQuestion.id]}
                  className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:opacity-90"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!answers[currentQuestion.id]}
                  className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:opacity-90"
                >
                  Next <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 