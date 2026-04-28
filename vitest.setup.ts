import "@testing-library/jest-dom/vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll } from "vitest";

const tmpDir = mkdtempSync(join(tmpdir(), "pillarpearl-test-"));
process.env.PILLARPEARL_DB = join(tmpDir, "test.db");
process.env.PILLARPEARL_IMAGE_DIR = join(tmpDir, "images");

beforeAll(() => {
  // db lazily bootstraps on first call to lib/catalog
});

afterAll(async () => {
  const { closeDb } = await import("@/lib/db");
  closeDb();
  try {
    rmSync(tmpDir, { recursive: true, force: true });
  } catch {}
});
