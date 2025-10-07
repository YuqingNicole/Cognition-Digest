/**
 * API Usage Examples
 * 
 * This file demonstrates all API endpoints and how to use them.
 * Copy these patterns into your actual components.
 */

import * as api from "@/lib/api"
import { loginWithGoogle, logout, getCurrentUser } from "@/lib/auth"

// ============================================================================
// Authentication Examples
// ============================================================================

export async function authExamples() {
  // 1. Login with Google (redirect to backend OAuth)
  loginWithGoogle("/dashboard") // Redirects to backend, then back to /dashboard

  // 2. Get current user
  const user = await getCurrentUser()
  if (user) {
    console.log("Logged in as:", user.email, user.name)
  }

  // 3. Logout
  await logout() // Clears session and redirects to /
}

// ============================================================================
// Sources API Examples
// ============================================================================

export async function sourcesExamples() {
  // 1. Parse YouTube URL
  const parsed = await api.parseYouTubeUrl("https://www.youtube.com/@lexfridman")
  console.log("Parsed:", parsed)
  // => { id, youtube_id, type: "channel", title, is_whitelisted }

  // 2. List all sources
  const sources = await api.listSources()
  console.log("My sources:", sources)

  // 3. Create a new source
  const newSource = await api.createSource({
    youtube_id: "UCxxxxxx",
    type: "channel",
    title: "My Favorite Channel",
  })
  console.log("Created:", newSource)
}

// ============================================================================
// Subscriptions API Examples
// ============================================================================

export async function subscriptionsExamples() {
  // 1. List all subscriptions
  const subs = await api.listSubscriptions()
  console.log("My subscriptions:", subs)

  // 2. Create a subscription
  const newSub = await api.createSubscription({
    source_id: "source-123",
    frequency: "weekly",
    status: "active",
    send_time_local: "09:00",
  })
  console.log("Created subscription:", newSub)

  // 3. Update subscription (change frequency)
  const updated = await api.updateSubscription("sub-123", {
    frequency: "monthly",
  })
  console.log("Updated:", updated)

  // 4. Pause subscription
  await api.updateSubscription("sub-123", {
    status: "paused",
  })

  // 5. Resume subscription
  await api.updateSubscription("sub-123", {
    status: "active",
  })

  // 6. Delete subscription
  await api.deleteSubscription("sub-123")
  console.log("Deleted")
}

// ============================================================================
// Reports API Examples
// ============================================================================

export async function reportsExamples() {
  // 1. Generate one-time report
  const task = await api.generateOneTimeReport({
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    lang: "en", // or "zh", "ja", "es"
  })
  console.log("Task queued:", task.task_id, task.status)

  // 2. List all reports
  const allReports = await api.listReports()
  console.log("All reports:", allReports)

  // 3. List reports with filters
  const filtered = await api.listReports({
    source_id: "source-123",
    q: "machine learning",
    from: "2024-01-01",
    to: "2024-12-31",
  })
  console.log("Filtered reports:", filtered)

  // 4. Get single report
  const report = await api.getReport("report-123")
  console.log("Report details:", report)
  console.log("TL;DR:", report.tldr)
  console.log("Outline:", report.outline)
  console.log("Claims:", report.claims)
  console.log("PDF:", report.pdf_url)
  console.log("HTML:", report.html_url)
}

// ============================================================================
// Feedback API Examples
// ============================================================================

export async function feedbackExamples() {
  // Submit feedback on a report
  const feedback = await api.submitFeedback({
    report_id: "report-123",
    issue_type: "inaccuracy",
    section: "tldr",
    note: "The second point is incorrect",
  })
  console.log("Feedback submitted:", feedback.id, feedback.status)
}

// ============================================================================
// System API Examples
// ============================================================================

export async function systemExamples() {
  // Health check
  const health = await api.checkHealth()
  console.log("System status:", health.status)
  console.log("Database:", health.db)
  console.log("Redis:", health.redis)
  console.log("Uptime:", health.uptime)
}

// ============================================================================
// Error Handling Examples
// ============================================================================

export async function errorHandlingExamples() {
  try {
    await api.getReport("non-existent-id")
  } catch (error) {
    // Error has status and body properties
    const err = error as Error & { status?: number; body?: api.ApiError }
    
    console.error("Status:", err.status) // e.g., 404
    console.error("Message:", err.message)
    
    if (err.body && "error" in err.body) {
      console.error("Error code:", err.body.error.code)
      console.error("Error message:", err.body.error.message)
    }

    // Handle specific status codes
    if (err.status === 401) {
      // Unauthorized - redirect to login
      loginWithGoogle(window.location.pathname)
    } else if (err.status === 404) {
      // Not found
      alert("Report not found")
    } else {
      // Generic error
      alert("Something went wrong")
    }
  }
}

// ============================================================================
// React Component Example
// ============================================================================

export function ExampleComponent() {
  // This is just for demonstration - see actual components:
  // - components/user-menu.tsx
  // - components/generate-report-form.tsx
  // - components/subscription-manager.tsx
  
  return (
    <div className="space-y-4 p-4">
      <h2 className="text-lg font-bold">API Examples</h2>
      <p className="text-sm text-muted-foreground">
        See the source code of this file for usage examples.
      </p>
      <p className="text-sm text-muted-foreground">
        Check out these components for real implementations:
      </p>
      <ul className="list-disc pl-6 text-sm">
        <li>components/user-menu.tsx - User authentication</li>
        <li>components/generate-report-form.tsx - Report generation</li>
        <li>components/subscription-manager.tsx - Subscription CRUD</li>
        <li>hooks/use-api.ts - React hooks for API calls</li>
      </ul>
    </div>
  )
}
