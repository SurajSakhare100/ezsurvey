"use client"

import { useState } from "react"
import { CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { ConfettiAnimation } from "../home/confetti-animation"

export function DemoSurvey() {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const questions = [
    {
      type: "text",
      question: "What's your biggest challenge with collecting feedback?",
      placeholder: "Type your answer here...",
    },
    {
      type: "rating",
      question: "How important is customer feedback to your business?",
      options: ["Not important", "Slightly important", "Moderately important", "Very important", "Extremely important"],
    },
    {
      type: "textarea",
      question: "What features would make collecting feedback easier for you?",
      placeholder: "Share your thoughts...",
    },
  ]

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1)
    } else {
      setSubmitted(true)
      setShowConfetti(true)
      // Hide confetti after 3 seconds
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center relative">
        <ConfettiAnimation trigger={showConfetti} />
        <div className="mb-6 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 p-4 animate-bounce">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h3 className="mb-3 text-2xl font-bold animate-fade-in">Thank you for your feedback!</h3>
        <p className="mb-8 text-muted-foreground max-w-md animate-fade-in-delay">
          Your responses help us improve MicroSurvey. This is exactly how your surveys will look and feel.
        </p>
        <Button
          onClick={() => {
            setStep(0)
            setSubmitted(false)
            setShowConfetti(false)
          }}
          variant="outline"
          className="rounded-xl animate-fade-in-delay-2"
        >
          Try Again
        </Button>
      </div>
    )
  }

  const currentQuestion = questions[step]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Quick Feedback Demo</h3>
        <p className="text-muted-foreground">Experience MicroSurvey in action</p>
      </div>

      <div className="flex items-center gap-2">
        {questions.map((_, index) => (
          <div
            key={index}
            className={`h-2 flex-1 rounded-full transition-all duration-300 ${index <= step ? "bg-gradient-to-r from-cyan-600 to-blue-600" : "bg-slate-200"}`}
          />
        ))}
      </div>

      <div className="space-y-6">
        <h4 className="text-xl font-semibold">{currentQuestion.question}</h4>

        {currentQuestion.type === "text" && (
          <Input
            placeholder={currentQuestion.placeholder}
            className="rounded-xl border-2 py-6 text-lg focus:border-cyan-500"
          />
        )}

        {currentQuestion.type === "textarea" && (
          <Textarea
            placeholder={currentQuestion.placeholder}
            rows={4}
            className="rounded-xl border-2 text-lg focus:border-cyan-500"
          />
        )}

        {currentQuestion.type === "rating" && (
          <RadioGroup defaultValue="moderately important" className="space-y-3">
            {currentQuestion?.options?.map((option, index) => (
              <div key={index} className="group">
                <div className="flex items-center space-x-3 rounded-xl border-2 p-4 transition-all hover:border-cyan-200 hover:bg-cyan-50/50 has-[:checked]:border-cyan-500 has-[:checked]:bg-cyan-50">
                  <RadioGroupItem value={option.toLowerCase()} id={`option-${index}`} className="border-2" />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer font-medium">
                    {option}
                  </Label>
                </div>
              </div>
            ))}
          </RadioGroup>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          className="rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-8 py-6 text-lg font-medium shadow-lg transition-all hover:shadow-xl hover:scale-105"
        >
          {step < questions.length - 1 ? "Next Question" : "Submit Feedback"}
        </Button>
      </div>
      <ConfettiAnimation trigger={showConfetti} />
    </div>
  )
}
