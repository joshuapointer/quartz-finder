import { isPublicHost } from "./private-ip";

const DEFAULT_UA =
  "Mozilla/5.0 (compatible; PillarPearlBot/1.0; +https://pillarpearl.com/about)";
const DEFAULT_TIMEOUT_MS = 15_000;
const DEFAULT_MAX_BYTES = 6 * 1024 * 1024;
const MAX_REDIRECTS = 5;

export interface FetchOptions {
  timeoutMs?: number;
  retries?: number;
  headers?: Record<string, string>;
  expectJson?: boolean;
  maxBytes?: number;
  allowedProtocols?: Array<"http:" | "https:">;
}

export class FetchError extends Error {
  constructor(
    message: string,
    public status?: number,
    public url?: string,
  ) {
    super(message);
    this.name = "FetchError";
  }
}

async function safeFetchOnce(
  url: string,
  opts: FetchOptions,
  redirectsLeft: number,
): Promise<Response> {
  const u = new URL(url);
  const allowed = opts.allowedProtocols ?? ["https:", "http:"];
  if (!allowed.includes(u.protocol as "http:" | "https:")) {
    throw new FetchError(`blocked protocol ${u.protocol}`, 0, url);
  }
  if (!(await isPublicHost(u.hostname))) {
    throw new FetchError(`blocked private/loopback host ${u.hostname}`, 0, url);
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "manual",
      headers: {
        "User-Agent": DEFAULT_UA,
        Accept: opts.expectJson
          ? "application/json"
          : "text/html,application/xhtml+xml,application/json",
        "Accept-Language": "en-US,en;q=0.9",
        ...opts.headers,
      },
    });
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) return res;
      if (redirectsLeft <= 0) {
        throw new FetchError("too many redirects", res.status, url);
      }
      const nextUrl = new URL(loc, url).toString();
      return safeFetchOnce(nextUrl, opts, redirectsLeft - 1);
    }
    return res;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchWithRetry(
  url: string,
  opts: FetchOptions = {},
): Promise<Response> {
  const retries = opts.retries ?? 2;
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await safeFetchOnce(url, opts, MAX_REDIRECTS);
      if (!res.ok && res.status >= 500 && attempt < retries) {
        await sleep(backoff(attempt));
        continue;
      }
      return res;
    } catch (e) {
      lastErr = e;
      if (attempt < retries) {
        await sleep(backoff(attempt));
        continue;
      }
    }
  }
  throw new FetchError(
    `Fetch failed after ${retries + 1} attempts: ${String(lastErr)}`,
    undefined,
    url,
  );
}

export async function fetchJson<T = unknown>(
  url: string,
  opts: FetchOptions = {},
): Promise<T> {
  const res = await fetchWithRetry(url, { ...opts, expectJson: true });
  if (!res.ok) {
    throw new FetchError(`HTTP ${res.status}`, res.status, url);
  }
  const text = await readCapped(res, opts.maxBytes ?? DEFAULT_MAX_BYTES, url);
  return JSON.parse(text, (k, v) =>
    k === "__proto__" || k === "constructor" || k === "prototype" ? undefined : v,
  ) as T;
}

export async function fetchText(
  url: string,
  opts: FetchOptions = {},
): Promise<string> {
  const res = await fetchWithRetry(url, opts);
  if (!res.ok) {
    throw new FetchError(`HTTP ${res.status}`, res.status, url);
  }
  return await readCapped(res, opts.maxBytes ?? DEFAULT_MAX_BYTES, url);
}

async function readCapped(res: Response, maxBytes: number, url: string): Promise<string> {
  const reader = res.body?.getReader();
  if (!reader) return "";
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    if (!value) continue;
    total += value.byteLength;
    if (total > maxBytes) {
      try {
        await reader.cancel();
      } catch {}
      throw new FetchError(
        `response body exceeded ${maxBytes} bytes`,
        res.status,
        url,
      );
    }
    chunks.push(value);
  }
  const buf = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    buf.set(c, offset);
    offset += c.byteLength;
  }
  return new TextDecoder("utf-8").decode(buf);
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function backoff(attempt: number): number {
  return Math.min(8000, 500 * Math.pow(2, attempt)) + Math.floor(Math.random() * 250);
}
