/* Placeholder API client. Wire real endpoints later. */

import { buildAuthHeaders } from "@/lib/auth"

export type Report = {
  id: string
  title?: string
  createdAt?: string
  // extend as needed
}

const JSON_HEADERS = { "content-type": "application/json" }

async function http<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const requestInit: RequestInit = {
    ...init,
    headers: buildAuthHeaders(init?.headers),
    credentials: init?.credentials ?? "include",
  }

  const res = await fetch(input, requestInit)
  const contentType = res.headers.get("content-type") || ""
  const isJson = contentType.includes("application/json")
  const payload = isJson ? await res.json() : await res.text()

  if (!res.ok) {
    const error = new Error(`Request failed with status ${res.status}`)
    ;(error as Error & { status?: number; body?: unknown }).status = res.status
    ;(error as Error & { status?: number; body?: unknown }).body = payload
    throw error
  }

  return payload as T
}

export async function getReport(id: string): Promise<{ id: string; report: Report | null }> {
  return http(`/api/report/${id}`)
}

export async function upsertReport(id: string, data: Partial<Report>): Promise<{ id: string; ok: boolean }> {
  return http(`/api/report/${id}`,
    { method: "POST", headers: JSON_HEADERS, body: JSON.stringify(data) })
}

// Add more placeholders as needed (auth, subscriptions, newsletter, etc.)
