/**
 * Returns true when the user has asked the OS to reduce motion.
 * SSR-safe: returns false when there is no window/matchMedia.
 */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}
