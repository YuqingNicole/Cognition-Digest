/* Placeholder API client. Wire real endpoints later. */

export type Report = {
  id: string
  title?: string
  createdAt?: string
  // extend as needed
}

const JSON_HEADERS = { "content-type": "application/json" }

async function http<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init)
  // For placeholders we don't throw; callers can decide
  // In real implementation, handle non-2xx, retries, etc.
  const contentType = res.headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    return (await res.json()) as T
  }
  return (await res.text()) as T
}

export async function getReport(id: string): Promise<{ id: string; report: Report | null }>
{
  return http(`/api/report/${id}`)
}

export async function upsertReport(id: string, data: Partial<Report>): Promise<{ id: string; ok: boolean }>
{
  return http(`/api/report/${id}`,
    { method: "POST", headers: JSON_HEADERS, body: JSON.stringify(data) })
}

// Add more placeholders as needed (auth, subscriptions, newsletter, etc.)
