const DEFAULT_UA =
  "Mozilla/5.0 (compatible; PillarPearlBot/1.0; +https://pillarpearl.com/about)";
const DEFAULT_TIMEOUT_MS = 15_000;

export interface FetchOptions {
  timeoutMs?: number;
  retries?: number;
  headers?: Record<string, string>;
  expectJson?: boolean;
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

export async function fetchWithRetry(
  url: string,
  opts: FetchOptions = {},
): Promise<Response> {
  const retries = opts.retries ?? 2;
  const timeout = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        redirect: "follow",
        headers: {
          "User-Agent": DEFAULT_UA,
          Accept: opts.expectJson
            ? "application/json"
            : "text/html,application/xhtml+xml,application/json",
          "Accept-Language": "en-US,en;q=0.9",
          ...opts.headers,
        },
      });
      clearTimeout(timer);
      if (!res.ok && res.status >= 500 && attempt < retries) {
        await sleep(backoff(attempt));
        continue;
      }
      return res;
    } catch (e) {
      clearTimeout(timer);
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
  return (await res.json()) as T;
}

export async function fetchText(
  url: string,
  opts: FetchOptions = {},
): Promise<string> {
  const res = await fetchWithRetry(url, opts);
  if (!res.ok) {
    throw new FetchError(`HTTP ${res.status}`, res.status, url);
  }
  return await res.text();
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function backoff(attempt: number): number {
  return Math.min(8000, 500 * Math.pow(2, attempt)) + Math.floor(Math.random() * 250);
}
