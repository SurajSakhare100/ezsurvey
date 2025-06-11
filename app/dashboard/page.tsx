"use client";

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Edit, MessageSquare, Plus, Share2, Trash2, BarChart2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

import { Badge } from "@/components/ui/badge"
import DeleteSurveyModal from "@/components/survey/DeleteSurveyModal";
import CreateSurveyModal from "@/components/survey/CreateSurveyModal";

interface Survey {
  _id: string;
  title: string;
  description?: string;
  createdAt: string;
  status: "draft" | "published" | "closed";
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    surveyId: string;
    surveyTitle: string;
    isDeleting: boolean;
  }>({
    isOpen: false,
    surveyId: "",
    surveyTitle: "",
    isDeleting: false,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch("/api/surveys");
        if (!response.ok) {
          throw new Error("Failed to fetch surveys");
        }
        const data = await response.json();
        setSurveys(data.surveys);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load surveys. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchSurveys();
    }
  }, [status, toast]);

  const handleDeleteClick = (survey: Survey) => {
    setDeleteModalState({
      isOpen: true,
      surveyId: survey._id,
      surveyTitle: survey.title,
      isDeleting: false,
    });
  };

  const handleDeleteConfirm = async () => {
    setDeleteModalState(prev => ({ ...prev, isDeleting: true }));

    try {
      const response = await fetch(`/api/surveys/${deleteModalState.surveyId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete survey");
      }

      setSurveys(surveys.filter(survey => survey._id !== deleteModalState.surveyId));
      toast({
        title: "Success",
        description: "Survey deleted successfully",
      });
      setDeleteModalState(prev => ({ ...prev, isOpen: false }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete survey. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleteModalState(prev => ({ ...prev, isDeleting: false }));
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-cyan-600 border-t-transparent"></div>
          <p className="text-muted-foreground">Loading surveys...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-cyan-600" />
            <Link href="/" className="text-xl font-semibold">
              MicroSurvey
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button size="sm" variant="ghost" asChild>
              <Link href="/templates">Templates</Link>
            </Button>
            <Button size="sm" variant="ghost" asChild>
              <Link href="/settings">Settings</Link>
            </Button>
            <Button size="sm" variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
              Log out
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-slate-50 py-8">
        <div className="container px-4 md:px-6">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Your Surveys</h1>
              <p className="mt-1 text-muted-foreground">
                Create and manage your surveys
              </p>
            </div>
            <Button 
              className="rounded-xl bg-cyan-600 hover:bg-cyan-700 transition-colors"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> New Survey
            </Button>
          </div>

          {surveys.length === 0 ? (
            <div className="mt-12 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-100">
                <MessageSquare className="h-10 w-10 text-cyan-600" />
              </div>
              <h2 className="text-2xl font-semibold">No surveys yet</h2>
              <p className="mt-2 text-muted-foreground mb-6">
                Create your first survey to start collecting responses
              </p>
              <Button 
                className="rounded-xl bg-cyan-600 hover:bg-cyan-700 transition-colors"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" /> Create Your First Survey
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {surveys.map((survey) => (
                <Card key={survey._id} className="group overflow-hidden rounded-2xl border-slate-200 transition-all hover:shadow-md">
                  <CardHeader className="bg-white pb-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg line-clamp-1">{survey.title}</CardTitle>
                        <CardDescription>
                          Created {new Date(survey.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`${
                          survey.status === "draft" ? "border-yellow-200 bg-yellow-50 text-yellow-700" :
                          survey.status === "published" ? "border-green-200 bg-green-50 text-green-700" :
                          "border-red-200 bg-red-50 text-red-700"
                        }`}
                      >
                        {survey.status.charAt(0).toUpperCase() + survey.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {survey.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {survey.description}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between border-t bg-slate-50/50 px-6 py-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100" asChild>
                        <Link href={`/responses/${survey._id}`}>
                          <BarChart2 className="h-4 w-4" />
                          <span className="sr-only">View Responses</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100" asChild>
                        <Link href={`/survey/edit/${survey._id}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit Survey</span>
                        </Link>
                      </Button>
                    </div>
                    <div className="flex gap-1 items-center justify-end">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100" asChild>
                        <Link href={`/survey/${survey._id}`}>
                          <Share2 className="h-4 w-4" />
                          <span className="sr-only">Share Survey</span>
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleDeleteClick(survey)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete Survey</span>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <CreateSurveyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <DeleteSurveyModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleDeleteConfirm}
        surveyTitle={deleteModalState.surveyTitle}
        isDeleting={deleteModalState.isDeleting}
      />
    </div>
  )
}
