import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Template from '@/models/Template';
import mongoose from 'mongoose';

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

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { message: 'Invalid template ID' },
        { status: 400 }
      );
    }

    await connectDB();

    const template = await Template.findById(params.id);

    if (!template) {
      return NextResponse.json(
        { message: 'Template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      template: {
        id: template._id,
        name: template.name,
        description: template.description,
        category: template.category,
        questions: template.questions,
        settings: template.settings,
        createdAt: template.createdAt,
      },
    });
  } catch (error) {
    console.error('Error fetching template:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 