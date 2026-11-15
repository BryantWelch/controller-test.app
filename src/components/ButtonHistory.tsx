import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { ButtonReading } from '../gamepad/types'
import '../styles/button-history.css'

const STORE_CAP = 200

interface ButtonHistoryProps {
  buttons: ButtonReading[]
  labels: string[]
}

interface PressRecord {
  id: number
  name: string
}

export function ButtonHistory({ buttons, labels }: ButtonHistoryProps) {
  const [presses, setPresses] = useState<PressRecord[]>([])
  const [visibleCount, setVisibleCount] = useState(48)
  const pressedRef = useRef<boolean[]>([])
  const idRef = useRef(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const fittedCap = useRef<number | null>(null)
  const measuredLength = useRef(0)

  useEffect(() => {
    const previous = pressedRef.current
    const risen: PressRecord[] = []

    buttons.forEach((button, index) => {
      const wasPressed = previous[index] === true
      if (button.pressed && !wasPressed) {
        risen.push({
          id: idRef.current,
          name: labels[index] ?? `Button ${index}`,
        })
        idRef.current += 1
      }
    })

    pressedRef.current = buttons.map(button => button.pressed)
    if (risen.length === 0) return

    setPresses(current => [...risen, ...current].slice(0, STORE_CAP))
  }, [buttons, labels])

  const shown = presses.slice(0, visibleCount)

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return

    const measure = () => {
      if (measuredLength.current !== presses.length) {
        measuredLength.current = presses.length
        fittedCap.current = null
      }
      if (presses.length === 0) return

      const styles = getComputedStyle(track)
      const gap = parseFloat(styles.columnGap || styles.gap) || 0
      const available = track.clientWidth
      const chips = Array.from(track.querySelectorAll<HTMLElement>('[data-press]'))
      if (chips.length === 0 || available <= 0) return

      let used = 0
      let fitted = 0
      for (const chip of chips) {
        const next = used + (fitted > 0 ? gap : 0) + chip.offsetWidth
        if (next > available + 1) break
        used = next
        fitted += 1
      }
      if (fitted === 0) return

      if (fitted < chips.length) {
        fittedCap.current = fitted
        if (fitted !== visibleCount) setVisibleCount(fitted)
        return
      }

      if (fittedCap.current != null && chips.length >= fittedCap.current) return

      const spare = available - used
      const narrowest = Math.min(...chips.map(chip => chip.offsetWidth))
      const extra = Math.floor((spare + gap) / (narrowest + gap))
      if (presses.length > fitted && extra > 0) {
        setVisibleCount(Math.min(presses.length, fitted + extra))
      }
    }

    measure()
    const observer = new ResizeObserver(() => {
      fittedCap.current = null
      measure()
    })
    observer.observe(track)
    return () => observer.disconnect()
  }, [presses, visibleCount])

  return (
    <section className="button-history-bar" aria-label="Button history">
      <div className="button-history-label">
        <span>History</span>
        <span className="button-history-count">{presses.length}</span>
      </div>
      <div className="button-history-track" ref={trackRef}>
        {shown.length === 0 ? (
          <p className="button-history-empty">Press a button to start the history.</p>
        ) : (
          shown.map(press => (
            <span key={press.id} className="button-history-chip" data-press="true">
              {press.name}
            </span>
          ))
        )}
      </div>
      <button
        type="button"
        className="button-history-clear"
        disabled={presses.length === 0}
        onClick={() => setPresses([])}
      >
        Clear history
      </button>
    </section>
  )
}
