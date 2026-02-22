"use client";

import { Leaf } from "lucide-react";
import Link from "next/link"
import { useRouter } from "next/navigation"

const navItems = ["About", "Features", "Workflow", "Pricing", "FAQ"]

const partnerBadges = [
  "GitHub Ready",
  "Google Gemini",
  "Inngest",
  "Pinecone",
  "Polar.sh",
]

const whyNot = [
  "Slow and inconsistent review communication",
  "Surface-level comments without code context",
  "No memory of past issues and patterns",
  "Generic suggestions with low signal",
  "Hard to scale with growing repositories",
]

const whyLavendar = [
  "Proactive, contextual AI code feedback",
  "Workflow-native review automation",
  "Semantic memory across historical reviews",
  "Actionable fixes, summaries, and refactors",
  "Built for teams shipping at high velocity",
]

const faqs = [
  "How does Lavendar review pull requests automatically?",
  "Can Lavendar post feedback back to GitHub?",
  "How does usage-based billing work with Polar.sh?",
  "Is organization-level RBAC supported?",
]

const Page = () => {
  const router = useRouter();
  const handleRedirectDashboard = () => {
    router.push("/dashboard");
  }
  return (
    <main className="relative min-h-dvh overflow-clip bg-[#040404] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-180px] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-gradient-to-b from-red-600/25 via-orange-500/20 to-transparent blur-3xl" />
        <div className="absolute left-[-180px] top-1/3 h-[24rem] w-[24rem] rounded-full bg-red-700/15 blur-3xl" />
        <div className="absolute right-[-220px] bottom-16 h-[28rem] w-[28rem] rounded-full bg-orange-500/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pb-24 lg:pt-8">
        <header className="flex justify-center">
          <div className="inline-flex w-full max-w-3xl items-center justify-between rounded-2xl border border-white/10 bg-black/60 p-1.5 shadow-[0_0_30px_-10px_rgba(239,68,68,0.5)] backdrop-blur">
            <div className="flex gap-2 items-center">
              <Link
                href="/"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-sm font-semibold"
              >
                <Leaf />
              </Link>
              <p className="text-lg font-semibold">Lavender</p>
            </div>

            <nav className="hidden items-center gap-1.5 md:flex">
              {navItems.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="rounded-lg px-3 py-2 text-xs text-white/75 transition hover:bg-white/10 hover:text-white"
                >
                  {item}
                </a>
              ))}
            </nav>

            <button onClick={handleRedirectDashboard} className="rounded-xl bg-gradient-to-r from-red-500 via-red-500 to-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-[0_8px_25px_-12px_rgba(249,115,22,0.85)] transition hover:brightness-110">
              Sign In
            </button>
          </div>
        </header>

        <section className="mx-auto mt-16 max-w-4xl text-center sm:mt-20">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
            <div className="flex -space-x-2">
              <span className="h-6 w-6 rounded-full border border-black bg-gradient-to-br from-red-400 to-orange-400" />
              <span className="h-6 w-6 rounded-full border border-black bg-gradient-to-br from-orange-300 to-red-500" />
              <span className="h-6 w-6 rounded-full border border-black bg-gradient-to-br from-red-300 to-orange-500" />
              <span className="h-6 w-6 rounded-full border border-black bg-gradient-to-br from-orange-400 to-red-600" />
            </div>
            <span className="text-xs text-white/70">200+ engineering teams scale with Lavendar</span>
          </div>

          <h1 className="mt-8 text-4xl leading-[1.02] font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Ready to scale your
            <br />
            code quality with
            <span className="bg-gradient-to-r from-red-300 via-orange-300 to-red-400 bg-clip-text text-transparent">
              {" "}
              AI reviews?
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
            Lavendar analyzes pull requests, flags bugs, and suggests smarter improvements with contextual feedback
            across your workflow.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button onClick={handleRedirectDashboard} className="rounded-xl bg-gradient-to-r from-red-500 via-red-500 to-orange-500 px-5 py-2.5 text-sm font-medium text-white shadow-[0_10px_25px_-12px_rgba(249,115,22,0.85)] transition hover:brightness-110">
              Get Started
            </button>
            <button className="rounded-xl border border-white/15 bg-white/[0.03] px-5 py-2.5 text-sm text-white/80 transition hover:border-white/25 hover:bg-white/[0.05] hover:text-white">
              Learn More
            </button>
          </div>

          <div className="pointer-events-none mx-auto mt-10 h-44 max-w-xl rounded-[999px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.95)_0%,rgba(251,146,60,0.7)_22%,rgba(239,68,68,0.45)_42%,rgba(0,0,0,0)_70%)] blur-md sm:h-56" />
        </section>

        <section className="mt-8 sm:mt-12">
          <p className="text-center text-xs text-white/45">You&apos;re in good hands:</p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {partnerBadges.map((badge) => (
              <div
                key={badge}
                className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-center text-sm font-medium text-white/70"
              >
                {badge}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 sm:mt-24">
          <div className="mx-auto max-w-4xl text-center">
            <p className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/65">
              Comparison
            </p>
            <h2 className="mt-6 text-3xl leading-tight font-semibold sm:text-5xl">
              But, why would you want
              <br />
              to work <span className="text-orange-300">with us?</span>
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <h3 className="mb-4 text-lg font-medium text-white/75">Other Platforms</h3>
              <ul className="space-y-3 text-sm text-white/55">
                {whyNot.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <span className="mt-[3px] text-white/45">x</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-2xl border border-orange-300/25 bg-gradient-to-br from-orange-400/25 via-red-500/12 to-black p-5 shadow-[0_0_50px_-25px_rgba(251,146,60,0.9)]">
              <h3 className="mb-4 text-lg font-semibold text-orange-100">Lavendar</h3>
              <ul className="space-y-3 text-sm text-white/85">
                {whyLavendar.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <span className="mt-[3px] text-orange-300">+</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="mt-12 sm:mt-16">
          <div className="space-y-3">
            {faqs.map((question) => (
              <button
                key={question}
                className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-left text-sm text-white/75 transition hover:border-orange-300/35 hover:text-white"
              >
                <span>{question}</span>
                <span className="text-orange-300">+</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

export default Page
