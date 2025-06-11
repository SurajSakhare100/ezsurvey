"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { ArrowLeft, ChevronDown, Grip, MessageSquare, Plus, Save, Trash2, Type } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { SurveyPreview } from "@/components/survey/survey-preview"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"

interface Question {
  id: string;
  type: string;
  question: string;
  options: string[];
}

interface Survey {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  settings: {
    allowAnonymous: boolean;
    requireEmail: boolean;
    limitResponses: number;
  };
  status: 'draft' | 'published' | 'closed';
}

export default function EditSurveyPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [settings, setSettings] = useState({
    allowAnonymous: false,
    requireEmail: false,
    limitResponses: 0,
  });
  const [surveyStatus, setSurveyStatus] = useState<'draft' | 'published' | 'closed'>('draft');

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/login");
    }
  }, [sessionStatus, router]);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await fetch(`/api/surveys/${resolvedParams.slug}`);
        if (!response.ok) {
          throw new Error("Failed to fetch survey");
        }
        const data = await response.json();
        setTitle(data.survey.title);
        setDescription(data.survey.description);
        setQuestions(data.survey.questions);
        setSettings(data.survey.settings);
        setSurveyStatus(data.survey.status);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load survey. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (sessionStatus === "authenticated") {
      fetchSurvey();
    }
  }, [resolvedParams.slug, sessionStatus, toast, router]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/surveys/${resolvedParams.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          questions,
          settings,
          status: surveyStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save survey");
      }

      toast({
        title: "Success",
        description: "Survey saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save survey. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addQuestion = () => {
    const newId = (questions.length + 1).toString();
    setQuestions([...questions, { id: newId, type: "text", question: "", options: [] }]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const updateQuestion = (id: string, field: string, value: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === id) {
          return { ...q, [field]: value };
        }
        return q;
      }),
    );
  };

  const updateQuestionType = (id: string, type: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === id) {
          let options: string[] = [];
          switch (type) {
            case 'multiple_choice':
            case 'single_choice':
              options = ['Option 1', 'Option 2', 'Option 3'];
              break;
            case 'rating':
              options = ['1', '2', '3', '4', '5'];
              break;
            case 'scale':
              options = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
              break;
            default:
              options = [];
          }
          return { ...q, type, options };
        }
        return q;
      }),
    );
  };

  const updateOption = (questionId: string, index: number, value: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const newOptions = [...q.options];
          newOptions[index] = value;
          return { ...q, options: newOptions };
        }
        return q;
      }),
    );
  };

  const addOption = (questionId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return { ...q, options: [...q.options, `Option ${q.options.length + 1}`] };
        }
        return q;
      }),
    );
  };

  const removeOption = (questionId: string, index: number) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId && q.options.length > 2) {
          const newOptions = [...q.options];
          newOptions.splice(index, 1);
          return { ...q, options: newOptions };
        }
        return q;
      }),
    );
  };

  if (sessionStatus === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-cyan-600 border-t-transparent"></div>
          <p className="text-muted-foreground">Loading survey...</p>
        </div>
      </div>
    );
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
           
            <Badge variant="secondary" className="ml-2">
              Editing
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard">Cancel</Link>
            </Button>
            <Select
              value={surveyStatus}
              onValueChange={(value: 'draft' | 'published' | 'closed') => setSurveyStatus(value)}
            >
              <SelectTrigger className="w-[140px]">
                <div className="flex items-center gap-2">
                  <SelectValue placeholder="Select status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                    Draft
                  </div>
                </SelectItem>
                <SelectItem value="published">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    Published
                  </div>
                </SelectItem>
                <SelectItem value="closed">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                    Closed
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <Button 
              size="sm" 
              className={`bg-gradient-to-r hover:opacity-90`}
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Changes"}
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

            <div className="rounded-2xl border bg-white p-6 shadow-md">
              <h2 className="mb-4 text-lg font-medium">Survey Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Allow Anonymous Responses</Label>
                    <p className="text-xs text-muted-foreground">Let people respond without providing their name</p>
                  </div>
                  <Switch
                    checked={settings.allowAnonymous}
                    onCheckedChange={(checked) => setSettings({ ...settings, allowAnonymous: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">Get notified when someone responds</p>
                  </div>
                  <Switch
                    checked={settings.requireEmail}
                    onCheckedChange={(checked) => setSettings({ ...settings, requireEmail: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Survey Status</Label>
                    <p className="text-xs text-muted-foreground">Control who can access your survey</p>
                  </div>
                  <Select
                    value={surveyStatus}
                    onValueChange={(value: 'draft' | 'published' | 'closed') => setSurveyStatus(value)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <div className="flex items-center gap-2">
                        <SelectValue placeholder="Select status" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                          Draft
                        </div>
                      </SelectItem>
                      <SelectItem value="published">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-green-500"></span>
                          Published
                        </div>
                      </SelectItem>
                      <SelectItem value="closed">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-red-500"></span>
                          Closed
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
  );
}
