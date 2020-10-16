// Return # of seconds past an arbitrary point in time.
export function getTime() {
  if (globalThis.performance) return performance.now() / 1000;
  else {
    const t = process.hrtime();
    return t[0] + t[1] / 1e9;
  }
}
