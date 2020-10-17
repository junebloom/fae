// Return the number of seconds passed since some fixed point in time.
export function getTime() {
  if (globalThis.performance) return performance.now() / 1000;
  else {
    // Fall back to a Node API if high-quality standards aren't implemented.
    const t = process.hrtime();
    return t[0] + t[1] / 1e9;
  }
}
