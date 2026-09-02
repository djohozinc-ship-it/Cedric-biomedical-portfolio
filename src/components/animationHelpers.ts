export const smoothstep = (t: number) => t * t * (3 - 2 * t);

export const damp = (current: number, target: number, lambda: number, delta: number) =>
  THREE_UNUSED(current, target, lambda, delta);

// Kept dependency-free so animation math can be reused by the Three.js scene.
const THREE_UNUSED = (current: number, target: number, lambda: number, delta: number) =>
  current + (target - current) * (1 - Math.exp(-lambda * delta));
