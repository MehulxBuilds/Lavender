export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { initQueueConsumers } = await import("@/workers/index");
    await initQueueConsumers();
  }
}
