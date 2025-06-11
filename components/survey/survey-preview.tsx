"use client"

import { useState } from "react"
import { ChevronRight, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"

interface Question {
  id: string
  type: string
  question: string
  options: string[]
}

interface SurveyPreviewProps {
  title: string
  description: string
  questions: Question[]
}

export function SurveyPreview({ title, description, questions }: SurveyPreviewProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setCompleted(true)
    }
  }

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h3 className="mb-2 text-xl font-bold">Thank you!</h3>
        <p className="text-muted-foreground">Your response has been recorded.</p>
        <Button
          onClick={() => {
            setCurrentStep(0)
            setCompleted(false)
            setAnswers({})
          }}
          variant="outline"
          className="mt-4"
        >
          Start Over
        </Button>
      </div>
    )
  }

  const currentQuestion = questions[currentStep]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold">{title || "Survey Title"}</h3>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>

      <div className="mb-4 flex items-center gap-1">
        {questions.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 flex-1 rounded-full ${
              index <= currentStep 
                ? `bg-gradient-to-r ` 
                : "bg-slate-200"
            }`}
          />
        ))}
      </div>

      <div className="mb-6">
        <h4 className="mb-4 text-lg font-medium">{currentQuestion?.question || "Question"}</h4>

        {currentQuestion?.type === "text" && (
          <Input 
            placeholder="Type your answer here..." 
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
          />
        )}

        {currentQuestion?.type === "textarea" && (
          <Textarea 
            placeholder="Type your answer here..." 
            rows={4}
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
          />
        )}

        {currentQuestion?.type === "rating" && (
          <div className="flex justify-between py-4">
            {[1, 2, 3, 4, 5].map((rating) => (
              <div key={rating} className="flex flex-col items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className={`h-12 w-12 rounded-full border-slate-200 hover:bg-slate-50 ${
                    answers[currentQuestion.id] === rating.toString() 
                      ? `bg-gradient-to-r text-white` 
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

        {currentQuestion?.type === "scale" && (
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

        {(currentQuestion?.type === "multiple_choice" || currentQuestion?.type === "single_choice") && (
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
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleNext} 
          className={`rounded-xl bg-gradient-to-r  hover:opacity-90`}
          disabled={!answers[currentQuestion.id]}
        >
          {currentStep < questions.length - 1 ? (
            <>
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </div>
  )
}
