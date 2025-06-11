import { NextResponse } from 'next/server';

export function successResponse(data: any, message?: string) {
  return NextResponse.json({
    success: true,
    message,
    data,
  });
}

export function errorResponse(message: string, status: number = 400) {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status }
  );
}

export function getServerSession(req: Request) {
  return req.headers.get('authorization')?.split(' ')[1];
} 