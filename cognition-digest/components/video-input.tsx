"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Sparkles, Youtube } from "lucide-react"

export function VideoInput() {
  const [url, setUrl] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    // Simulate processing
    setTimeout(() => setIsProcessing(false), 2000)
  }

  return (
    <Card className="rounded-xl border border-border bg-card p-8 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Create Knowledge Report</h2>
        <p className="mt-1 text-sm text-muted-foreground">Paste a YouTube URL to generate a structured digest</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Youtube className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-12 rounded-xl pl-11 text-base"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isProcessing}
            className="h-12 rounded-xl bg-primary px-8 text-base font-medium text-primary-foreground hover:bg-primary/90"
          >
            {isProcessing ? (
              <>
                <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                Processing
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Generate
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  )
}
