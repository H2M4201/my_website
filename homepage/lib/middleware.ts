import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const proto = request.headers.get('x-forwarded-proto')
  const isHttps = proto === 'https'
  const isApiRoute = request.nextUrl.pathname.startsWith('/api/')

  // Redirect HTTP to HTTPS in production
  if (
    isApiRoute &&
    !isHttps &&
    process.env.NODE_ENV === 'production' &&
    process.env.ALLOW_HTTP !== 'true'
  ) {
    const httpsUrl = new URL(request.url)
    httpsUrl.protocol = 'https:'
    return NextResponse.redirect(httpsUrl)
  }

  // Add security headers
  const response = NextResponse.next()
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')

  return response
}

export const config = {
  matcher: ['/api/:path*'],
}
