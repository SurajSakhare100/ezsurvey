import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Survey from '@/models/Survey';
import Response from '@/models/Response';
import mongoose from 'mongoose';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; responseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(params.id) || !mongoose.Types.ObjectId.isValid(params.responseId)) {
      return NextResponse.json(
        { message: 'Invalid survey or response ID' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the survey and verify ownership
    const survey = await Survey.findOne({
      _id: params.id,
      createdBy: session.user.id
    });

    if (!survey) {
      return NextResponse.json(
        { message: 'Survey not found' },
        { status: 404 }
      );
    }

    // Find and delete the response
    const response = await Response.findOneAndDelete({
      _id: params.responseId,
      surveyId: params.id
    });

    if (!response) {
      return NextResponse.json(
        { message: 'Response not found' },
        { status: 404 }
      );
    }

    // Update survey analytics
    if (survey.analytics) {
      survey.analytics.totalResponses = Math.max(0, (survey.analytics.totalResponses || 0) - 1);
      
      // If this was the last response, update lastResponseAt
      if (survey.analytics.totalResponses === 0) {
        survey.analytics.lastResponseAt = undefined;
      }
      
      await survey.save();
    }

    return NextResponse.json({
      message: 'Response deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting response:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}