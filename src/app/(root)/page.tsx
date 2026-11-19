"use client";

import { GithubIcon, Leaf } from "lucide-react";
import Link from "next/link"
import { useRouter } from "next/navigation"

const navItems = ["About", "Features", "Workflow", "Pricing", "FAQ"]

const partnerBadges = [
  "GitHub Ready",
  "Google Gemini",
  "Kafka",
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
  {
    question: "How does Lavendar review pull requests automatically?",
    answer:
      "Lavendar connects to your repository, listens for pull request events, and runs contextual analysis against the changed files before posting review feedback.",
  },
  {
    question: "Can Lavendar post feedback back to GitHub?",
    answer:
      "Yes. Review output is sent directly as GitHub pull request comments so your team can triage issues without leaving its existing workflow.",
  },
  {
    question: "How does usage-based billing work with Polar.sh?",
    answer:
      "Usage is metered by review activity and billed through Polar.sh based on your selected plan, with billing data tracked against your workspace usage.",
  },
  {
    question: "Is organization-level RBAC supported?",
    answer:
      "Yes. Lavendar supports role-based access controls for teams so repository permissions and review controls can be managed at an organization level.",
  },
]

const Page = () => {
  const router = useRouter();
  const handleRedirectDashboard = () => {
    router.push("/dashboard");
  }

  const handleRedirectSignIn = () => {
    router.push("/sign-in");
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
            <Link href="/" className="flex gap-2 items-center">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-sm font-semibold"
              >
                <Leaf />
              </div>
              <p className="text-lg font-semibold">Lavender</p>
            </Link>

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

            <div className="flex items-center justify-center gap-2">
              <Link href={"https://github.com/MehulxBuilds/Lavender"} target="_blank" className="bg-white size-8 rounded-full text-xs font-semibold text-[#f3f3f3] shadow-[0_8px_25px_-12px_rgba(249,115,22,0.85)] transition hover:brightness-110 flex justify-center items-center">
                <GithubIcon size={16} className="text-black" />
              </Link>

              <button onClick={handleRedirectSignIn} className="rounded-[10px] bg-gradient-to-r from-red-500 via-red-500 to-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-[0_8px_25px_-12px_rgba(249,115,22,0.85)] transition hover:brightness-110">
                Sign In
              </button>
            </div>
          </div>
        </header>

        <section className="mx-auto mt-16 max-w-4xl text-center sm:mt-20">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
            <div className="flex -space-x-2">

              <span className="h-6 w-6 rounded-full border border-black bg-white flex items-center justify-center">
                <svg className="object-cover p-1" viewBox="0 0 70 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M37.2551 1.61586C38.1803 0.653384 39.4368 0.112671 40.7452 0.112671C46.6318 0.112671 52.1793 0.112674 57.6424 0.112685C68.6302 0.112708 74.1324 13.9329 66.3629 22.0156L49.4389 39.6217C48.662 40.43 47.3335 39.8575 47.3335 38.7144V23.2076L49.2893 21.1729C50.8432 19.5564 49.7427 16.7923 47.5451 16.7923H22.6667L37.2551 1.61586Z" fill="#3A04FF"></path>
                  <path d="M32.7449 38.3842C31.8198 39.3467 30.5633 39.8874 29.2549 39.8874C23.3683 39.8874 17.8208 39.8874 12.3577 39.8874C1.36983 39.8873 -4.13236 26.0672 3.63721 17.9844L20.5612 0.378369C21.3381 -0.429908 22.6666 0.142547 22.6666 1.28562L22.6667 16.7923L20.7108 18.8271C19.1569 20.4437 20.2574 23.2077 22.455 23.2077L47.3335 23.2076L32.7449 38.3842Z" fill="#3A04FF"></path>
                </svg>
              </span>

              <span className="h-6 w-6 rounded-full border border-black bg-white flex items-center justify-center">
                <svg className="object-cover p-1" id="logo-88" width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M13.7146 0.516113C11.4582 0.516113 9.2943 1.41245 7.69881 3.00794L0 10.7067V14.2307C0 16.7204 1.06944 18.9603 2.77401 20.5161C1.06944 22.0719 0 24.3118 0 26.8015V30.3255L7.69881 38.0243C9.2943 39.6198 11.4582 40.5161 13.7146 40.5161C16.2043 40.5161 18.4442 39.4467 20 37.7421C21.5558 39.4467 23.7957 40.5161 26.2854 40.5161C28.5418 40.5161 30.7057 39.6198 32.3012 38.0243L40 30.3255V26.8015C40 24.3118 38.9306 22.0719 37.226 20.5161C38.9306 18.9603 40 16.7204 40 14.2307V10.7067L32.3012 3.00794C30.7057 1.41245 28.5418 0.516113 26.2854 0.516113C23.7957 0.516113 21.5558 1.58555 20 3.29012C18.4442 1.58555 16.2043 0.516113 13.7146 0.516113ZM25.7588 20.5161C25.6629 20.4286 25.5688 20.3387 25.4766 20.2465L20 14.7699L14.5234 20.2465C14.4312 20.3387 14.3371 20.4286 14.2412 20.5161C14.3371 20.6036 14.4312 20.6935 14.5234 20.7857L20 26.2623L25.4766 20.7857C25.5688 20.6935 25.6629 20.6036 25.7588 20.5161ZM22.2222 30.3255L22.2222 32.0085C22.2222 34.2525 24.0414 36.0717 26.2854 36.0717C27.363 36.0717 28.3965 35.6436 29.1585 34.8816L35.5556 28.4845V26.8015C35.5556 24.5575 33.7364 22.7383 31.4924 22.7383C30.4148 22.7383 29.3813 23.1664 28.6193 23.9284L22.2222 30.3255ZM17.7778 30.3255L11.3807 23.9284C10.6187 23.1664 9.58524 22.7383 8.50762 22.7383C6.26359 22.7383 4.44444 24.5575 4.44444 26.8015V28.4845L10.8415 34.8816C11.6035 35.6436 12.637 36.0717 13.7146 36.0717C15.9586 36.0717 17.7778 34.2525 17.7778 32.0085V30.3255ZM17.7778 9.02373V10.7067L11.3807 17.1038C10.6187 17.8658 9.58524 18.2939 8.50762 18.2939C6.26359 18.2939 4.44444 16.4747 4.44444 14.2307V12.5477L10.8415 6.15063C11.6035 5.38864 12.637 4.96056 13.7146 4.96056C15.9586 4.96056 17.7778 6.7797 17.7778 9.02373ZM28.6193 17.1038L22.2222 10.7067L22.2222 9.02373C22.2222 6.7797 24.0414 4.96056 26.2854 4.96056C27.363 4.96056 28.3965 5.38864 29.1585 6.15063L35.5556 12.5477V14.2307C35.5556 16.4747 33.7364 18.2939 31.4924 18.2939C30.4148 18.2939 29.3813 17.8658 28.6193 17.1038Z" fill="#FF630B"></path></svg>
              </span>

              <span className="h-6 w-6 rounded-full border border-black bg-white flex items-center justify-center">
                <svg className="object-cover p-1" id="logo-85" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M10 0C15.5228 0 20 4.47715 20 10V0H30C35.5228 0 40 4.47715 40 10C40 15.5228 35.5228 20 30 20C35.5228 20 40 24.4772 40 30C40 32.7423 38.8961 35.2268 37.1085 37.0334L37.0711 37.0711L37.0379 37.1041C35.2309 38.8943 32.7446 40 30 40C27.2741 40 24.8029 38.9093 22.999 37.1405C22.9756 37.1175 22.9522 37.0943 22.9289 37.0711C22.907 37.0492 22.8852 37.0272 22.8635 37.0051C21.0924 35.2009 20 32.728 20 30C20 35.5228 15.5228 40 10 40C4.47715 40 0 35.5228 0 30V20H10C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0ZM18 10C18 14.4183 14.4183 18 10 18V2C14.4183 2 18 5.58172 18 10ZM38 30C38 25.5817 34.4183 22 30 22C25.5817 22 22 25.5817 22 30H38ZM2 22V30C2 34.4183 5.58172 38 10 38C14.4183 38 18 34.4183 18 30V22H2ZM22 18V2L30 2C34.4183 2 38 5.58172 38 10C38 14.4183 34.4183 18 30 18H22Z" fill="#5417D7"></path></svg>
              </span>

              <span className="h-6 w-6 rounded-full border border-black bg-white flex items-center justify-center">
                <svg className="object-cover p-1" width="67" height="41" viewBox="0 0 67 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M45.0353 4.66312C45.8331 3.77669 46.7195 3.04539 47.6281 2.46921C49.2236 1.47198 50.9079 0.940125 52.6364 0.940125V15.411C51.3732 11.0232 48.6475 7.25591 45.0353 4.66312ZM66.5533 40.9401H15.2957C6.87461 40.9401 0.0712891 34.1146 0.0712891 25.7157C0.0712891 17.6714 6.3206 11.0675 14.232 10.5135V0.940125C16.0048 0.940125 17.7555 1.44982 19.3954 2.46921C20.304 3.02323 21.1904 3.75453 21.9882 4.59663C25.2458 2.31409 29.1904 0.984446 33.4674 0.984446C33.4674 10.2254 30.1433 20.9734 19.3289 20.9955H33.3566C32.9577 19.2005 31.3178 17.8709 29.3677 17.8487H37.5228C35.5727 17.8487 33.9328 19.2005 33.5339 21.0177H46.6087C49.2236 21.0177 51.8164 21.5274 54.2541 22.5468C56.6696 23.544 58.8857 25.0288 60.725 26.8681C62.5865 28.7296 64.0491 30.9235 65.0464 33.339C66.0436 35.7324 66.5533 38.3252 66.5533 40.9401ZM22.8525 10.7795C23.1849 11.6437 24.0713 12.6188 25.3123 13.3279C26.5533 14.0371 27.8386 14.3252 28.7472 14.1922C28.4148 13.3279 27.5284 12.3529 26.2874 11.6437C25.0464 10.9346 23.761 10.6465 22.8525 10.7795ZM41.5117 13.3279C40.2707 14.0371 38.9854 14.3252 38.0768 14.1922C38.4092 13.3279 39.2957 12.3529 40.5367 11.6437C41.7777 10.9346 43.063 10.6465 43.9716 10.7795C43.6613 11.6437 42.7527 12.6188 41.5117 13.3279Z" fill="#283841"></path>
                </svg>
              </span>

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
            <Link href={"#learn-more"} className="rounded-xl border border-white/15 bg-white/[0.03] px-5 py-2.5 text-sm text-white/80 transition hover:border-white/25 hover:bg-white/[0.05] hover:text-white">
              Learn More
            </Link>
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

        <section className="mt-20 sm:mt-24" id="learn-more">
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
          <div className="mb-6 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-white/45">FAQ</p>
            <h3 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
              Everything you need to know
            </h3>
          </div>
          <div className="space-y-3">
            {faqs.map((item) => (
              <details
                key={item.question}
                className="group rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 transition hover:border-orange-300/35"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-sm text-white/75 marker:content-none">
                  <span>{item.question}</span>
                  <span className="text-orange-300 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 pr-6 text-sm leading-relaxed text-white/60">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

export default Page
