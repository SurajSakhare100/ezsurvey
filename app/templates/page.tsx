'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Plus, Loader2 } from "lucide-react";

interface Template {
  _id: string;
  name: string;
  description: string;
  category: string;
  questions: any[];
  settings: any;
}

export default function TemplatesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loadingTemplateId, setLoadingTemplateId] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'customer_satisfaction', name: 'Customer Satisfaction' },
    { id: 'employee_feedback', name: 'Employee Feedback' },
    { id: 'market_research', name: 'Market Research' },
    { id: 'product_feedback', name: 'Product Feedback' },
    { id: 'nps', name: 'Net Promoter Score' },
    { id: 'event_feedback', name: 'Event Feedback' },
    { id: 'user_experience', name: 'User Experience' },
    { id: 'training_evaluation', name: 'Training Evaluation' },
    { id: 'demographic', name: 'Demographic' },
    { id: 'exit_survey', name: 'Exit Survey' }
  ];

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/templates');
        if (!response.ok) {
          throw new Error('Failed to fetch templates');
        }
        const data = await response.json();
        setTemplates(data.templates);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter(template => template.category === selectedCategory);

  const handleTemplateSelect = async (template: Template) => {
    if (!session) {
      toast({
        title: "Error",
        description: "You must be logged in to create a survey",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoadingTemplateId(template._id);
      // Create a new survey from the template
      const response = await fetch('/api/surveys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: template.name,
          description: template.description,
          questions: template.questions.map(q => ({
            question: q.question,
            type: q.type,
            options: q.type === 'rating' ? ['1', '2', '3', '4', '5'] : (q.options || []),
            required: true
          })),
          settings: {
            allowAnonymous: template.settings?.allowAnonymous || false,
            requireEmail: template.settings?.requireEmail ?? true,
            limitResponses: template.settings?.limitResponses || false,
            maxResponses: template.settings?.maxResponses || 100
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create survey from template');
      }

      const data = await response.json();
      toast({
        title: "Success",
        description: "Survey created from template successfully!",
      });
      
      // Navigate to the edit page
      router.push(`/survey/edit/${data.survey.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to create survey from template',
        variant: "destructive"
      });
    } finally {
      setLoadingTemplateId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-cyan-600 border-t-transparent"></div>
          <p className="text-muted-foreground">Loading templates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 rounded-full bg-red-100 p-3">
            <MessageSquare className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-2xl font-semibold">Error Loading Templates</h2>
          <p className="mt-2 text-muted-foreground">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container px-4 md:px-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Survey Templates</h1>
          <p className="mt-2 text-muted-foreground">
            Choose from our pre-built templates or start from scratch
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="rounded-full"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card key={template._id} className="group overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{template.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {template.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="rounded-full">
                    {template.questions.length} questions
                  </Badge>
                  <Badge variant="outline" className="rounded-full capitalize">
                    {template.category.replace(/_/g, ' ')}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button
                  className="w-full rounded-xl bg-cyan-600 hover:bg-cyan-700 transition-colors"
                  onClick={() => handleTemplateSelect(template)}
                  disabled={loadingTemplateId === template._id}
                >
                  {loadingTemplateId === template._id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Use Template
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="mt-12 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
              <MessageSquare className="h-10 w-10 text-slate-600" />
            </div>
            <h2 className="text-2xl font-semibold">No templates found</h2>
            <p className="mt-2 text-muted-foreground">
              No templates available in this category. Try selecting a different category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 