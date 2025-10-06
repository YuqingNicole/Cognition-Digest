"use client"

// Global error boundary for App Router – placeholder implementation
import { useEffect } from "react"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log error to your monitoring service
    // console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-xl font-bold text-foreground">Something went wrong</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        An unexpected error occurred. You can try to reload the page or go back. This component is a placeholder and
        can be customized later.
      </p>
      <div className="flex gap-3">
        <button onClick={() => reset()} className="rounded-md bg-primary px-4 py-2 text-primary-foreground">
          Try again
        </button>
        <button onClick={() => (window.location.href = "/")} className="rounded-md border px-4 py-2">
          Go home
        </button>
      </div>
    </div>
  )
}
