/**
 * Safe Convex hooks that gracefully no-op when no ConvexProvider is present.
 * This allows components to work both with and without a configured Convex backend.
 */
import { useMutation, useConvex } from 'convex/react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyMutationFn = Parameters<typeof useMutation>[0];

/**
 * Returns a real Convex mutation when ConvexProvider is present,
 * or an async no-op function when it is not.
 */
export function useSafeMutation(mutationFn: AnyMutationFn) {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useMutation(mutationFn);
  } catch {
    // No ConvexProvider in tree — return a no-op
    return async (..._args: unknown[]) => undefined;
  }
}

/**
 * Returns the Convex client when ConvexProvider is present, or null when not.
 */
export function useSafeConvex() {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useConvex();
  } catch {
    return null;
  }
}
