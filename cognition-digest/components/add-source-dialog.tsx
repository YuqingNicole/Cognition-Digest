"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { CheckCircle2, XCircle, Youtube } from "lucide-react"

interface AddSourceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type ValidationStatus = "idle" | "validating" | "valid" | "invalid"

export function AddSourceDialog({ open, onOpenChange }: AddSourceDialogProps) {
  const [url, setUrl] = useState("")
  const [frequency, setFrequency] = useState("weekly")
  const [status, setStatus] = useState<ValidationStatus>("idle")

  const handleValidate = async () => {
    if (!url) return

    setStatus("validating")
    // Simulate validation
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock validation result
    const isValid = url.includes("youtube.com") || url.includes("youtu.be")
    setStatus(isValid ? "valid" : "invalid")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (status === "valid") {
      // Handle submission
      console.log("[v0] Submitting:", { url, frequency })
      onOpenChange(false)
      // Reset form
      setUrl("")
      setFrequency("weekly")
      setStatus("idle")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New YouTube Source</DialogTitle>
          <DialogDescription>Enter a YouTube channel or video URL to start receiving digests.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* URL Input */}
          <div className="space-y-2">
            <Label htmlFor="url">YouTube URL</Label>
            <div className="relative">
              <Youtube className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="url"
                type="url"
                placeholder="https://youtube.com/@channel or video URL"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value)
                  setStatus("idle")
                }}
                onBlur={handleValidate}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Frequency Selector */}
          <div className="space-y-2">
            <Label htmlFor="frequency">Digest Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger id="frequency">
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

          {/* Validation Status */}
          {status !== "idle" && (
            <div
              className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${
                status === "validating"
                  ? "border-border bg-muted"
                  : status === "valid"
                    ? "border-primary/20 bg-primary/5 text-primary"
                    : "border-destructive/20 bg-destructive/5 text-destructive"
              }`}
            >
              {status === "validating" && (
                <>
                  <Spinner className="h-4 w-4" />
                  <span>Validating channel...</span>
                </>
              )}
              {status === "valid" && (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Valid channel found</span>
                </>
              )}
              {status === "invalid" && (
                <>
                  <XCircle className="h-4 w-4" />
                  <span>Invalid URL or channel not whitelisted</span>
                </>
              )}
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={status !== "valid"}>
            Add Source
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
