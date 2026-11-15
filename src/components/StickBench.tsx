import { useEffect, useRef, useState } from 'react'
import { emptyCircle, recordSlice, type CircleSlice } from '../gamepad/circularity'
import { DRIFT_MS, driftReadout, emptyDrift, recordDrift, type DriftReadout, type DriftSample } from '../gamepad/driftTest'
import { StickPlot } from './StickPlot'
import '../styles/circularity.css'

interface StickBenchProps {
  live: boolean
  leftX: number
  leftY: number
  rightX: number
  rightY: number
  leftDrifting: boolean
  rightDrifting: boolean
}

function TestPill({
  label,
  checked,
  disabled,
  title,
  onChange,
}: {
  label: string
  checked: boolean
  disabled: boolean
  title: string
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="stick-test" title={title}>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={event => onChange(event.target.checked)} />
      {label}
    </label>
  )
}

export function StickBench({
  live,
  leftX,
  leftY,
  rightX,
  rightY,
  leftDrifting,
  rightDrifting,
}: StickBenchProps) {
  const [testing, setTesting] = useState(false)
  const [left, setLeft] = useState<CircleSlice[]>(emptyCircle)
  const [right, setRight] = useState<CircleSlice[]>(emptyCircle)
  const [driftRun, setDriftRun] = useState(false)
  const [driftSeconds, setDriftSeconds] = useState(5)
  const [leftDrift, setLeftDrift] = useState<DriftSample | null>(null)
  const [rightDrift, setRightDrift] = useState<DriftSample | null>(null)
  const axesRef = useRef({ leftX, leftY, rightX, rightY })
  const driftRunRef = useRef(false)
  axesRef.current = { leftX, leftY, rightX, rightY }

  useEffect(() => {
    if (live) return
    setTesting(false)
    setLeft(emptyCircle())
    setRight(emptyCircle())
    setDriftRun(false)
    driftRunRef.current = false
    setLeftDrift(null)
    setRightDrift(null)
  }, [live])

  useEffect(() => {
    if (!testing) return
    setLeft(current => recordSlice(current, leftX, leftY))
    setRight(current => recordSlice(current, rightX, rightY))
  }, [testing, leftX, leftY, rightX, rightY])

  useEffect(() => {
    if (!driftRun) return
    const started = performance.now()
    driftRunRef.current = true
    setLeftDrift(emptyDrift())
    setRightDrift(emptyDrift())
    setDriftSeconds(5)
    const id = window.setInterval(() => {
      if (!driftRunRef.current) return
      const axes = axesRef.current
      const elapsed = performance.now() - started
      setLeftDrift(current => (driftRunRef.current ? recordDrift(current ?? emptyDrift(), axes.leftX, axes.leftY) : current))
      setRightDrift(current => (driftRunRef.current ? recordDrift(current ?? emptyDrift(), axes.rightX, axes.rightY) : current))
      if (elapsed >= DRIFT_MS) {
        driftRunRef.current = false
        window.clearInterval(id)
        setDriftRun(false)
        return
      }
      setDriftSeconds(Math.ceil((DRIFT_MS - elapsed) / 1000))
    }, 100)
    return () => window.clearInterval(id)
  }, [driftRun])

  function onCircularity(checked: boolean) {
    setLeft(emptyCircle())
    setRight(emptyCircle())
    setTesting(checked)
    if (!checked) return
    driftRunRef.current = false
    setDriftRun(false)
    setLeftDrift(null)
    setRightDrift(null)
  }

  function onDrift(checked: boolean) {
    driftRunRef.current = checked
    if (!checked) {
      setDriftRun(false)
      setLeftDrift(null)
      setRightDrift(null)
      return
    }
    setTesting(false)
    setLeft(emptyCircle())
    setRight(emptyCircle())
    setDriftRun(true)
  }

  const leftNote: DriftReadout | null = driftReadout(leftDrift, driftRun, driftSeconds)
  const rightNote: DriftReadout | null = driftReadout(rightDrift, driftRun, driftSeconds)

  return (
    <div className="stick-bench">
      <div className="stick-grid">
        <StickPlot title="Left stick" x={leftX} y={leftY} drifting={leftDrifting} circle={left} testing={testing} />
        <StickPlot title="Right stick" x={rightX} y={rightY} drifting={rightDrifting} circle={right} testing={testing} />
      </div>
      <section className="stick-tests" aria-label="Tests">
        <div className="stick-tests-row">
          <span className="stick-tests-label">Tests</span>
          <div className="stick-tests-pills">
            <TestPill
              label="Circularity test"
              checked={testing}
              disabled={!live}
              title="Spin each stick around the edge"
              onChange={onCircularity}
            />
            <TestPill
              label="Drift test"
              checked={driftRun}
              disabled={!live}
              title="Let both sticks rest for 5 seconds"
              onChange={onDrift}
            />
          </div>
          {(leftNote || rightNote) && (
            <div className="stick-tests-results">
              {leftNote && rightNote && leftNote.text === rightNote.text ? (
                <p className={leftNote.tone ? `drift-readout ${leftNote.tone}` : 'drift-readout'}>{leftNote.text}</p>
              ) : (
                <>
                  {leftNote && (
                    <p className={leftNote.tone ? `drift-readout ${leftNote.tone}` : 'drift-readout'}>
                      <span>Left</span>
                      {leftNote.text}
                    </p>
                  )}
                  {rightNote && (
                    <p className={rightNote.tone ? `drift-readout ${rightNote.tone}` : 'drift-readout'}>
                      <span>Right</span>
                      {rightNote.text}
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
