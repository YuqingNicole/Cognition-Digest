/* API client for Cognition Digest backend */

import { buildAuthHeaders } from "@/lib/auth"

// ============================================================================
// Type Definitions (matching OpenAPI schema)
// ============================================================================

export type User = {
  id: string
  email: string
  name?: string
}

export type SourceType = "channel" | "playlist" | "video"

export type Source = {
  id: string
  title?: string
  youtube_id: string
  type: SourceType
  is_whitelisted?: boolean
}

export type SubscriptionFrequency = "each" | "weekly" | "monthly"
export type SubscriptionStatus = "active" | "paused" | "canceled"

export type Subscription = {
  id: string
  source_id: string
  frequency: SubscriptionFrequency
  status: SubscriptionStatus
  send_time_local?: string
}

export type ReportOutlineItem = {
  timestamp?: string
  title?: string
  summary?: string
}

export type ReportClaim = {
  claim?: string
  evidence?: string
  confidence?: "high" | "medium" | "low"
}

export type Report = {
  id: string
  video_title: string
  tldr?: string[]
  outline?: ReportOutlineItem[]
  claims?: ReportClaim[]
  html_url?: string
  pdf_url?: string
}

export type ApiError = {
  error: {
    code: string
    message: string
  }
}

export type TaskStatus = "queued" | "processing" | "completed" | "failed"

export type OneTimeReportResponse = {
  task_id: string
  status: TaskStatus
}

export type AuthCallbackResponse = {
  access_token: string
  token_type: string
  user: User
}

export type FeedbackIssueType = "inaccuracy" | "missing_info" | "formatting" | "other"
export type FeedbackStatus = "received" | "reviewing" | "resolved"

export type FeedbackResponse = {
  id: string
  status: FeedbackStatus
}

export type HealthStatus = "healthy" | "degraded" | "unhealthy"
export type ConnectionStatus = "connected" | "disconnected"

export type HealthCheckResponse = {
  status: HealthStatus
  db?: ConnectionStatus
  redis?: ConnectionStatus
  uptime?: string
}

// ============================================================================
// HTTP Client
// ============================================================================

const JSON_HEADERS = { "content-type": "application/json" }

// Base URL from environment variable
const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // Client-side: use environment variable or fallback to same origin
    return process.env.NEXT_PUBLIC_BACKEND_URL || ""
  }
  // Server-side: use environment variable or localhost
  return process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
}

// Development mode: set to true to use mock data instead of real API
// Temporarily force DEV_MODE to true for testing without backend
const DEV_MODE = true // process.env.NEXT_PUBLIC_DEV_MODE === "true"

async function http<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const baseUrl = getBaseUrl()
  const url = typeof input === "string" && !input.startsWith("http") 
    ? `${baseUrl}${input}` 
    : input

  const requestInit: RequestInit = {
    ...init,
    headers: buildAuthHeaders(init?.headers),
    credentials: init?.credentials ?? "include",
  }

  const res = await fetch(url, requestInit)
  const contentType = res.headers.get("content-type") || ""
  const isJson = contentType.includes("application/json")
  
  // Handle 204 No Content
  if (res.status === 204) {
    return undefined as T
  }

  const payload = isJson ? await res.json() : await res.text()

  if (!res.ok) {
    const error = new Error(`Request failed with status ${res.status}`)
    ;(error as Error & { status?: number; body?: unknown }).status = res.status
    ;(error as Error & { status?: number; body?: unknown }).body = payload
    throw error
  }

  return payload as T
}

// ============================================================================
// Authentication APIs
// ============================================================================

export async function handleGoogleCallback(data: {
  email: string
  google_id: string
  name?: string
}): Promise<AuthCallbackResponse> {
  return http("/auth/callback/google", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(data),
  })
}

// ============================================================================
// Sources APIs
// ============================================================================

export async function parseYouTubeUrl(url: string): Promise<Source> {
  return http("/sources/parse", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ url }),
  })
}

export async function listSources(): Promise<Source[]> {
  if (DEV_MODE) {
    // Mock data for development
    return Promise.resolve([
      {
        id: "source-1",
        title: "Lex Fridman Podcast",
        youtube_id: "UCxxxxxx1",
        type: "channel",
        is_whitelisted: true,
      },
      {
        id: "source-2",
        title: "Fireship",
        youtube_id: "UCxxxxxx2",
        type: "channel",
        is_whitelisted: true,
      },
    ])
  }
  return http("/sources")
}

export async function createSource(source: Omit<Source, "id">): Promise<Source> {
  return http("/sources", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(source),
  })
}

// ============================================================================
// Subscriptions APIs
// ============================================================================

export async function listSubscriptions(): Promise<Subscription[]> {
  if (DEV_MODE) {
    // Mock data for development
    return Promise.resolve([
      {
        id: "sub-1",
        source_id: "source-1",
        frequency: "weekly",
        status: "active",
        send_time_local: "09:00",
      },
      {
        id: "sub-2",
        source_id: "source-2",
        frequency: "each",
        status: "active",
      },
    ])
  }
  return http("/subscriptions")
}

export async function createSubscription(
  subscription: Omit<Subscription, "id">
): Promise<Subscription> {
  return http("/subscriptions", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(subscription),
  })
}

export async function updateSubscription(
  id: string,
  updates: Partial<Pick<Subscription, "status" | "frequency" | "send_time_local">>
): Promise<Subscription> {
  return http(`/subscriptions/${id}`, {
    method: "PATCH",
    headers: JSON_HEADERS,
    body: JSON.stringify(updates),
  })
}

export async function deleteSubscription(id: string): Promise<void> {
  return http(`/subscriptions/${id}`, { method: "DELETE" })
}

// ============================================================================
// Reports APIs
// ============================================================================

export async function generateOneTimeReport(data: {
  video_url: string
  lang?: string
}): Promise<OneTimeReportResponse> {
  if (DEV_MODE) {
    return Promise.resolve({
      task_id: "task-" + Date.now(),
      status: "queued",
    })
  }
  return http("/reports/onetime", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(data),
  })
}

export async function listReports(params?: {
  source_id?: string
  q?: string
  from?: string
  to?: string
}): Promise<Report[]> {
  if (DEV_MODE) {
    return Promise.resolve([
      {
        id: "report-1",
        video_title: "Introduction to Machine Learning",
        tldr: ["Key concept 1", "Key concept 2"],
        html_url: "#",
        pdf_url: "#",
      },
    ])
  }
  const query = new URLSearchParams(
    Object.entries(params || {}).filter(([_, v]) => v != null) as [string, string][]
  ).toString()
  const url = query ? `/reports?${query}` : "/reports"
  return http(url)
}

export async function getReport(id: string): Promise<Report> {
  if (DEV_MODE) {
    return Promise.resolve({
      id,
      video_title: "Sample Report",
      tldr: ["Point 1", "Point 2", "Point 3"],
      outline: [
        { timestamp: "00:00", title: "Introduction", summary: "Overview" },
        { timestamp: "05:30", title: "Main Content", summary: "Details" },
      ],
      claims: [
        { claim: "Claim 1", evidence: "Evidence", confidence: "high" },
      ],
      html_url: "#",
      pdf_url: "#",
    })
  }
  return http(`/reports/${id}`)
}

// ============================================================================
// Feedback APIs
// ============================================================================

export async function submitFeedback(data: {
  report_id: string
  issue_type: FeedbackIssueType
  section?: string
  note?: string
}): Promise<FeedbackResponse> {
  return http("/feedback", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(data),
  })
}

// ============================================================================
// System APIs
// ============================================================================

export async function checkHealth(): Promise<HealthCheckResponse> {
  return http("/health")
}
