#!/usr/bin/env -S npx tsx
import { seedIfEmpty } from "../src/lib/seed";
const r = seedIfEmpty();
console.log("seeded:", r);
