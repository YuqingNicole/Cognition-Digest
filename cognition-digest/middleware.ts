// Placeholder middleware – add auth/redirect logic later
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export default function middleware(_req: NextRequest) {
  // e.g., read cookies/session and guard routes
  return NextResponse.next()
}

// Configure matchers as needed later
export const config = {
  matcher: [
    // "/dashboard",
    // "/report/:path*",
    // "/newsletter/:path*",
  ],
}
