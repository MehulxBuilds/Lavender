import { PHASE_PRODUCTION_BUILD } from "next/constants";

export async function register() {
  // Never load worker dependencies in Edge or during static generation.
  if (process.env.NEXT_RUNTIME !== "nodejs" || process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) return;

  const { startEmbeddedWorkers } = await import("@/workers/lifecycle");
  await startEmbeddedWorkers();
}
