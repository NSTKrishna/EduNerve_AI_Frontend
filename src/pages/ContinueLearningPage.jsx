
import { Link } from "react-router-dom"
import { Home, Share2, Sun, ExternalLink } from "lucide-react"
import { dsaHighlight, dsaPracticeResources, webDevFoundation } from "../data/continueContent"

export default function ContinueLearningPage() { 
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNavigation />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 py-12 sm:px-6 lg:px-8">
        <DsaSection />
        <WebDevelopmentSection />
      </main>
    </div>
  )
}

function TopNavigation() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-border/70 px-3 py-1 text-sm font-medium text-muted-foreground transition hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Home
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  item.active ? "bg-card text-foreground shadow" : "text-muted-foreground hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-border/70 bg-card/70 p-2 text-muted-foreground transition hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Share"
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-border/70 bg-card/70 p-2 text-muted-foreground transition hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4" aria-hidden="true" />
          </button>
          <Link
            to="/login"
            className="inline-flex items-center rounded-full border border-border/70 bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Login/Signup
          </Link>
        </div>
      </div>
    </header>
  )
}

const navItems = [
  { label: "Web Dev", to: "/learning", active: false },
  { label: "Interview Prep", to: "/interviews", active: false },
  { label: "DSA", to: "/learning/continue", active: true },
  { label: "Project Showcase", to: "/projects", active: false },
  { label: "More", to: "#", active: false },
]

function DsaSection() {
  return (
    <section className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Data Structures & Algorithms</p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Data Structures & Algorithms</h1>
      </div>

      <div className="rounded-3xl border border-border bg-card/80 p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-semibold text-foreground">{dsaHighlight.title}</p>
            <p className="text-sm text-muted-foreground">{dsaHighlight.description}</p>
          </div>
          <a
            href={dsaHighlight.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {dsaHighlight.ctaLabel}
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Practice Resources</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {dsaPracticeResources.map((resource) => (
            <article
              key={resource.id}
              className="rounded-2xl border border-border bg-card/80 p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="text-lg font-semibold text-foreground">{resource.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{resource.description}</p>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Visit Resource
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function WebDevelopmentSection() {
  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Web Development</p>
          <h2 className="mt-3 text-4xl font-bold">{webDevFoundation.title}</h2>
          <p className="mt-2 max-w-2xl text-lg text-muted-foreground">{webDevFoundation.description}</p>
        </div>
        <Link
          to="/learning"
          className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Back to WebDev
        </Link>
      </div>

      {webDevFoundation.modules.map((module) => (
        <article
          key={module.id}
          className="rounded-3xl border border-border bg-card/80 p-8 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl space-y-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-primary">Key Topics</p>
                <h3 className="mt-2 text-2xl font-semibold text-foreground">{module.title}</h3>
              </div>
              <ol className="space-y-3 text-sm text-muted-foreground">
                {module.keyTopics.map((topic, index) => (
                  <li key={topic} className="flex gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border/70 text-xs font-semibold text-foreground">
                      {index + 1}
                    </span>
                    <span className="leading-relaxed">{topic}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex w-full max-w-sm flex-col gap-4">
              <div className="rounded-2xl border border-border/70 bg-background/70 p-5">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Learning Resources</h4>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {module.resources.map((resource) => (
                    <li key={resource.title}>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full px-0 py-1 text-left text-sm font-medium text-foreground transition hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        {resource.title}
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/70 p-5">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Practice Task</h4>
                <p className="mt-2 text-sm leading-relaxed text-foreground/80">{module.practiceTask}</p>
              </div>
            </div>
          </div>
        </article>
      ))}
    </section>
  )
}