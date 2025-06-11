import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/api/surveys/:path*',
    '/api/responses/:path*',
    '/api/users/:path*',
    '/api/settings/:path*',
    '/api/analytics/:path*',
    '/dashboard/:path*',
    '/survey/:path*',
    '/responses/:path*',
    '/settings/:path*',
  ],
}; 