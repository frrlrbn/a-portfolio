import { NextResponse } from 'next/server';

// List of valid section routes
const validSections = ['home', 'about', 'skills', 'projects', 'certificates', 'contact'];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is a valid section route
  const section = pathname.substring(1); // Remove the leading slash
  
  if (validSections.includes(section)) {
    // Redirect to the home page with a hash fragment
    const url = new URL('/', request.url);
    url.hash = section;
    
    return NextResponse.redirect(url);
  }
  
  // For all other routes, continue normally
  return NextResponse.next();
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: [
    // Match all paths except those starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 