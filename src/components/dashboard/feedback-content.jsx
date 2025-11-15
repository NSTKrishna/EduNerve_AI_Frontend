import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, ThumbsUp, Clock, CheckCircle2 } from "lucide-react"

const interviewResults = [
  {
    id: 1,
    title: "Technical Interview - Data Structures",
    date: "June 15, 2024",
    interviewer: "Dr. Sarah Johnson",
    rating: "Excellent",
    score: 92,
    feedback:
      "Demonstrated exceptional understanding of data structures and algorithms. Problem-solving approach was methodical and efficient. Strong communication throughout the session.",
    strengths: ["Algorithm optimization", "Clear communication", "Time complexity analysis"],
    improvements: ["Edge case handling", "Code documentation"],
    status: "completed",
  },
  {
    id: 2,
    title: "Behavioral Interview - Team Collaboration",
    date: "June 10, 2024",
    interviewer: "Prof. Michael Chen",
    rating: "Good",
    score: 85,
    feedback:
      "Good examples of teamwork and leadership. Could provide more specific metrics and outcomes in responses. Overall positive performance.",
    strengths: ["Leadership examples", "Conflict resolution", "Active listening"],
    improvements: ["Quantifiable results", "More diverse examples"],
    status: "completed",
  },
  {
    id: 3,
    title: "System Design - Scalability",
    date: "June 5, 2024",
    interviewer: "Dr. Emily Rodriguez",
    rating: "Very Good",
    score: 88,
    feedback:
      "Solid understanding of distributed systems and scalability patterns. Good trade-off analysis between different architectural approaches.",
    strengths: ["System architecture", "Trade-off analysis", "Scalability concepts"],
    improvements: ["Database sharding", "Caching strategies"],
    status: "completed",
  },
  {
    id: 4,
    title: "Mock Interview - Frontend Development",
    date: "June 20, 2024",
    interviewer: "Dr. James Wilson",
    rating: "Pending",
    score: 0,
    feedback: "Feedback will be available within 48 hours.",
    strengths: [],
    improvements: [],
    status: "pending",
  },
]

export function FeedbackContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Feedback & Results</h1>
        <p className="text-muted-foreground mt-1">Review your interview feedback and performance insights</p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Interviews</p>
                <p className="text-2xl font-bold text-foreground">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <CheckCircle2 className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-foreground">9</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10">
                <Clock className="h-5 w-5 text-chart-3" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-foreground">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4/10">
                <ThumbsUp className="h-5 w-5 text-chart-4" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Score</p>
                <p className="text-2xl font-bold text-foreground">87%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interview Results */}
      <div className="space-y-4">
        {interviewResults.map((result) => (
          <Card key={result.id}>
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{result.title}</CardTitle>
                  <CardDescription>
                    <span className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      {result.date} • Interviewer: {result.interviewer}
                    </span>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  {result.status === "completed" && (
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Score</p>
                      <p className="text-2xl font-bold text-foreground">{result.score}%</p>
                    </div>
                  )}
                  <Badge
                    variant={result.status === "pending" ? "secondary" : result.score >= 90 ? "default" : "outline"}
                    className="h-fit"
                  >
                    {result.rating}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Feedback */}
              <div>
                <h4 className="font-semibold text-foreground mb-2">Overall Feedback</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{result.feedback}</p>
              </div>

              {/* Strengths and Improvements */}
              {result.status === "completed" && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <ThumbsUp className="h-4 w-4 text-accent" />
                      Strengths
                    </h4>
                    <ul className="space-y-1">
                      {result.strengths.map((strength, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-accent mt-1">•</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      Areas for Improvement
                    </h4>
                    <ul className="space-y-1">
                      {result.improvements.map((improvement, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Action Button */}
              {result.status === "completed" && (
                <div className="pt-2">
                  <Button variant="outline" size="sm">
                    View Detailed Report
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
