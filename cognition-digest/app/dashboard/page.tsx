"use client"

import { useState } from "react"
import { NavHeader } from "@/components/nav-header"
import { SubscriptionManager } from "@/components/subscription-manager"
import { GenerateReportForm } from "@/components/generate-report-form"
import { AddSourceDialog } from "@/components/add-source-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

/**
 * Dashboard page demonstrating API integration:
 * - SubscriptionManager: uses listSubscriptions, updateSubscription, deleteSubscription
 * - GenerateReportForm: uses generateOneTimeReport
 * - AddSourceDialog: uses parseYouTubeUrl, createSource
 */
export default function DashboardPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"subscriptions" | "generate">("subscriptions")

  return (
    <div className="min-h-screen bg-background">
      <NavHeader showUserMenu />

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your subscriptions and generate reports
          </p>
        </div>

        {/* Simple Tab Navigation */}
        <div className="mb-6 border-b border-border">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("subscriptions")}
              className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${
                activeTab === "subscriptions"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Subscriptions
            </button>
            <button
              onClick={() => setActiveTab("generate")}
              className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${
                activeTab === "generate"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Generate Report
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "subscriptions" && <SubscriptionManager />}
          {activeTab === "generate" && (
            <div className="mx-auto max-w-2xl">
              <GenerateReportForm />
            </div>
          )}
        </div>
      </main>

      {/* Floating Add Button */}
      <Button
        onClick={() => setDialogOpen(true)}
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-primary shadow-lg hover:bg-primary/90"
        size="icon"
      >
        <Plus className="h-6 w-6 text-primary-foreground" />
      </Button>

      {/* Add Source Dialog */}
      <AddSourceDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
