import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '')

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // Check if user is logged in (has token in localStorage will be checked on client)
    // For now, we just allow access and let AuthContext handle redirect
    return NextResponse.next()
  }

  // Redirect from home to dashboard if logged in
  if (request.nextUrl.pathname === '/' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/dashboard/:path*'],
}

