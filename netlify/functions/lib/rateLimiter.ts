type RateLimiterOptions = {
  limit: number;
  windowMs: number;
  now?: () => number;
};

type RateLimitResult = { allowed: boolean; retryAfterSeconds: number };

// Sliding-window limiter kept in memory. A serverless function keeps this only
// while its instance stays warm, so it is a speed bump against floods rather
// than an exact quota - the validation and bot checks do the rest.
export const createRateLimiter = ({
  limit,
  windowMs,
  now = Date.now,
}: RateLimiterOptions) => {
  const hits = new Map<string, number[]>();

  // Stops the map growing without bound under a flood of distinct keys.
  const prune = (current: number) => {
    hits.forEach((times, key) => {
      if (times.every((time) => current - time >= windowMs)) hits.delete(key);
    });
  };

  // Records the attempt when it is allowed.
  const check = (key: string): RateLimitResult => {
    const current = now();

    if (hits.size > 5000) prune(current);

    const recent = (hits.get(key) ?? []).filter(
      (time) => current - time < windowMs,
    );

    if (recent.length >= limit) {
      hits.set(key, recent);

      return {
        allowed: false,
        retryAfterSeconds: Math.max(
          1,
          Math.ceil((recent[0] + windowMs - current) / 1000),
        ),
      };
    }

    recent.push(current);
    hits.set(key, recent);

    return { allowed: true, retryAfterSeconds: 0 };
  };

  return { check };
};
