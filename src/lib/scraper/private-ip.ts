import { lookup } from "node:dns/promises";

const V4_PATTERNS: RegExp[] = [
  /^10\./,
  /^127\./,
  /^169\.254\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2[0-9]|3[01])\./,
  /^100\.(6[4-9]|[7-9][0-9]|1[01][0-9]|12[0-7])\./, // CGNAT 100.64/10
  /^0\./,
  /^224\./,
  /^240\./,
  /^255\.255\.255\.255$/,
];

export function isPrivateIp(addr: string): boolean {
  if (!addr) return true;
  if (addr === "::1" || addr === "::") return true;
  if (/^fe[89ab][0-9a-f]:/i.test(addr)) return true; // link-local v6
  if (/^fc[0-9a-f]{2}:/i.test(addr)) return true; // ULA v6 fc00::/7
  if (/^fd[0-9a-f]{2}:/i.test(addr)) return true;
  if (/^::ffff:/i.test(addr)) {
    return isPrivateIp(addr.replace(/^::ffff:/i, ""));
  }
  return V4_PATTERNS.some((re) => re.test(addr));
}

export async function isPublicHost(host: string): Promise<boolean> {
  if (!host) return false;
  if (/^localhost$/i.test(host)) return false;
  try {
    const records = await lookup(host, { all: true });
    if (!records.length) return false;
    return records.every((r) => !isPrivateIp(r.address));
  } catch {
    return false;
  }
}
