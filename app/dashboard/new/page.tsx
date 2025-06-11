"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ChevronDown, Grip, MessageSquare, Plus, Save, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { SurveyPreview } from "@/components/survey/survey-preview"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

export default function NewSurveyPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState("New Survey")
  const [description, setDescription] = useState("")
  const [questions, setQuestions] = useState<{
    id: string;
    type: string;
    question: string;
    options: string[];
  }[]>([
    { id: "1", type: "text", question: "What's your feedback?", options: [] },
  ])

  const addQuestion = () => {
    const newId = (questions.length + 1).toString()
    setQuestions([...questions, { id: newId, type: "text", question: "", options: [] }])
  }

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id))
    }
  }

  const updateQuestion = (id: string, field: string, value: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === id) {
          return { ...q, [field]: value }
        }
        return q
      }),
    )
  }

  const updateQuestionType = (id: string, type: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === id) {
          // Initialize options array for multiple         choice
          const options = type === "multiple_choice" ? ["Option 1", "Option 2", "Option 3"] : []
          return { ...q, type, options }
        }
        return q
      }),
    )
  }

  const updateOption = (questionId: string, index: number, value: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const newOptions = [...q.options]
          newOptions[index] = value
          return { ...q, options: newOptions }
        }
        return q
      }),
    )
  }

  const addOption = (questionId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return { ...q, options: [...q.options, `Option ${q.options.length + 1}`] }
        }
        return q
      }),
    )
  }

  const removeOption = (questionId: string, index: number) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId && q.options.length > 2) {
          const newOptions = [...q.options]
          newOptions.splice(index, 1)
          return { ...q, options: newOptions }
        }
        return q
      }),
    )
  }

  const handleSubmit = async () => {
    // Validate form
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a survey title",
        variant: "destructive"
      })
      return
    }

    const hasEmptyQuestions = questions.some(q => !q.question.trim())
    if (hasEmptyQuestions) {
      toast({
        title: "Error",
        description: "Please fill in all questions",
        variant: "destructive"
      })
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch('/api/surveys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          questions: questions.map(q => ({
            question: q.question,
            type: q.type,
            options: q.options,
            required: true
          }))
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create survey')
      }

      toast({
        title: "Success",
        description: "Survey created successfully!",
      })

      router.push(`/survey/${data.survey.id}`)

    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to create survey',
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

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
              <MessageSquare className={`h-6 w-6 text-gradient bg-gradient-to-r `} />
              <span className="text-xl font-semibold">MicroSurvey</span>
            </div>
            <Badge variant="secondary" className="ml-2">
              New Survey
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard">Cancel</Link>
            </Button>
            <Button 
              size="sm" 
              className={`bg-gradient-to-r  hover:opacity-90`}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Creating..." : "Create Survey"}
            </Button>
          </div>
        </div>
      </header>

      <main className={`flex-1  py-8`}>
        <div className="container grid gap-8 px-4 md:grid-cols-2 md:px-6">
          <div className="space-y-6">
            <div className="rounded-2xl border bg-white p-6 shadow-md">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-medium">Survey Details</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Survey Title</Label>
                  <Input 
                    id="title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    className="mt-1" 
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1"
                    placeholder="Add a brief description of your survey..."
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-md">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-medium">Questions</h2>
                <Button
                  onClick={addQuestion}
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                >
                  <Plus className="mr-1 h-4 w-4" /> Add Question
                </Button>
              </div>

              <div className="space-y-6">
                {questions.map((question, index) => (
                  <Card key={question.id} className="relative border-slate-200">
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <Grip className="h-4 w-4" />
                        <span>Question {index + 1}</span>
                        {questions.length > 1 && (
                          <Button
                            onClick={() => removeQuestion(question.id)}
                            variant="ghost"
                            size="icon"
                            className="ml-auto h-6 w-6 text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove Question</span>
                          </Button>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`question-${question.id}`}>Question</Label>
                          <Input
                            id={`question-${question.id}`}
                            value={question.question}
                            onChange={(e) => updateQuestion(question.id, "question", e.target.value)}
                            className="mt-1"
                            placeholder="Enter your question..."
                          />
                        </div>

                        <div>
                          <Label htmlFor={`type-${question.id}`}>Question Type</Label>
                          <Select
                            value={question.type}
                            onValueChange={(value) => updateQuestionType(question.id, value)}
                          >
                            <SelectTrigger id={`type-${question.id}`} className="mt-1">
                              <SelectValue placeholder="Select question type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Short Text</SelectItem>
                              <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                              <SelectItem value="single_choice">Single Choice</SelectItem>
                              <SelectItem value="rating">Rating (1-5)</SelectItem>
                              <SelectItem value="scale">Scale (1-10)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {(question.type === "multiple_choice" || question.type === "single_choice" || question.type === "scale") && (
                          <div className="space-y-2">
                            <Label>Options</Label>
                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center gap-2">
                                <Input
                                  value={option}
                                  onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                                  placeholder={`Option ${optionIndex + 1}`}
                                />
                                {question.options.length > 2 && (
                                  <Button
                                    onClick={() => removeOption(question.id, optionIndex)}
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-500 hover:text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Remove Option</span>
                                  </Button>
                                )}
                              </div>
                            ))}
                            <Button onClick={() => addOption(question.id)} variant="outline" size="sm" className="mt-2">
                              <Plus className="mr-1 h-3 w-3" /> Add Option
                            </Button>
                          </div>
                        )}

                        {question.type === "rating" && (
                          <div className="space-y-2">
                            <Label>Rating Scale</Label>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>1</span>
                              <span>2</span>
                              <span>3</span>
                              <span>4</span>
                              <span>5</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Rating questions use a fixed 1-5 scale
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="sticky top-8 h-fit rounded-2xl border bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-medium">Live Preview</h2>
            </div>
            <div className="rounded-xl border">
              <SurveyPreview 
                title={title} 
                description={description} 
                questions={questions} 
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
