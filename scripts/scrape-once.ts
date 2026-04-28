#!/usr/bin/env -S npx tsx
import { seedIfEmpty } from "../src/lib/seed";
import { runScraper } from "../src/lib/scraper/orchestrator";

async function main(): Promise<void> {
  const seed = seedIfEmpty();
  console.log("seed:", seed);
  const res = await runScraper();
  console.log("scrape result:", res);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
