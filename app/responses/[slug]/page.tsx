"use client";

import Link from "next/link"
import { ArrowLeft, Download, MessageSquare, Trash2 } from "lucide-react"
import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResponseSummary } from "@/components/survey/response-summary"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Survey {
  id: string;
  title: string;
  description: string;
  totalResponses: number;
  lastResponseAt?: Date;
}

interface Response {
  id: string;
  answers: {
    questionId: string;
    question: string;
    type: string;
    answer: string;
  }[];
  email?: string;
  metadata?: {
    userAgent?: string;
    ip?: string;
  };
  submittedAt: Date;
}

export default function ResponsesPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [responseToDelete, setResponseToDelete] = useState<string | null>(null);
  const resolvedParams = use(params);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/surveys/${resolvedParams.slug}/responses`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Survey not found");
          }
          throw new Error(`Failed to fetch survey responses: ${response.statusText}`);
        }
        const data = await response.json();
        
        // Validate survey data
        if (!data.survey || !data.survey.id || !data.survey.title) {
          throw new Error("Invalid survey data received");
        }
        
        // Validate responses data
        if (!Array.isArray(data.responses)) {
          throw new Error("Invalid responses data received");
        }

        setSurvey(data.survey);
        setResponses(data.responses || []); // Ensure responses is always an array
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        
        // If survey not found, redirect to dashboard after a short delay
        if (errorMessage === "Survey not found") {
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.slug, toast, router]);

  const handleDownloadCSV = () => {
    if (!responses.length) return;

    // Create CSV header
    const headers = ['Date', 'Email', ...responses[0].answers.map(a => a.question)];
    const csvContent = [
      headers.join(','),
      ...responses.map(response => {
        const row = [
          new Date(response.submittedAt).toLocaleDateString(),
          response.email || 'Anonymous',
          ...response.answers.map(a => `"${a.answer.replace(/"/g, '""')}"`)
        ];
        return row.join(',');
      })
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${survey?.title || 'survey'}-responses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteResponse = async (responseId: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/surveys/${resolvedParams.slug}/responses/${responseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete response');
      }

      // Update local state
      setResponses(prev => prev.filter(r => r.id !== responseId));
      setSurvey(prev => prev ? {
        ...prev,
        totalResponses: prev.totalResponses - 1
      } : null);

      toast({
        title: "Success",
        description: "Response deleted successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setResponseToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-cyan-600 border-t-transparent"></div>
          <p className="text-muted-foreground">Loading responses...</p>
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-bold">Survey Not Found</h2>
          <p className="text-muted-foreground">The survey you're looking for doesn't exist or has been removed.</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const hasResponses = responses.length > 0;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-cyan-600" />
            <Link href="/" className="text-xl font-semibold">
              MicroSurvey
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-slate-50 py-8">
        <div className="container px-4 md:px-6">
          <div className="mb-6 flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{survey.title}</h1>
              <p className="text-sm text-muted-foreground">
                {survey.totalResponses} responses • Last response {survey.lastResponseAt ? new Date(survey.lastResponseAt).toLocaleDateString() : 'Never'}
              </p>
            </div>
            {hasResponses && (
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-auto"
                onClick={handleDownloadCSV}
              >
                <Download className="mr-2 h-4 w-4" /> Download CSV
              </Button>
            )}
          </div>

          {!hasResponses ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">No Responses Yet</h3>
                <p className="text-center text-muted-foreground">
                  This survey hasn't received any responses yet. Share your survey to start collecting responses.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="summary" className="space-y-4">
              <TabsList>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="responses">All Responses</TabsTrigger>
              </TabsList>
              <TabsContent value="summary" className="space-y-4">
                <ResponseSummary responses={responses} />
              </TabsContent>
              <TabsContent value="responses">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Individual Responses</CardTitle>
                    <CardDescription>View all individual responses to your survey.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead className="hidden md:table-cell">Answers</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {responses.map((response) => (
                          <TableRow key={response.id}>
                            <TableCell className="font-medium">
                              {new Date(response.submittedAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{response.email || 'Anonymous'}</TableCell>
                            <TableCell className="hidden max-w-xs truncate md:table-cell">
                              {response.answers.map((answer, index) => (
                                <div key={answer.questionId} className="mb-2">
                                  <p className="font-medium">{answer.question}</p>
                                  <p className="text-muted-foreground">{answer.answer}</p>
                                </div>
                              ))}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setResponseToDelete(response.id)}
                                disabled={isDeleting}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                                <span className="sr-only">Delete response</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>

      <AlertDialog open={!!responseToDelete} onOpenChange={() => setResponseToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Response</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this response? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => responseToDelete && handleDeleteResponse(responseToDelete)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
