const WINDOW_MS = 500
const CALM_MAGNITUDE = 0.35
const DRIFT_MAGNITUDE = 0.08

export interface DriftTracker {
  samples: { t: number; x: number; y: number }[]
}

// Drift is a stick that sits off center. A real push leaves the calm range and clears the flag.
export function sampleStick(
  tracker: DriftTracker,
  x: number,
  y: number,
  now: number
): { drifting: boolean } {
  const samples = tracker.samples
  samples.push({ t: now, x, y })
  const cutoff = now - WINDOW_MS
  while (samples.length > 1 && samples[0].t < cutoff) samples.shift()

  const span = now - samples[0].t
  if (span < WINDOW_MS - 40) return { drifting: false }

  let sum = 0
  for (const sample of samples) {
    const magnitude = Math.hypot(sample.x, sample.y)
    if (magnitude >= CALM_MAGNITUDE) return { drifting: false }
    sum += magnitude
  }

  return { drifting: sum / samples.length >= DRIFT_MAGNITUDE }
}
