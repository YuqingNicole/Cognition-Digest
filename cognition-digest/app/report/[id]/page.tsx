"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Download, Mail, ExternalLink } from "lucide-react"

const tocItems = [
  { id: "tldr", label: "TL;DR" },
  { id: "outline", label: "Outline" },
  { id: "key-ideas", label: "Key Ideas" },
  { id: "references", label: "References" },
]

const mockReport = {
  title: "The Future of AI: Understanding Large Language Models",
  channel: "Lex Fridman Podcast",
  date: "March 15, 2024",
  duration: "42 min",
  tldr: [
    "Large Language Models are trained on massive datasets using transformer architecture",
    "The attention mechanism allows models to weigh the importance of different words in context",
    "Scaling laws suggest that model performance improves predictably with increased compute",
    "Fine-tuning and prompt engineering are crucial techniques for adapting models",
  ],
  outline: [
    { time: "0:00", title: "Introduction to LLMs" },
    { time: "5:30", title: "Transformer Architecture" },
    { time: "15:45", title: "Training Process" },
    { time: "28:20", title: "Scaling Laws" },
    { time: "35:10", title: "Practical Applications" },
  ],
  keyIdeas: [
    {
      title: "Attention Mechanism",
      content:
        "The attention mechanism is the core innovation that enables transformers to process sequences effectively. It allows the model to focus on relevant parts of the input when making predictions.",
      timestamp: "12:34",
    },
    {
      title: "Emergent Capabilities",
      content:
        "As models scale, they develop unexpected capabilities that weren't explicitly trained. This phenomenon suggests that intelligence may emerge from sufficient scale and data.",
      timestamp: "28:15",
    },
  ],
  references: [
    { title: "Attention Is All You Need", url: "https://arxiv.org/abs/1706.03762" },
    { title: "GPT-3 Paper", url: "https://arxiv.org/abs/2005.14165" },
  ],
}

export default function ReportViewerPage() {
  const [activeSection, setActiveSection] = useState("tldr")

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Sidebar - TOC */}
      <aside className="w-64 border-r border-border bg-card">
        <div className="sticky top-0 p-6">
          <h3 className="mb-4 text-sm font-semibold text-muted-foreground">Contents</h3>
          <nav className="space-y-1">
            {tocItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  activeSection === item.id
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-sm">
          <div className="flex h-16 items-center justify-between px-6">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                PDF
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Mail className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <article className="mx-auto max-w-3xl px-6 py-12">
            {/* Report Header */}
            <div className="mb-12">
              <h1 className="text-xl font-bold leading-tight text-foreground">{mockReport.title}</h1>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>{mockReport.channel}</span>
                <span>•</span>
                <span>{mockReport.date}</span>
                <span>•</span>
                <span>{mockReport.duration}</span>
              </div>
            </div>

            {/* TL;DR Section */}
            <section id="tldr" className="mb-12">
              <h2 className="mb-6 text-xl font-bold text-foreground">TL;DR</h2>
              <ul className="space-y-3">
                {mockReport.tldr.map((item, i) => (
                  <li key={i} className="flex gap-3 leading-relaxed text-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <Separator className="my-12" />

            {/* Outline Section */}
            <section id="outline" className="mb-12">
              <h2 className="mb-6 text-xl font-bold text-foreground">Outline</h2>
              <div className="space-y-3">
                {mockReport.outline.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 rounded-lg bg-muted/30 p-4">
                    <span className="font-mono text-sm text-primary">{item.time}</span>
                    <span className="flex-1 text-foreground">{item.title}</span>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </section>

            <Separator className="my-12" />

            {/* Key Ideas Section */}
            <section id="key-ideas" className="mb-12">
              <h2 className="mb-6 text-xl font-bold text-foreground">Key Ideas</h2>
              <div className="space-y-6">
                {mockReport.keyIdeas.map((idea, i) => (
                  <div key={i} className="rounded-xl border border-border bg-card p-6">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">{idea.title}</h3>
                      <span className="rounded-lg bg-primary/10 px-3 py-1 font-mono text-xs text-primary">
                        {idea.timestamp}
                      </span>
                    </div>
                    <p className="leading-relaxed text-muted-foreground">{idea.content}</p>
                  </div>
                ))}
              </div>
            </section>

            <Separator className="my-12" />

            {/* References Section */}
            <section id="references" className="mb-12">
              <h2 className="mb-6 text-xl font-bold text-foreground">References</h2>
              <ul className="space-y-3">
                {mockReport.references.map((ref, i) => (
                  <li key={i}>
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {ref.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </article>
        </ScrollArea>
      </div>
    </div>
  )
}
