/**
 * React hooks for API calls with loading/error states
 * Example usage patterns for Cognition Digest API
 */

import { useState, useEffect } from "react"
import * as api from "@/lib/api"

// ============================================================================
// User Hook
// ============================================================================

export function useCurrentUser() {
  const [user, setUser] = useState<api.User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    import("@/lib/auth").then(({ getCurrentUser }) => {
      getCurrentUser()
        .then(setUser)
        .catch(setError)
        .finally(() => setLoading(false))
    })
  }, [])

  return { user, loading, error }
}

// ============================================================================
// Sources Hooks
// ============================================================================

export function useSources() {
  const [sources, setSources] = useState<api.Source[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchSources = async () => {
    try {
      setLoading(true)
      const data = await api.listSources()
      setSources(data)
      setError(null)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSources()
  }, [])

  const addSource = async (url: string) => {
    try {
      // First parse the URL
      const parsed = await api.parseYouTubeUrl(url)
      // Then create the source
      const created = await api.createSource(parsed)
      setSources((prev) => [...prev, created])
      return created
    } catch (err) {
      throw err
    }
  }

  return { sources, loading, error, refetch: fetchSources, addSource }
}

// ============================================================================
// Subscriptions Hooks
// ============================================================================

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<api.Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      const data = await api.listSubscriptions()
      setSubscriptions(data)
      setError(null)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const createSubscription = async (
    subscription: Omit<api.Subscription, "id">
  ) => {
    try {
      const created = await api.createSubscription(subscription)
      setSubscriptions((prev) => [...prev, created])
      return created
    } catch (err) {
      throw err
    }
  }

  const updateSubscription = async (
    id: string,
    updates: Partial<Pick<api.Subscription, "status" | "frequency" | "send_time_local">>
  ) => {
    try {
      const updated = await api.updateSubscription(id, updates)
      setSubscriptions((prev) =>
        prev.map((sub) => (sub.id === id ? updated : sub))
      )
      return updated
    } catch (err) {
      throw err
    }
  }

  const deleteSubscription = async (id: string) => {
    try {
      await api.deleteSubscription(id)
      setSubscriptions((prev) => prev.filter((sub) => sub.id !== id))
    } catch (err) {
      throw err
    }
  }

  return {
    subscriptions,
    loading,
    error,
    refetch: fetchSubscriptions,
    createSubscription,
    updateSubscription,
    deleteSubscription,
  }
}

// ============================================================================
// Reports Hooks
// ============================================================================

export function useReports(params?: {
  source_id?: string
  q?: string
  from?: string
  to?: string
}) {
  const [reports, setReports] = useState<api.Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchReports = async () => {
    try {
      setLoading(true)
      const data = await api.listReports(params)
      setReports(data)
      setError(null)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [params?.source_id, params?.q, params?.from, params?.to])

  return { reports, loading, error, refetch: fetchReports }
}

export function useReport(id: string) {
  const [report, setReport] = useState<api.Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchReport = async () => {
    try {
      setLoading(true)
      const data = await api.getReport(id)
      setReport(data)
      setError(null)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchReport()
    }
  }, [id])

  return { report, loading, error, refetch: fetchReport }
}

// ============================================================================
// One-time Report Generation
// ============================================================================

export function useGenerateReport() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [taskId, setTaskId] = useState<string | null>(null)

  const generate = async (videoUrl: string, lang?: string) => {
    try {
      setLoading(true)
      setError(null)
      const result = await api.generateOneTimeReport({ video_url: videoUrl, lang })
      setTaskId(result.task_id)
      return result
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { generate, loading, error, taskId }
}
