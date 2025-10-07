import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Check if user has valid authentication
 * Supports both:
 * 1. Legacy token-based auth (DIGEST_TOKEN env var)
 * 2. Google OAuth session cookie (from backend)
 */
function isAuthenticated(req: NextRequest): boolean {
  // Check legacy token auth from cookie or header
  const authHeader = req.headers.get("authorization")
  const cookieHeader = req.headers.get("cookie")
  
  // Extract token from Authorization header
  if (authHeader?.toLowerCase().startsWith("bearer ")) {
    const token = authHeader.slice(7).trim()
    if (token) {
      // Check against DIGEST_TOKEN env var
      const expectedTokens = process.env.DIGEST_TOKEN?.split(",").map(t => t.trim()) || []
      if (expectedTokens.length === 0 || expectedTokens.includes(token)) {
        return true
      }
    }
  }

  // Extract token from digest-token cookie
  if (cookieHeader) {
    const cookies = cookieHeader.split(";")
    for (const cookie of cookies) {
      const [key, ...valueParts] = cookie.trim().split("=")
      if (key === "digest-token" && valueParts.length) {
        const token = decodeURIComponent(valueParts.join("="))
        const expectedTokens = process.env.DIGEST_TOKEN?.split(",").map(t => t.trim()) || []
        if (expectedTokens.length === 0 || expectedTokens.includes(token)) {
          return true
        }
      }
    }
  }

  // Check Google OAuth session cookie (set by backend)
  const sessionCookie = req.cookies.get("session")?.value || 
                        req.cookies.get("digest-token")?.value ||
                        req.cookies.get("connect.sid")?.value

  return !!sessionCookie
}

function unauthorizedResponse(req: NextRequest) {
  // For API routes, return 401 JSON
  if (req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  // For page routes, redirect to onboarding/login with return URL
  const loginUrl = new URL("/onboarding", req.url)
  loginUrl.searchParams.set("from", req.nextUrl.pathname)
  return NextResponse.redirect(loginUrl)
}

export function middleware(req: NextRequest) {
  // Skip auth check for public routes
  const publicPaths = ["/", "/onboarding", "/sample-report", "/health"]
  if (publicPaths.some(path => req.nextUrl.pathname === path)) {
    return NextResponse.next()
  }

  // Check authentication
  if (!isAuthenticated(req)) {
    return unauthorizedResponse(req)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*", 
    "/report/:path*", 
    "/newsletter/:path*", 
    "/api/report/:path*",
    "/account/:path*",
    "/subscriptions/:path*"
  ],
}
