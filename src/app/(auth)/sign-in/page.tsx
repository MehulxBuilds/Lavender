"use client"

import { Button } from "@/components/ui/button"
import { signIn } from "@/lib/auth-client"
import { ArrowRight, Github, ShieldCheck, Sparkles } from "lucide-react"
import Link from "next/link"

const LoginPage = () => {
  return (
    <main className="relative min-h-dvh overflow-clip bg-[#030303] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-170px] h-[27rem] w-[27rem] -translate-x-1/2 rounded-full bg-gradient-to-b from-red-600/30 via-orange-500/20 to-transparent blur-3xl" />
        <div className="absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-red-700/20 blur-3xl" />
        <div className="absolute -right-24 bottom-8 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />
      </div>

      <section className="relative mx-auto flex w-full max-w-6xl items-center justify-center py-2 sm:py-6">
        <div className="grid w-full overflow-hidden rounded-[28px] border border-white/10 bg-black/70 shadow-[0_0_80px_-28px_rgba(249,115,22,0.75)] lg:grid-cols-2">
          <aside className="relative hidden min-h-[640px] border-r border-white/10 bg-gradient-to-br from-red-500/20 via-orange-500/15 to-black p-8 lg:flex lg:flex-col lg:justify-between">
            <div className="space-y-6">
              <Link href="/" className="inline-flex items-center gap-2">
                <span className="rounded-lg border border-white/20 bg-black/50 p-2">
                  <Sparkles className="h-4 w-4 text-orange-300" />
                </span>
                <span className="text-lg font-semibold tracking-tight">Lavendar</span>
              </Link>

              <div>
                <p className="mb-3 text-xs tracking-[0.24em] text-orange-300 uppercase">
                  AI Code Review Platform
                </p>
                <h1 className="text-4xl leading-tight font-semibold tracking-tight">
                  Review Faster,
                  <br />
                  Merge Safer.
                </h1>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-white/75">
                  Automated pull request feedback, bug detection, and inline
                  suggestions powered by Gemini, Inngest, PostgreSQL, and
                  Pinecone.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/80">
                <span className="mr-2 text-orange-300">01</span>
                Connect GitHub and start reviewing instantly
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white/80">
                <span className="mr-2 text-orange-300">02</span>
                AI analyzes every PR diff and comments contextually
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white/80">
                <span className="mr-2 text-orange-300">03</span>
                Teams merge safer code with full audit visibility
              </div>
            </div>
          </aside>

          <div className="relative p-5 sm:p-8 lg:p-10">
            <div className="mx-auto w-full max-w-md">
              <Link href="/" className="inline-flex items-center gap-2 lg:hidden">
                <span className="rounded-lg border border-white/20 bg-black/60 p-2">
                  <Sparkles className="h-4 w-4 text-orange-300" />
                </span>
                <span className="text-base font-semibold tracking-tight">Lavendar</span>
              </Link>

              <div className="mt-6 lg:mt-0">
                <p className="text-xs tracking-[0.2em] text-orange-300 uppercase">
                  Welcome Back
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                  Sign in to your account
                </h2>
                <p className="mt-3 text-sm text-white/70">
                  Continue with GitHub to access your repositories and AI review
                  workspace.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <Button
                  className="h-11 w-full rounded-xl border border-white/15 bg-gradient-to-r from-red-500 via-red-500 to-orange-500 text-white shadow-[0_10px_25px_-12px_rgba(249,115,22,0.85)] hover:brightness-110"
                  onClick={() =>
                    signIn.social({
                      provider: "github",
                      callbackURL: "/",
                    })
                  }
                >
                  <Github className="h-4 w-4" />
                  Sign in with GitHub
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>

                <div className="rounded-xl border border-white/10 bg-black/45 p-4">
                  <p className="flex items-center gap-2 text-sm text-white/80">
                    <ShieldCheck className="h-4 w-4 text-orange-300" />
                    Secure OAuth powered by Better Auth
                  </p>
                  <p className="mt-1 text-xs text-white/60">
                    Session management, organization support, and role-based
                    access are enabled after sign in.
                  </p>
                </div>
              </div>

              <p className="mt-8 text-center text-sm text-white/65">
                New to Lavendar?{" "}
                <Link
                  href="/"
                  className="font-medium text-orange-300 transition hover:text-orange-200"
                >
                  Explore the platform
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default LoginPage
