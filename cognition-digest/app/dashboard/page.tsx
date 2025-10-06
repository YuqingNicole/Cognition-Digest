"use client"

import { useState } from "react"
import { NavHeader } from "@/components/nav-header"
import { SubscriptionCard } from "@/components/subscription-card"
import { AddSourceDialog } from "@/components/add-source-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const mockSubscriptions = [
  {
    id: "1",
    channelTitle: "Lex Fridman Podcast",
    channelImage: "/podcast-setup.png",
    frequency: "weekly",
    lastReport: "2024-03-15",
    enabled: true,
  },
  {
    id: "2",
    channelTitle: "Fireship",
    channelImage: "/interconnected-tech.png",
    frequency: "each",
    lastReport: "2024-03-14",
    enabled: true,
  },
  {
    id: "3",
    channelTitle: "3Blue1Brown",
    channelImage: "/math-symbols.png",
    frequency: "monthly",
    lastReport: "2024-03-01",
    enabled: false,
  },
]

export default function DashboardPage() {
  const [subscriptions, setSubscriptions] = useState(mockSubscriptions)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleToggle = (id: string) => {
    setSubscriptions((prev) => prev.map((sub) => (sub.id === id ? { ...sub, enabled: !sub.enabled } : sub)))
  }

  const handleFrequencyChange = (id: string, frequency: string) => {
    setSubscriptions((prev) => prev.map((sub) => (sub.id === id ? { ...sub, frequency } : sub)))
  }

  return (
    <div className="min-h-screen bg-background">
      <NavHeader showUserMenu />

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-foreground">Your Subscriptions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your YouTube channel subscriptions and report frequency
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {subscriptions.map((sub) => (
            <SubscriptionCard
              key={sub.id}
              {...sub}
              onToggle={() => handleToggle(sub.id)}
              onFrequencyChange={(freq) => handleFrequencyChange(sub.id, freq)}
            />
          ))}
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
