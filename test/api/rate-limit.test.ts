import { describe, expect, it } from "vitest";
import { clientKey, createRateLimiter } from "@/lib/api/rate-limit";

describe("rate limiter", () => {
  it("allows up to the limit per window, then reports when to retry", () => {
    const hit = createRateLimiter({ limit: 2, windowMs: 60_000 });
    expect(hit("ip", 0).ok).toBe(true);
    expect(hit("ip", 1).ok).toBe(true);
    expect(hit("ip", 2)).toEqual({ ok: false, retryAfterSeconds: 60 });
    expect(hit("other", 2).ok).toBe(true);
    expect(hit("ip", 60_001).ok).toBe(true);
  });

  it("keys requests by the first forwarded IP", () => {
    const request = new Request("http://x", { headers: { "x-forwarded-for": "203.0.113.9, 10.0.0.1" } });
    expect(clientKey(request)).toBe("203.0.113.9");
    expect(clientKey(new Request("http://x"))).toBe("unknown");
  });
});
