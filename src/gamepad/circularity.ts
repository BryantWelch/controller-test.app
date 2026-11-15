export const CIRCLE_SLICES = 32

export interface CircleSlice {
  x: number
  y: number
  radius: number
}

export function emptyCircle(): CircleSlice[] {
  return Array.from({ length: CIRCLE_SLICES }, () => ({ x: 0, y: 0, radius: 0 }))
}

function sliceIndex(x: number, y: number): number {
  let angle = Math.atan2(y, x)
  if (angle < 0) angle += Math.PI * 2
  return Math.min(CIRCLE_SLICES - 1, Math.floor((angle / (Math.PI * 2)) * CIRCLE_SLICES))
}

export function recordSlice(slices: CircleSlice[], x: number, y: number): CircleSlice[] {
  const radius = Math.hypot(x, y)
  if (radius < 0.25) return slices
  const index = sliceIndex(x, y)
  if (radius <= slices[index].radius) return slices
  const next = slices.slice()
  next[index] = { x, y, radius }
  return next
}

/** Mean distance from a perfect circle, once enough of the rim has been sampled. */
export function averageError(slices: CircleSlice[]): number | null {
  const sampled = slices.filter(slice => slice.radius > 0)
  if (sampled.length < CIRCLE_SLICES / 2) return null
  return sampled.reduce((sum, slice) => sum + Math.abs(slice.radius - 1), 0) / sampled.length
}

export function sliceTone(radius: number): 'good' | 'warn' | 'bad' {
  const error = Math.abs(radius - 1)
  if (error <= 0.08) return 'good'
  if (error <= 0.16) return 'warn'
  return 'bad'
}
