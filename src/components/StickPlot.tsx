import { useEffect, useRef, useState } from 'react'
import { averageError, CIRCLE_SLICES, sliceTone, type CircleSlice } from '../gamepad/circularity'
import { formatSigned } from '../gamepad/labels'
import '../styles/stick-trail.css'
import '../styles/stick-readout.css'
import '../styles/circularity.css'

function formatStickPercent(value: number): string {
  return `${formatSigned(value * 100, 1)}%`
}

function StickReadout({ axis, value, className }: { axis: 'X' | 'Y'; value: number; className: string }) {
  const amount = Math.min(1, Math.abs(value))
  return (
    <div className={className}>
      <span className="stick-percent">
        <span className="stick-axis-name">{axis}</span>
        {formatStickPercent(value)}
      </span>
      <span className="bipolar stick-bipolar" aria-hidden="true">
        <span
          className="bipolar-fill"
          style={
            value >= 0
              ? { left: '50%', width: `${amount * 50}%` }
              : { left: `${(1 - amount) * 50}%`, width: `${amount * 50}%` }
          }
        />
      </span>
    </div>
  )
}

const TRAVEL = 68
const TRAIL_MS = 1500
const JITTER = 0.01

interface TrailPoint {
  x: number
  y: number
  time: number
}

interface StickPlotProps {
  title: string
  x: number
  y: number
  drifting: boolean
  circle: CircleSlice[]
  testing: boolean
}

const WELL = 168
const PIE_GAP = 0.02

function CircularityPie({ slices }: { slices: CircleSlice[] }) {
  const center = WELL / 2
  return (
    <svg className="circularity-pie" viewBox={`0 0 ${WELL} ${WELL}`} aria-hidden="true">
      <circle className="circularity-ring" cx={center} cy={center} r={TRAVEL} />
      {slices.map((slice, index) => {
        if (slice.radius <= 0) return null
        const start = (index / CIRCLE_SLICES) * Math.PI * 2 + PIE_GAP
        const end = ((index + 1) / CIRCLE_SLICES) * Math.PI * 2 - PIE_GAP
        const radius = Math.min(1.12, slice.radius) * TRAVEL
        const x1 = center + Math.cos(start) * radius
        const y1 = center + Math.sin(start) * radius
        const x2 = center + Math.cos(end) * radius
        const y2 = center + Math.sin(end) * radius
        return (
          <path
            key={index}
            className={`circularity-wedge ${sliceTone(slice.radius)}`}
            d={`M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`}
          />
        )
      })}
    </svg>
  )
}

function errorTone(error: number | null): string {
  if (error === null) return ''
  if (error <= 0.05) return 'good'
  if (error <= 0.1) return 'warn'
  return 'bad'
}

export function StickPlot({ title, x, y, drifting, circle, testing }: StickPlotProps) {
  const pointsRef = useRef<TrailPoint[]>([])
  const lastRef = useRef<{ x: number; y: number } | null>(null)
  const kickRef = useRef<() => void>(() => {})
  const [now, setNow] = useState(0)

  useEffect(() => {
    let frame = 0
    let stopped = false

    const tick = (time: number) => {
      frame = 0
      if (stopped) return
      const live = pointsRef.current.filter(point => time - point.time < TRAIL_MS)
      pointsRef.current = live
      setNow(time)
      if (live.length > 0) frame = requestAnimationFrame(tick)
    }

    kickRef.current = () => {
      if (stopped || frame !== 0) return
      frame = requestAnimationFrame(tick)
    }

    if (pointsRef.current.length > 0) frame = requestAnimationFrame(tick)

    return () => {
      stopped = true
      cancelAnimationFrame(frame)
      kickRef.current = () => {}
    }
  }, [])

  useEffect(() => {
    const last = lastRef.current
    if (!last) {
      lastRef.current = { x, y }
      return
    }
    if (Math.hypot(x - last.x, y - last.y) < JITTER) return

    const time = performance.now()
    const live = pointsRef.current.filter(point => time - point.time < TRAIL_MS)
    live.push({ x, y, time })
    pointsRef.current = live
    lastRef.current = { x, y }
    setNow(time)
    kickRef.current()
  }, [x, y])

  const error = testing ? averageError(circle) : null

  return (
    <section className={drifting ? 'plot-card drifting' : 'plot-card'}>
      <header className="plot-head">
        <h2>{title}</h2>
        <span className={drifting ? 'badge bad' : 'badge ok'}>{drifting ? 'Drift' : 'Centered'}</span>
      </header>
      <div className="stick-stage">
        <StickReadout axis="X" value={x} className="stick-readout stick-readout-x" />
        <div className="well-plot">
          {!testing && (
            <>
              <span className="deadzone" />
              <span className="crosshair horizontal" />
              <span className="crosshair vertical" />
            </>
          )}
          {testing && <CircularityPie slices={circle} />}
          {!testing && (
            <div className="stick-trail" aria-hidden="true">
              {pointsRef.current.map(point => {
                const age = now - point.time
                if (age >= TRAIL_MS) return null
                return (
                  <span
                    key={point.time}
                    className="stick-trail-bit"
                    style={{
                      opacity: Math.min(1, Math.max(0, 1 - age / TRAIL_MS)),
                      transform: `translate(${point.x * TRAVEL}px, ${point.y * TRAVEL}px)`,
                    }}
                  />
                )
              })}
            </div>
          )}
          <span className="stick-dot" style={{ transform: `translate(${x * TRAVEL}px, ${y * TRAVEL}px)` }} />
          {testing && (
            <div className="circularity-center">
              <span>Avg error</span>
              <strong className={errorTone(error)}>{error === null ? 'Spin' : `${(error * 100).toFixed(1)}%`}</strong>
            </div>
          )}
        </div>
        <StickReadout axis="Y" value={y} className="stick-readout stick-readout-y" />
      </div>
    </section>
  )
}
