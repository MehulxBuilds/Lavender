import Link from "next/link"

const platformPillars = [
  {
    title: "Authentication & Security",
    stack: "Better Auth",
    points: [
      "OAuth + Email authentication",
      "Secure session lifecycle handling",
      "Multi-tenant organizations with RBAC",
    ],
  },
  {
    title: "AI Code Review",
    stack: "Google Gemini",
    points: [
      "Automated PR reviews with contextual feedback",
      "Inline suggestions on changed lines",
      "Bug, anti-pattern, and refactor detection",
    ],
  },
  {
    title: "Event-Driven Workflows",
    stack: "Inngest",
    points: [
      "Webhook-to-workflow orchestration",
      "Durable retries and failure handling",
      "Scales with high PR volume",
    ],
  },
  {
    title: "Semantic Intelligence",
    stack: "Pinecone",
    points: [
      "Vector-based code similarity search",
      "Past review memory for stronger context",
      "Repository-level insight discovery",
    ],
  },
  {
    title: "Billing & Subscriptions",
    stack: "Polar.sh",
    points: [
      "Team and enterprise subscription tiers",
      "Usage-based AI billing",
      "Secure checkout + lifecycle sync",
    ],
  },
  {
    title: "Database & Persistence",
    stack: "PostgreSQL",
    points: [
      "Structured entities for users, repos, PRs, reviews",
      "Audit logs for review actions",
      "Optimized indexing for large codebases",
    ],
  },
]

const reviewFlow = [
  "Pull Request opened/updated -> Webhook received",
  "Event dispatch triggers Inngest workflow",
  "Diff processed by Gemini for AI feedback",
  "Results saved to PostgreSQL + Pinecone",
  "Feedback shown in Lavendar and Git provider",
]

const page = async () => {
  return (
    <main className="relative min-h-dvh overflow-clip bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 top-10 h-72 w-72 rounded-full bg-red-600/35 blur-3xl" />
        <div className="absolute right-[-120px] top-0 h-96 w-96 rounded-full bg-red-500/25 blur-3xl" />
        <div className="absolute bottom-[-140px] left-1/2 h-[25rem] w-[25rem] -translate-x-1/2 rounded-full bg-red-700/20 blur-3xl" />
      </div>
      <div className="relative z-10">
      <section className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pb-16 lg:pt-8">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-red-600/40 via-red-950/55 to-black p-4 shadow-[0_0_80px_-25px_rgba(239,68,68,0.65)] sm:p-6 lg:p-8">
          <nav className="mb-8 flex items-center justify-between rounded-2xl border border-white/10 bg-black/45 px-4 py-3 backdrop-blur sm:px-5">
            <div className="text-lg font-semibold tracking-tight sm:text-xl">
              Lavendar
            </div>
            <div className="flex items-center gap-2">
              <a
                href="#features"
                className="rounded-full border border-white/20 px-3 py-1.5 text-xs text-white/80 transition hover:border-red-400/70 hover:text-white sm:text-sm"
              >
                Features
              </a>
              <a
                href="#flow"
                className="rounded-full border border-white/20 px-3 py-1.5 text-xs text-white/80 transition hover:border-red-400/70 hover:text-white sm:text-sm"
              >
                Workflow
              </a>
              <Link
                href={'/dashboard'}
                className="rounded-full bg-gradient-to-r from-red-600 to-red-400 px-4 py-1.5 text-xs font-medium text-white transition hover:brightness-110 sm:text-sm"
              >
                Get Started
              </Link>
            </div>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="mb-4 inline-flex rounded-full border border-red-400/35 bg-red-900/30 px-3 py-1 text-xs tracking-[0.2em] text-red-200 uppercase">
                AI Code Review Platform
              </p>
              <h1 className="max-w-4xl text-4xl leading-[0.95] font-semibold tracking-tight sm:text-6xl lg:text-7xl">
                Ship Cleaner Pull Requests at{" "}
                <span className="bg-gradient-to-r from-red-200 via-red-400 to-red-500 bg-clip-text text-transparent">
                  Team Speed
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-sm text-white/80 sm:text-base">
                Lavendar automatically analyzes PRs, suggests fixes, detects
                bugs, and improves code quality with a modular monolith that
                blends AI, auth, billing, and event pipelines into one focused
                developer experience.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/dashboard"
                  className="rounded-full bg-gradient-to-r from-red-600 to-red-400 px-5 py-2.5 text-sm font-medium text-white transition hover:brightness-110"
                >
                  Start Reviewing
                </Link>
                <a
                  href="#architecture"
                  className="rounded-full border border-white/20 bg-black/30 px-5 py-2.5 text-sm text-white/85 transition hover:border-red-400/60 hover:text-white"
                >
                  Explore Architecture
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/55 p-4 backdrop-blur sm:p-5">
              <p className="text-xs tracking-[0.18em] text-red-300 uppercase">
                Built With
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-white/80 sm:text-sm">
                {[
                  "Next.js",
                  "TypeScript",
                  "Inngest",
                  "Better Auth",
                  "Google Gemini",
                  "Polar.sh",
                  "PostgreSQL",
                  "Pinecone",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid gap-3 rounded-2xl border border-white/10 bg-black/55 p-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: "50%+", v: "Review time reduced" },
            { k: "5-Step", v: "AI review flow" },
            { k: "Multi-Tenant", v: "Org-ready architecture" },
            { k: "Production", v: "Durable background jobs" },
          ].map((stat) => (
            <div
              key={stat.v}
              className="rounded-xl border border-white/10 bg-gradient-to-br from-red-950/35 to-black px-4 py-3"
            >
              <p className="text-2xl font-semibold text-red-300">{stat.k}</p>
              <p className="text-sm text-white/70">{stat.v}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="features"
        className="relative mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8 lg:pb-14"
      >
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs tracking-[0.2em] text-red-300 uppercase">
              Comprehensive Features
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Everything Needed for Reliable AI Reviews
            </h2>
          </div>
          <p className="max-w-xl text-sm text-white/70">
            Security, intelligence, billing, and storage connected in one
            coherent workflow for engineering teams.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {platformPillars.map((pillar) => (
            <article
              key={pillar.title}
              className="group rounded-2xl border border-white/10 bg-gradient-to-br from-black to-red-950/20 p-5 transition hover:border-red-400/45 hover:shadow-[0_0_50px_-30px_rgba(239,68,68,0.8)]"
            >
              <p className="mb-3 inline-flex rounded-full border border-red-400/35 bg-red-900/30 px-2.5 py-1 text-[11px] tracking-wide text-red-200 uppercase">
                {pillar.stack}
              </p>
              <h3 className="text-xl font-semibold tracking-tight">
                {pillar.title}
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-white/75">
                {pillar.points.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-400" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section
        id="architecture"
        className="relative mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8 lg:pb-14"
      >
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-white/10 bg-black/55 p-6">
            <p className="text-xs tracking-[0.2em] text-red-300 uppercase">
              Architecture Deep Dive
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              Modular Monolith, Event-First Design
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/75 sm:text-base">
              Lavendar keeps core domains like Auth, Billing, AI Review, and
              Organizations in one codebase while orchestrating operations via
              structured event flows. The result is fast iteration speed
              without sacrificing reliability.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-red-900/30 to-black p-6">
            <p className="text-xs tracking-[0.2em] text-red-300 uppercase">
              Frontend Experience
            </p>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li>App Router architecture for scale</li>
              <li>Server Actions and API route integration</li>
              <li>End-to-end TypeScript type safety</li>
              <li>Responsive dashboard for review operations</li>
            </ul>
          </div>
        </div>
      </section>

      <section
        id="flow"
        className="relative mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8 lg:pb-20"
      >
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-black via-black to-red-950/35 p-6 sm:p-8">
          <p className="text-xs tracking-[0.2em] text-red-300 uppercase">
            Data Flow for AI Code Review
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            From Webhook Trigger to Actionable Feedback
          </h3>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {reviewFlow.map((step, index) => (
              <div
                key={step}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <p className="mb-2 text-sm font-semibold text-red-300">
                  0{index + 1}
                </p>
                <p className="text-sm text-white/75">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="cta"
        className="relative mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20"
      >
        <div className="rounded-3xl border border-red-400/30 bg-gradient-to-r from-red-700/35 via-red-800/20 to-black p-6 text-center sm:p-10">
          <p className="text-xs tracking-[0.2em] text-red-200 uppercase">
            Ready To Upgrade Reviews
          </p>
          <h3 className="mx-auto mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Deploy Lavendar and turn every pull request into clear, reliable
            engineering feedback.
          </h3>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#"
              className="rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black transition hover:bg-red-100"
            >
              Start Free Trial
            </a>
            <a
              href="#features"
              className="rounded-full border border-white/30 px-6 py-2.5 text-sm text-white transition hover:border-red-300/70"
            >
              View Feature Set
            </a>
          </div>
        </div>
      </section>
      </div>
    </main>
  )
}

export default page
