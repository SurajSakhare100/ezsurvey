import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import Survey from '@/models/Survey';
import Response from '@/models/Response';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';

interface Question {
  id: string;
  type: string;
  question: string;
  options?: string[];
  required: boolean;
  order: number;
}

interface SurveyResponse {
  questionId: string;
  answer: string;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;

    // Validate survey ID
    if (!mongoose.Types.ObjectId.isValid(resolvedParams.id)) {
      return NextResponse.json(
        { message: 'Invalid survey ID' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the survey and verify ownership
    const survey = await Survey.findOne({
      _id: resolvedParams.id,
      createdBy: session.user.id
    });

    if (!survey) {
      return NextResponse.json(
        { message: 'Survey not found' },
        { status: 404 }
      );
    }

    // Get all responses for this survey
    const responses = await Response.find({ surveyId: resolvedParams.id })
      .sort({ createdAt: -1 });

    // Get question details for better response display
    const questionMap = new Map<string, Question>(
      survey.questions.map((q: Question) => [q.id, q])
    );

    // Format responses with question details
    const formattedResponses = responses.map(response => {
      // Ensure answers is an array
      const answers = Array.isArray(response.answers) ? response.answers : [];
      
      return {
        id: response._id,
        answers: answers.map((answer: { questionId: string; answer: string }) => ({
          questionId: answer.questionId,
          question: questionMap.get(answer.questionId)?.question || 'Unknown Question',
          type: questionMap.get(answer.questionId)?.type || 'text',
          answer: answer.answer
        })),
        email: response.email,
        metadata: response.metadata,
        submittedAt: response.createdAt
      };
    });

    return NextResponse.json({
      responses: formattedResponses,
      survey: {
        id: survey._id,
        title: survey.title,
        description: survey.description,
        totalResponses: survey.analytics?.totalResponses || 0,
        lastResponseAt: survey.analytics?.lastResponseAt
      }
    });
  } catch (error) {
    console.error('Error fetching responses:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;

    // Validate survey ID
    if (!mongoose.Types.ObjectId.isValid(resolvedParams.id)) {
      return NextResponse.json(
        { message: 'Invalid survey ID' },
        { status: 400 }
      );
    }

    const body = await req.json();

    // Validate required fields
    if (!body.answers || !Array.isArray(body.answers)) {
      return NextResponse.json(
        { message: 'Answers are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the survey
    const survey = await Survey.findById(resolvedParams.id);
    if (!survey) {
      return NextResponse.json(
        { message: 'Survey not found' },
        { status: 404 }
      );
    }

    // Check if survey is closed
    if (survey.status === 'closed') {
      return NextResponse.json(
        { message: 'This survey is no longer accepting responses' },
        { status: 400 }
      );
    }

    // Check if response limit is reached
    if (survey.settings.limitResponses && survey.settings.maxResponses) {
      const responseCount = await Response.countDocuments({ surveyId: resolvedParams.id });
      if (responseCount >= survey.settings.maxResponses) {
        return NextResponse.json(
          { message: 'This survey has reached its response limit' },
          { status: 400 }
        );
      }
    }

    // Validate responses against survey questions
    const questionIds = new Set(survey.questions.map((q: Question) => q.id));
    const responseQuestionIds = new Set(body.answers.map((r: SurveyResponse) => r.questionId));

    // Check if all responses are for valid questions
    for (const questionId of responseQuestionIds) {
      if (!questionIds.has(questionId)) {
        return NextResponse.json(
          { message: `Invalid question ID: ${questionId}` },
          { status: 400 }
        );
      }
    }

    // Check for required questions
    const requiredQuestions = survey.questions.filter((q: Question) => q.required);
    const answeredQuestionIds = new Set(body.answers.map((r: SurveyResponse) => r.questionId));

    const missingRequiredQuestions = requiredQuestions.filter(
      (q: Question) => !answeredQuestionIds.has(q.id)
    );

    if (missingRequiredQuestions.length > 0) {
      return NextResponse.json(
        { 
          message: 'Missing answers for required questions',
          missingQuestions: missingRequiredQuestions.map((q: Question) => q.question)
        },
        { status: 400 }
      );
    }

    // Create the response
    const response = new Response({
      surveyId: resolvedParams.id,
      answers: body.answers,
      email: body.email,
      metadata: {
        userAgent: req.headers.get('user-agent') || undefined,
        ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined
      }
    });

    await response.save();

    // Update survey analytics
    await Survey.findByIdAndUpdate(resolvedParams.id, {
      $inc: { 'analytics.totalResponses': 1 },
      $set: { 'analytics.lastResponseAt': new Date() }
    });

    return NextResponse.json({ 
      message: 'Response submitted successfully',
      responseId: response._id
    });
  } catch (error) {
    console.error('Error submitting response:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 
