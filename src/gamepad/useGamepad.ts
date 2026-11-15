import { useEffect, useRef, useState } from 'react'
import { sampleStick, type DriftTracker } from './drift'
import { padCanRumble, pulseRumble } from './haptics'
import { identifyPad, type IdentifiedPad } from './identify'
import { familyFromType } from './labels'
import type { ButtonReading, PadChoice, PadSnapshot } from './types'

const AXIS_EPSILON = 0.001
const BUTTON_EPSILON = 0.004

function readButtons(gamepad: Gamepad): ButtonReading[] {
  return gamepad.buttons.map(button => ({
    pressed: button.pressed,
    touched: button.touched,
    value: button.value,
  }))
}

function sameButtons(previous: ButtonReading[], next: ButtonReading[]): boolean {
  if (previous.length !== next.length) return false
  for (let index = 0; index < next.length; index += 1) {
    if (previous[index].pressed !== next[index].pressed) return false
    if (previous[index].touched !== next[index].touched) return false
    if (Math.abs(previous[index].value - next[index].value) > BUTTON_EPSILON) return false
  }
  return true
}

function sameAxes(previous: number[], next: number[]): boolean {
  if (previous.length !== next.length) return false
  for (let index = 0; index < next.length; index += 1) {
    if (Math.abs(previous[index] - next[index]) > AXIS_EPSILON) return false
  }
  return true
}

function emptyTrackers(): { left: DriftTracker; right: DriftTracker } {
  return { left: { samples: [] }, right: { samples: [] } }
}

export function useGamepad() {
  const supported = typeof navigator !== 'undefined' && 'getGamepads' in navigator
  const [pads, setPads] = useState<PadChoice[]>([])
  const [activeIndex, setActiveIndexState] = useState<number | null>(null)
  const [active, setActive] = useState<PadSnapshot | null>(null)
  const [pollingHz, setPollingHz] = useState(0)
  const [drift, setDrift] = useState({ left: false, right: false })

  const activeIndexRef = useRef<number | null>(null)
  const padsKeyRef = useRef('')
  const snapshotRef = useRef<PadSnapshot | null>(null)
  const driftRef = useRef(drift)
  const trackersRef = useRef(emptyTrackers())
  const pollRef = useRef({ lastTs: -1, count: 0, windowStart: 0, hz: 0 })

  const resetMotion = () => {
    trackersRef.current = emptyTrackers()
    pollRef.current = { lastTs: -1, count: 0, windowStart: 0, hz: 0 }
  }

  const setActiveIndex = (index: number) => {
    activeIndexRef.current = index
    setActiveIndexState(index)
    resetMotion()
  }

  useEffect(() => {
    if (!supported) return
    let frame = 0
    const names = new Map<string, IdentifiedPad>()

    const lookup = (id: string) => {
      const cached = names.get(id)
      if (cached) return cached
      const identified = identifyPad(id)
      names.set(id, identified)
      return identified
    }

    const tick = () => {
      const list = navigator.getGamepads()
      const connected: PadChoice[] = []

      for (const gamepad of list) {
        if (!gamepad?.connected) continue
        connected.push({
          index: gamepad.index,
          id: gamepad.id,
          name: lookup(gamepad.id).name,
        })
      }

      const padKey = connected.map(pad => `${pad.index}:${pad.id}:${pad.name}`).join('|')
      if (padKey !== padsKeyRef.current) {
        padsKeyRef.current = padKey
        setPads(connected)
      }

      let index = activeIndexRef.current
      if (index === null || !connected.some(pad => pad.index === index)) {
        index = connected[0]?.index ?? null
        if (index !== activeIndexRef.current) {
          activeIndexRef.current = index
          setActiveIndexState(index)
          resetMotion()
        }
      }

      const gamepad = index === null ? null : list[index]
      if (!gamepad?.connected) {
        if (snapshotRef.current) {
          snapshotRef.current = null
          setActive(null)
          setPollingHz(0)
          const cleared = { left: false, right: false }
          driftRef.current = cleared
          setDrift(cleared)
        }
        frame = requestAnimationFrame(tick)
        return
      }

      const now = performance.now()
      const poll = pollRef.current
      if (gamepad.timestamp !== poll.lastTs) {
        if (poll.lastTs !== -1) poll.count += 1
        poll.lastTs = gamepad.timestamp
      }
      if (poll.windowStart === 0) poll.windowStart = now
      if (now - poll.windowStart >= 1000) {
        if (poll.count !== poll.hz) {
          poll.hz = poll.count
          setPollingHz(poll.count)
        }
        poll.count = 0
        poll.windowStart = now
      }

      const axes = Array.from(gamepad.axes)
      const leftDrift = sampleStick(trackersRef.current.left, axes[0] ?? 0, axes[1] ?? 0, now)
      const rightDrift = sampleStick(trackersRef.current.right, axes[2] ?? 0, axes[3] ?? 0, now)
      if (leftDrift.drifting !== driftRef.current.left || rightDrift.drifting !== driftRef.current.right) {
        const nextDrift = { left: leftDrift.drifting, right: rightDrift.drifting }
        driftRef.current = nextDrift
        setDrift(nextDrift)
      }

      const identified = lookup(gamepad.id)
      const next: PadSnapshot = {
        index: gamepad.index,
        id: gamepad.id,
        mapping: gamepad.mapping,
        name: identified.name,
        manufacturer: identified.manufacturer,
        description: identified.description,
        features: identified.features,
        modelId: identified.id,
        family: familyFromType(identified.type, gamepad.id, identified.name),
        buttons: readButtons(gamepad),
        axes,
        rumble: padCanRumble(gamepad.index),
      }

      const previous = snapshotRef.current
      if (
        !previous ||
        previous.index !== next.index ||
        previous.id !== next.id ||
        previous.mapping !== next.mapping ||
        previous.name !== next.name ||
        previous.rumble !== next.rumble ||
        !sameButtons(previous.buttons, next.buttons) ||
        !sameAxes(previous.axes, next.axes)
      ) {
        snapshotRef.current = next
        setActive(next)
      }

      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [supported])

  return {
    supported,
    pads,
    activeIndex,
    setActiveIndex,
    active,
    pollingHz,
    drift,
    pulse: pulseRumble,
  }
}
