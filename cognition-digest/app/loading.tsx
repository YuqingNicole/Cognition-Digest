export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex items-center gap-3 text-muted-foreground">
        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
          <path d="M22 12a10 10 0 0 1-10 10" />
        </svg>
        <span>Loading…</span>
      </div>
    </div>
  )
}
