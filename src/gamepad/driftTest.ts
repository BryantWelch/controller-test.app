export const DRIFT_MS = 5000
const ABORT_RADIUS = 0.35

export interface DriftSample {
  peak: number
  sum: number
  count: number
  aborted: boolean
}

export interface DriftReadout {
  text: string
  tone: '' | 'good' | 'warn' | 'bad'
}

export function emptyDrift(): DriftSample {
  return { peak: 0, sum: 0, count: 0, aborted: false }
}

export function recordDrift(sample: DriftSample, x: number, y: number): DriftSample {
  if (sample.aborted) return sample
  const radius = Math.hypot(x, y)
  if (radius >= ABORT_RADIUS) return { ...sample, peak: Math.max(sample.peak, radius), aborted: true }
  return {
    peak: Math.max(sample.peak, radius),
    sum: sample.sum + radius,
    count: sample.count + 1,
    aborted: false,
  }
}

export function driftReadout(sample: DriftSample | null, running: boolean, secondsLeft: number): DriftReadout | null {
  if (!sample) return null
  if (sample.aborted) return { text: 'Stick moved', tone: 'bad' }
  if (running) return { text: `Hold still · ${secondsLeft}s`, tone: '' }
  if (sample.count === 0) return null
  const offset = sample.sum / sample.count
  const deadzone = Math.min(100, Math.ceil(sample.peak * 100))
  if (offset < 0.03) return { text: `None · ${(offset * 100).toFixed(1)}% · deadzone ${deadzone}%`, tone: 'good' }
  if (offset < 0.07) return { text: `Slight · ${(offset * 100).toFixed(1)}% · deadzone ${deadzone}%`, tone: 'warn' }
  return { text: `Drifting · ${(offset * 100).toFixed(1)}% · deadzone ${deadzone}%`, tone: 'bad' }
}
