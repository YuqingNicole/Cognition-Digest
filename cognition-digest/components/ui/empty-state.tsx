import * as React from "react"

type EmptyStateProps = {
  title?: string
  description?: string
  action?: React.ReactNode
  icon?: React.ReactNode
  className?: string
}

export function EmptyState({
  title = "Nothing here yet",
  description = "Add data or connect a source to get started.",
  action,
  icon,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card p-10 text-center ${className}`}>
      {icon ? (
        <div className="rounded-lg bg-muted p-3 text-muted-foreground">{icon}</div>
      ) : (
        <div className="rounded-lg bg-muted p-3 text-muted-foreground">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" opacity="0.3" />
            <path d="M8 12h8M12 8v8" />
          </svg>
        </div>
      )}
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="max-w-sm text-xs text-muted-foreground">{description}</p>
      {action && <div className="mt-1">{action}</div>}
    </div>
  )}
