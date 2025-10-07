import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { readTokenFromRequest, isTokenAuthorized } from "@/lib/auth"

function unauthorizedResponse(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const loginUrl = new URL("/onboarding", req.url)
  loginUrl.searchParams.set("from", req.nextUrl.pathname)
  return NextResponse.redirect(loginUrl)
}

export default function middleware(req: NextRequest) {
  const token = readTokenFromRequest(req)
  if (!isTokenAuthorized(token)) {
    return unauthorizedResponse(req)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/report/:path*", "/newsletter/:path*", "/api/report/:path*"],
}
