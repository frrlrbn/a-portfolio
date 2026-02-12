import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'azelin-portfolio-blog-secret-key-2024'
);

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Protected routes
  const protectedPaths = ['/blog/create', '/blog/edit', '/blog/drafts', '/blog/profile'];
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));
  
  if (isProtected) {
    const token = request.cookies.get('blog_session')?.value;
    
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // If logged in and trying to access login page, redirect to blog
  if (pathname === '/login') {
    const token = request.cookies.get('blog_session')?.value;
    if (token) {
      try {
        await jwtVerify(token, JWT_SECRET);
        return NextResponse.redirect(new URL('/blog', request.url));
      } catch {
        // Token invalid, continue to login
      }
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/blog/create', '/blog/edit/:path*', '/blog/drafts', '/blog/profile', '/login'],
};
