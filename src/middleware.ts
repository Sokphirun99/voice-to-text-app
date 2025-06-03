import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the path of the request
  const path = request.nextUrl.pathname;
  
  // API rate limiting example
  if (path.startsWith('/api/')) {
    // You could implement rate limiting here
    // For example, using request IP or API key headers
    // This is just a placeholder for demonstration
    
    const apiKey = request.headers.get('x-api-key');
    
    // If this was a protected API that required authentication
    if (path.includes('/api/protected') && !apiKey) {
      return NextResponse.json(
        { error: 'API key required' },
        { status: 401 }
      );
    }
  }
  
  // Add CORS headers for API routes
  if (path.startsWith('/api/')) {
    const response = NextResponse.next();
    
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
  }
  
  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /_next/ (Next.js internals)
     * 2. /static/ (inside /public)
     * 3. /_vercel/ (Vercel internals)
     * 4. /favicon.ico, /robots.txt (common static files)
     */
    '/((?!_next|static|_vercel|favicon.ico|robots.txt).*)',
  ],
};
