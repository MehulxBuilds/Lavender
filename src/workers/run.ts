import "dotenv/config";
import { initQueueConsumers } from "./index";

async function main() {
  const close = await initQueueConsumers();
  let stopping = false;
  const shutdown = async () => {
    if (stopping) return;
    stopping = true;
    try {
      await close();
      process.exit(0);
    } catch (error) {
      console.error("Failed to stop workers:", error);
      process.exit(1);
    }
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}
main().catch((error) => {
  console.error("Failed to start BullMQ workers:", error);
  process.exit(1);
});
