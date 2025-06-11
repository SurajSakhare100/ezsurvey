import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Survey from '@/models/Survey';
import mongoose from 'mongoose';

interface Question {
  id?: string;
  _id?: mongoose.Types.ObjectId;
  type: string;
  question: string;
  options?: string[];
  required: boolean;
  toObject(): any;
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { message: 'Invalid survey ID' },
        { status: 400 }
      );
    }

    const survey = await Survey.findOne({
      _id: params.id,
      createdBy: session.user.id,
    });

    if (!survey) {
      return NextResponse.json(
        { message: 'Survey not found' },
        { status: 404 }
      );
    }

    // Ensure each question has an ID
    const questions = survey.questions.map((question: any) => {
      const questionObj = question.toObject();
      return {
        ...questionObj,
        id: questionObj.id || questionObj._id?.toString()
      };
    });

    return NextResponse.json({
      survey: {
        id: survey._id,
        title: survey.title,
        description: survey.description,
        questions,
        settings: survey.settings,
        status: survey.status,
        analytics: survey.analytics,
        createdAt: survey.createdAt,
      },
    });
  } catch (error) {
    console.error('Error fetching survey:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { message: 'Invalid survey ID' },
        { status: 400 }
      );
    }

    const body = await req.json();

    await connectDB();

    const survey = await Survey.findOne({
      _id: params.id,
      createdBy: session.user.id,
    });

    if (!survey) {
      return NextResponse.json(
        { message: 'Survey not found' },
        { status: 404 }
      );
    }

    // Update survey fields
    if (body.title) survey.title = body.title.trim();
    if (body.description !== undefined) survey.description = body.description?.trim();
    if (body.settings) {
      survey.settings = {
        ...survey.settings,
        ...body.settings
      };
    }
    if (body.status) survey.status = body.status;

    // Update theme if provided
    if (body.theme) {
      if (!body.theme.name || !body.theme.colors) {
        return NextResponse.json(
          { message: 'Theme name and colors are required' },
          { status: 400 }
        );
      }

      if (!body.theme.colors.primary || !body.theme.colors.secondary || 
          !body.theme.colors.accent || !body.theme.colors.background) {
        return NextResponse.json(
          { message: 'All theme colors are required' },
          { status: 400 }
        );
      }

      survey.theme = {
        name: body.theme.name,
        colors: {
          primary: body.theme.colors.primary,
          secondary: body.theme.colors.secondary,
          accent: body.theme.colors.accent,
          background: body.theme.colors.background
        }
      };
    }

    // Update questions if provided
    if (body.questions) {
      survey.questions = body.questions.map((q: any, index: number) => ({
        ...q,
        id: q.id || new mongoose.Types.ObjectId().toString(),
        order: index
      }));
    }

    await survey.save();

    return NextResponse.json({
      message: 'Survey updated successfully',
      survey: {
        id: survey._id,
        title: survey.title,
        description: survey.description,
        questions: survey.questions,
        settings: survey.settings,
        theme: survey.theme,
        status: survey.status,
        analytics: survey.analytics,
        createdAt: survey.createdAt,
      },
    });
  } catch (error) {
    console.error('Error updating survey:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { message: 'Invalid survey ID' },
        { status: 400 }
      );
    }

    await connectDB();

    const survey = await Survey.findOne({
      _id: params.id,
      createdBy: session.user.id,
    });

    if (!survey) {
      return NextResponse.json(
        { message: 'Survey not found' },
        { status: 404 }
      );
    }

    await survey.deleteOne();

    return NextResponse.json({
      message: 'Survey deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting survey:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 