import { initQueueConsumers } from "./index";

type CloseWorkers = Awaited<ReturnType<typeof initQueueConsumers>>;
type WorkerState = {
  starting?: Promise<CloseWorkers>;
  stopping?: Promise<void>;
  signalsRegistered?: boolean;
};

const shared = globalThis as typeof globalThis & { lavenderWorkers?: WorkerState };
const state = shared.lavenderWorkers ??= {};

export async function startEmbeddedWorkers() {
  // Reuse the startup promise across concurrent calls and development reloads.
  if (!state.starting) {
    state.starting = initQueueConsumers().catch((error) => {
      state.starting = undefined;
      throw error;
    });
  }
  if (!state.signalsRegistered && process.env.NEXT_MANUAL_SIG_HANDLE) {
    state.signalsRegistered = true;
    const shutdown = () => {
      if (state.stopping) return;
      state.stopping = (async () => {
        // Leave five seconds before Render's default 30-second shutdown deadline.
        const deadline = setTimeout(() => process.exit(1), 25_000);
        try {
          const close = await state.starting;
          await close?.();
          clearTimeout(deadline);
          process.exit(0);
        } catch (error) {
          console.error("Failed to stop embedded workers:", error);
          process.exit(1);
        }
      })();
    };
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  }
  await state.starting;
}
