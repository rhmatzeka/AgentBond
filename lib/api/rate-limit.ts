type Window = { count: number; resetAt: number };
export type RateLimitResult = { ok: true } | { ok: false; retryAfterSeconds: number };

const MAX_TRACKED_KEYS = 5_000;

/**
 * Fixed-window limiter kept in memory. On serverless hosts each instance has its own
 * counters, so this caps bursts per instance rather than enforcing a global quota.
 */
export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const windows = new Map<string, Window>();

  return function hit(key: string, now = Date.now()): RateLimitResult {
    let window = windows.get(key);
    if (!window || now >= window.resetAt) {
      if (windows.size >= MAX_TRACKED_KEYS) {
        for (const [storedKey, stored] of windows) if (now >= stored.resetAt) windows.delete(storedKey);
        if (windows.size >= MAX_TRACKED_KEYS) windows.delete(windows.keys().next().value!);
      }
      window = { count: 0, resetAt: now + windowMs };
      windows.set(key, window);
    }
    window.count += 1;
    if (window.count <= limit) return { ok: true };
    return { ok: false, retryAfterSeconds: Math.ceil((window.resetAt - now) / 1000) };
  };
}

export function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

export function tooManyRequests(retryAfterSeconds: number) {
  return Response.json(
    { error: `Too many requests. Try again in ${retryAfterSeconds} seconds.` },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
  );
}
