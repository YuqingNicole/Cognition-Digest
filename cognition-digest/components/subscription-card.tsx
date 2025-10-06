"use client"

import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "lucide-react"

interface SubscriptionCardProps {
  channelTitle: string
  channelImage: string
  frequency: string
  lastReport: string
  enabled: boolean
  onToggle: () => void
  onFrequencyChange: (frequency: string) => void
}

export function SubscriptionCard({
  channelTitle,
  channelImage,
  frequency,
  lastReport,
  enabled,
  onToggle,
  onFrequencyChange,
}: SubscriptionCardProps) {
  return (
    <Card className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12 rounded-lg">
          <AvatarImage src={channelImage || "/placeholder.svg"} alt={channelTitle} />
          <AvatarFallback className="rounded-lg bg-primary/10 text-primary">{channelTitle.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{channelTitle}</h3>
          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Last: {new Date(lastReport).toLocaleDateString()}</span>
          </div>
        </div>

        <Switch checked={enabled} onCheckedChange={onToggle} />
      </div>

      <div className="mt-4">
        <label className="mb-2 block text-xs font-medium text-muted-foreground">Frequency</label>
        <Select value={frequency} onValueChange={onFrequencyChange} disabled={!enabled}>
          <SelectTrigger className="h-9 rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="each">Each video</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
  )
}
