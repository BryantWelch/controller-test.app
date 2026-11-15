import { useState } from 'react'
import { rumbleUnavailableReason } from '../gamepad/haptics'

interface RumblePanelProps {
  connected: boolean
  enabled: boolean
  onPulse: (strong: number, weak: number, duration: number) => Promise<boolean>
}

function rumbleNote(connected: boolean, enabled: boolean): string | null {
  if (!connected) return 'Connect a controller to test rumble.'
  if (enabled) return null
  const reason = rumbleUnavailableReason()
  if (reason === 'firefox') {
    return 'Firefox does not support controller rumble. Open this page in Chrome or Edge to pulse the motors.'
  }
  if (reason === 'browser') {
    return 'This browser does not support controller rumble. Chrome and Edge can pulse the motors.'
  }
  return 'This controller is not reporting a rumble motor.'
}

export function RumblePanel({ connected, enabled, onPulse }: RumblePanelProps) {
  const [strong, setStrong] = useState(0.7)
  const [weak, setWeak] = useState(0.4)
  const [duration, setDuration] = useState(250)
  const [pending, setPending] = useState(false)
  const [note, setNote] = useState('')

  async function pulse() {
    setPending(true)
    const ok = await onPulse(strong, weak, duration)
    setNote(ok ? 'Rumble sent.' : 'This browser did not rumble the controller.')
    setPending(false)
  }

  const block = rumbleNote(connected, enabled)

  return (
    <section className="panel">
      <header className="panel-head">
        <h2>Rumble</h2>
      </header>
      {block && <p className="muted">{block}</p>}
      <label className="slider">
        <span>Strong <b>{strong.toFixed(2)}</b></span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={strong}
          disabled={!enabled}
          onChange={event => setStrong(Number(event.target.value))}
        />
      </label>
      <label className="slider">
        <span>Weak <b>{weak.toFixed(2)}</b></span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={weak}
          disabled={!enabled}
          onChange={event => setWeak(Number(event.target.value))}
        />
      </label>
      <label className="slider">
        <span>Duration <b>{duration} ms</b></span>
        <input
          type="range"
          min="40"
          max="1000"
          step="10"
          value={duration}
          disabled={!enabled}
          onChange={event => setDuration(Number(event.target.value))}
        />
      </label>
      <button type="button" className="pulse" disabled={!enabled || pending} onClick={pulse}>
        {pending ? 'Sending…' : 'Pulse'}
      </button>
      {note && <p className="note">{note}</p>}
    </section>
  )
}
