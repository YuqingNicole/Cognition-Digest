"use client"

import { useState } from "react"
import { useGenerateReport } from "@/hooks/use-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle2 } from "lucide-react"

/**
 * Example: Generate one-time report form using generateOneTimeReport API
 */
export function GenerateReportForm() {
  const [videoUrl, setVideoUrl] = useState("")
  const [lang, setLang] = useState("en")
  const { generate, loading, error, taskId } = useGenerateReport()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!videoUrl.trim()) return

    try {
      await generate(videoUrl, lang)
      // Success - taskId is now set
    } catch (err) {
      // Error is already set in the hook
      console.error("Failed to generate report:", err)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate One-Time Report</CardTitle>
        <CardDescription>
          Create a report for any YouTube video without subscribing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="video-url">YouTube Video URL</Label>
            <Input
              id="video-url"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select value={lang} onValueChange={setLang} disabled={loading}>
              <SelectTrigger id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
                <SelectItem value="ja">日本語</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error.message}
            </div>
          )}

          {taskId && (
            <div className="flex items-center gap-2 rounded-md bg-primary/10 p-3 text-sm text-primary">
              <CheckCircle2 className="h-4 w-4" />
              <span>Report queued! Task ID: {taskId}</span>
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Generating..." : "Generate Report"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
