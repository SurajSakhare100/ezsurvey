import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Survey from '@/models/Survey';
import mongoose from 'mongoose';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, description, questions, settings, theme } = body;

    // Validate required fields
    if (!title?.trim()) {
      return NextResponse.json(
        { message: 'Title is required' },
        { status: 400 }
      );
    }

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { message: 'At least one question is required' },
        { status: 400 }
      );
    }

    // Validate questions
    for (const question of questions) {
      if (!question.type || !question.question?.trim()) {
        return NextResponse.json(
          { message: 'Each question must have a type and question text' },
          { status: 400 }
        );
      }

      if (['multiple_choice', 'single_choice'].includes(question.type)) {
        if (!question.options || !Array.isArray(question.options) || question.options.length < 2) {
          return NextResponse.json(
            { message: `Question "${question.question}" requires at least 2 options` },
            { status: 400 }
          );
        }
      }

      if (['rating', 'scale'].includes(question.type)) {
        if (!question.options || !Array.isArray(question.options) || question.options.length === 0) {
          question.options = ['1', '2', '3', '4', '5'];
        }
      }
    }



    await connectDB();

    const survey = await Survey.create({
      title: title.trim(),
      description: description?.trim(),
      questions: questions.map((q: any, index: number) => ({
        ...q,
        id: new mongoose.Types.ObjectId().toString(),
        order: index
      })),
      settings: {
        allowAnonymous: settings?.allowAnonymous || false,
        requireEmail: settings?.requireEmail || false,
        limitResponses: settings?.limitResponses || 0,
      },
      
      createdBy: session.user.id,
      status: 'draft',
      analytics: {
        totalResponses: 0
      }
    });

    return NextResponse.json({
      message: 'Survey created successfully',
      survey: {
        id: survey._id,
        title: survey.title,
        description: survey.description,
        questions: survey.questions,
        settings: survey.settings,
        status: survey.status,
        analytics: survey.analytics,
        createdAt: survey.createdAt,
      },
    });
  } catch (error) {
    console.error('Error creating survey:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const surveys = await Survey.find({ createdBy: session.user.id })
      .sort({ createdAt: -1 })
      .select('title description settings theme status analytics.totalResponses createdAt');

    return NextResponse.json({ surveys });
  } catch (error) {
    console.error('Error fetching surveys:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 