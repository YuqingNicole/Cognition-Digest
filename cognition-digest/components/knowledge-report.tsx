import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, User, Calendar, BookOpen, Lightbulb, Quote } from "lucide-react"

export function KnowledgeReport() {
  return (
    <div className="space-y-6">
      {/* Report Header */}
      <Card className="rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-bold leading-tight text-foreground">
              The Future of AI: Understanding Large Language Models
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A comprehensive overview of how LLMs work and their impact on technology
            </p>
          </div>
          <Badge className="ml-4 rounded-lg bg-primary/10 text-primary hover:bg-primary/20">Technology</Badge>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap gap-6 border-t border-border pt-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Andrej Karpathy</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>42 min</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>March 15, 2024</span>
          </div>
        </div>
      </Card>

      {/* Key Insights */}
      <Card className="rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Lightbulb className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Key Insights</h3>
            <p className="text-sm text-muted-foreground">Main takeaways from the video</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            "Large Language Models are trained on massive datasets using transformer architecture, enabling them to understand and generate human-like text.",
            "The attention mechanism allows models to weigh the importance of different words in context, making them highly effective at language tasks.",
            "Scaling laws suggest that model performance improves predictably with increased compute, data, and parameters.",
            "Fine-tuning and prompt engineering are crucial techniques for adapting pre-trained models to specific use cases.",
          ].map((insight, i) => (
            <div key={i} className="flex gap-4 rounded-lg bg-muted/30 p-4">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
                {i + 1}
              </div>
              <p className="leading-relaxed text-foreground">{insight}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Summary */}
      <Card className="rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Summary</h3>
            <p className="text-sm text-muted-foreground">Condensed overview</p>
          </div>
        </div>

        <div className="space-y-4 leading-relaxed text-foreground">
          <p>
            This video provides a deep dive into the architecture and training process of Large Language Models (LLMs).
            It begins with an explanation of the transformer architecture, highlighting the self-attention mechanism
            that enables models to process and understand context across long sequences of text.
          </p>
          <p>
            The presenter discusses the importance of pre-training on diverse datasets and how scaling compute resources
            has led to emergent capabilities in modern LLMs. Key concepts like tokenization, embeddings, and the role of
            positional encoding are explained with clear examples.
          </p>
          <p>
            The video concludes with practical applications, including fine-tuning strategies, prompt engineering
            techniques, and considerations for deploying LLMs in production environments. Ethical implications and
            limitations of current models are also addressed.
          </p>
        </div>
      </Card>

      {/* Notable Quotes */}
      <Card className="rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Quote className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Notable Quotes</h3>
            <p className="text-sm text-muted-foreground">Memorable moments</p>
          </div>
        </div>

        <div className="space-y-6">
          {[
            {
              quote:
                "The attention mechanism is really just asking: which parts of the input should I focus on to predict the next token?",
              timestamp: "12:34",
            },
            {
              quote: "We're not programming these models anymore—we're growing them through data and compute.",
              timestamp: "28:15",
            },
            {
              quote:
                "The most powerful models aren't necessarily the largest ones, but the ones trained on the highest quality data.",
              timestamp: "35:42",
            },
          ].map((item, i) => (
            <div key={i} className="border-l-2 border-primary pl-6">
              <p className="leading-relaxed text-foreground italic">&ldquo;{item.quote}&rdquo;</p>
              <p className="mt-2 text-sm text-muted-foreground">{item.timestamp}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
