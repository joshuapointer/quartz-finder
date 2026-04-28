#!/usr/bin/env node
import cron from "node-cron";
import { seedIfEmpty } from "./src/lib/seed";
import { runScraper } from "./src/lib/scraper/orchestrator";

console.log("[worker] booting");
const seedRes = seedIfEmpty();
console.log("[worker] seed:", seedRes);

async function tick(): Promise<void> {
  const ts = new Date().toISOString();
  console.log("[worker] tick start", ts);
  try {
    const res = await runScraper();
    console.log("[worker] tick done", res);
  } catch (e) {
    console.error("[worker] tick failed", e);
  }
}

const schedule = process.env.PILLARPEARL_CRON ?? "0 * * * *";
cron.schedule(schedule, tick);
console.log("[worker] cron scheduled", schedule);

if (process.env.PILLARPEARL_RUN_ON_BOOT !== "false") {
  await tick();
}

process.stdin.resume();

const stop = (signal: string) => () => {
  console.log(`[worker] received ${signal}, shutting down`);
  process.exit(0);
};
process.on("SIGTERM", stop("SIGTERM"));
process.on("SIGINT", stop("SIGINT"));
