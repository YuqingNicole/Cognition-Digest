"use client"

import { useSubscriptions, useSources } from "@/hooks/use-api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Trash2 } from "lucide-react"
import type { SubscriptionFrequency, SubscriptionStatus } from "@/lib/api"

/**
 * Example: Subscription manager using listSubscriptions, updateSubscription, deleteSubscription APIs
 */
export function SubscriptionManager() {
  const { subscriptions, loading, error, updateSubscription, deleteSubscription } = useSubscriptions()
  const { sources } = useSources()

  const getSourceTitle = (sourceId: string) => {
    const source = sources.find((s) => s.id === sourceId)
    return source?.title || sourceId
  }

  const handleFrequencyChange = async (id: string, frequency: SubscriptionFrequency) => {
    try {
      await updateSubscription(id, { frequency })
    } catch (err) {
      console.error("Failed to update frequency:", err)
    }
  }

  const handleStatusToggle = async (id: string, currentStatus: SubscriptionStatus) => {
    const newStatus: SubscriptionStatus = currentStatus === "active" ? "paused" : "active"
    try {
      await updateSubscription(id, { status: newStatus })
    } catch (err) {
      console.error("Failed to update status:", err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subscription?")) return
    
    try {
      await deleteSubscription(id)
    } catch (err) {
      console.error("Failed to delete subscription:", err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
        Failed to load subscriptions: {error.message}
      </div>
    )
  }

  if (subscriptions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-8">
          <p className="text-sm text-muted-foreground">No subscriptions yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {subscriptions.map((sub) => (
        <Card key={sub.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base">{getSourceTitle(sub.source_id)}</CardTitle>
                <CardDescription className="mt-1">
                  ID: {sub.source_id}
                </CardDescription>
              </div>
              <Badge variant={sub.status === "active" ? "default" : "secondary"}>
                {sub.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Select
                value={sub.frequency}
                onValueChange={(value) => handleFrequencyChange(sub.id, value as SubscriptionFrequency)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="each">Each video</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusToggle(sub.id, sub.status)}
              >
                {sub.status === "active" ? "Pause" : "Resume"}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(sub.id)}
                className="ml-auto text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
