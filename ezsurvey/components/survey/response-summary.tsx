"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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

interface ResponseSummaryProps {
  responses: Response[]
}

export function ResponseSummary({ responses }: ResponseSummaryProps) {
  // Group answers by question
  const questionAnswers = responses.reduce((acc, response) => {
    response.answers.forEach(answer => {
      if (!acc[answer.questionId]) {
        acc[answer.questionId] = {
          question: answer.question,
          type: answer.type,
          answers: []
        };
      }
      acc[answer.questionId].answers.push(answer.answer);
    });
    return acc;
  }, {} as Record<string, { question: string; type: string; answers: string[] }>);

  // Calculate answer distributions for each question
  const answerDistributions = Object.entries(questionAnswers).map(([questionId, data]) => {
    const answerCounts = data.answers.reduce((acc, answer) => {
      acc[answer] = (acc[answer] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      questionId,
      question: data.question,
      type: data.type,
      distribution: Object.entries(answerCounts).map(([answer, count]) => ({
        answer,
        count,
        percentage: (count / data.answers.length) * 100
      }))
    };
  });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Response Overview</CardTitle>
          <CardDescription>Summary of all collected responses.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">Total Responses</div>
                <div className="text-2xl font-bold">{responses.length}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">Questions Answered</div>
                <div className="text-2xl font-bold">
                  {Object.keys(questionAnswers).length}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Answer Distribution</CardTitle>
          <CardDescription>How respondents answered each question.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {answerDistributions.map((question) => (
              <div key={question.questionId} className="space-y-2">
                <h3 className="font-medium">{question.question}</h3>
                <div className="space-y-2">
                  {question.distribution.map((dist) => (
                    <div key={dist.answer} className="flex items-center justify-between">
                      <span className="text-sm">{dist.answer}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-slate-100">
                          <div
                            className="h-2 rounded-full bg-cyan-600"
                            style={{
                              width: `${dist.percentage}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {dist.count} ({dist.percentage.toFixed(0)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
