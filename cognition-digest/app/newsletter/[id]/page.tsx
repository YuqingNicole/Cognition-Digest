import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

const mockNewsletter = {
  channel: {
    name: "Lex Fridman Podcast",
    logo: "/podcast-setup.png",
  },
  date: "March 15, 2024",
  title: "The Future of AI: Understanding Large Language Models",
  tldr: [
    "Large Language Models are trained on massive datasets using transformer architecture",
    "The attention mechanism allows models to weigh the importance of different words in context",
    "Scaling laws suggest that model performance improves predictably with increased compute",
    "Fine-tuning and prompt engineering are crucial techniques for adapting models",
    "Ethical considerations and limitations must be addressed as models become more powerful",
  ],
  keyIdeas: [
    {
      title: "Attention Mechanism",
      quote:
        "The attention mechanism is really just asking: which parts of the input should I focus on to predict the next token?",
      timestamp: "12:34",
    },
    {
      title: "Emergent Capabilities",
      quote: "We're not programming these models anymore—we're growing them through data and compute.",
      timestamp: "28:15",
    },
    {
      title: "Data Quality",
      quote:
        "The most powerful models aren't necessarily the largest ones, but the ones trained on the highest quality data.",
      timestamp: "35:42",
    },
  ],
}

export default function NewsletterPreviewPage() {
  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="mx-auto max-w-2xl">
        {/* Email Container */}
        <Card className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          {/* Header Banner */}
          <div className="border-b border-border bg-primary/5 px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                <span className="text-xl font-bold text-primary-foreground">C</span>
              </div>
              <div>
                <h1 className="font-semibold text-foreground">{mockNewsletter.channel.name}</h1>
                <p className="text-sm text-muted-foreground">Weekly Digest • {mockNewsletter.date}</p>
              </div>
            </div>
          </div>

          {/* Email Body */}
          <div className="px-8 py-8">
            {/* Title */}
            <h2 className="mb-6 text-xl font-bold leading-tight text-foreground">{mockNewsletter.title}</h2>

            {/* TL;DR Section */}
            <div className="mb-8">
              <h3 className="mb-4 text-base font-semibold text-foreground">TL;DR</h3>
              <ul className="space-y-2.5">
                {mockNewsletter.tldr.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator className="my-8" />

            {/* Key Ideas Section */}
            <div className="mb-8">
              <h3 className="mb-4 text-base font-semibold text-foreground">Key Ideas</h3>
              <div className="space-y-6">
                {mockNewsletter.keyIdeas.map((idea, i) => (
                  <div key={i} className="rounded-lg border border-border bg-muted/30 p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="font-medium text-foreground">{idea.title}</h4>
                      <Badge variant="secondary" className="rounded-md bg-primary/10 font-mono text-xs text-primary">
                        {idea.timestamp}
                      </Badge>
                    </div>
                    <blockquote className="border-l-2 border-primary pl-4 text-sm italic leading-relaxed text-muted-foreground">
                      {idea.quote}
                    </blockquote>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-8" />

            {/* CTA Button */}
            <div className="text-center">
              <a
                href="#"
                className="inline-block rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Read Full Report
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border bg-muted/30 px-8 py-6 text-center">
            <p className="mb-3 text-xs text-muted-foreground">
              You're receiving this because you subscribed to {mockNewsletter.channel.name}
            </p>
            <div className="flex items-center justify-center gap-4 text-xs">
              <a href="#" className="text-muted-foreground hover:text-foreground hover:underline">
                View on Web
              </a>
              <span className="text-border">•</span>
              <a href="#" className="text-muted-foreground hover:text-foreground hover:underline">
                Unsubscribe
              </a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
