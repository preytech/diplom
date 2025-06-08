import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth')?.value;
  
  if (!authToken && request.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (authToken && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/test', request.url));
  }
  
  return NextResponse.next();
}