import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';

// Helper functions for API responses
function errorResponse(message: string, status = 400) {
  return NextResponse.json(
    { success: false, message },
    { status }
  );
}

function successResponse(data: any, message: string, status = 200) {
  return NextResponse.json(
    { success: true, message, data },
    { status }
  );
}

// Password strength validation
function isPasswordStrong(password: string): { isValid: boolean; message?: string } {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  if (!/[!@#$%^&*]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character (!@#$%^&*)' };
  }
  return { isValid: true };
}

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return errorResponse('Please provide all required fields');
    }

    // Validate password strength
    const passwordValidation = isPasswordStrong(password);
    if (!passwordValidation.isValid) {
      return errorResponse(passwordValidation.message || 'Invalid password');
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const { password: _, ...userWithoutPassword } = user.toObject();

    return successResponse(userWithoutPassword, 'User registered successfully');
  } catch (error) {
    console.error('Registration error:', error);
    return errorResponse('Error registering user', 500);
  }
} 