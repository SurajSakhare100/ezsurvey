import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Template from '@/models/Template';

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

    const templates = await Template.find()
      .sort({ category: 1, name: 1 })
      .select('name description category questions settings');

    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
    const { name, description, category, questions, settings } = body;

    // Validate required fields
    if (!name?.trim() || !description?.trim() || !category) {
      return NextResponse.json(
        { message: 'Name, description, and category are required' },
        { status: 400 }
      );
    }

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { message: 'At least one question is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const template = await Template.create({
      name: name.trim(),
      description: description.trim(),
      category,
      questions: questions.map((q: any, index: number) => ({
        ...q,
        order: index
      })),
      settings: {
        allowAnonymous: settings?.allowAnonymous || false,
        requireEmail: settings?.requireEmail || false,
        limitResponses: settings?.limitResponses || 0,
      }
    });

    return NextResponse.json({
      message: 'Template created successfully',
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
    console.error('Error creating template:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 