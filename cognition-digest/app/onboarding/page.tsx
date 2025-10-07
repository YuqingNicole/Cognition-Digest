"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { loginWithGoogle } from "@/lib/auth"

export default function OnboardingPage() {
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get("from") || "/dashboard"

  const handleGoogleLogin = () => {
    loginWithGoogle(returnUrl)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <Card className="w-full max-w-md rounded-xl border border-border bg-card p-10 shadow-sm">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary">
            <span className="text-3xl font-bold text-primary-foreground">C</span>
          </div>
        </div>

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-xl font-bold text-foreground">Cognition Digest</h1>
          <p className="mt-2 text-sm text-muted-foreground">Turn YouTube into knowledge.</p>
        </div>

        {/* Sign In Button */}
        <Button 
          onClick={handleGoogleLogin}
          className="h-12 w-full rounded-xl bg-primary text-base font-medium text-primary-foreground hover:bg-primary/90"
        >
          <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sign in with Google
        </Button>

        {/* Sample Report Link */}
        <div className="mt-6 text-center">
          <Link
            href="/sample-report"
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            View sample report
          </Link>
        </div>
      </Card>
    </main>
  )
}
