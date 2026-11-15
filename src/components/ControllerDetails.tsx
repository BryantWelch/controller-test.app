import { rumbleUnavailableReason } from '../gamepad/haptics'
import { extractVendorProductId } from '../gamepad/identify'
import type { PadSnapshot } from '../gamepad/types'

const PADDLE_MODELS = new Set([
  'xbox-elite-1',
  'xbox-elite-2',
  'ps5-dualsense-edge',
  '8bitdo-pro2',
  'scuf-controller',
  'astro-c40',
])

function aside(pad: PadSnapshot): string | null {
  if (pad.mapping !== 'standard') {
    return 'This pad is not using the standard layout, so the names in the button list may not match the hardware.'
  }
  if (PADDLE_MODELS.has(pad.modelId)) {
    return 'Back buttons and paddles appear here only when the controller maps them to a button the browser can see.'
  }
  if (pad.modelId === 'ps5-dualsense') {
    return 'Adaptive triggers, the speaker, and motion are not part of this view.'
  }
  if (pad.family === 'playstation') {
    return 'The light bar, speaker, and motion sensors are not part of this view.'
  }
  if (pad.modelId === 'steam-2026') {
    return 'Grip buttons and trackpads show up here only when Steam maps them to a button or stick the browser can see.'
  }
  if (pad.modelId === 'steam' || pad.modelId === 'steam-deck') {
    return 'Trackpads follow the inputs Steam is sending, so they can show up as sticks or extra axes.'
  }
  if (pad.family === 'nintendo') {
    return 'Motion is not part of this view. Rumble is one pulse when the browser offers an actuator.'
  }
  return null
}

function rumbleFact(): string {
  const reason = rumbleUnavailableReason()
  if (reason === 'firefox') return 'Not supported in Firefox'
  if (reason === 'browser') return 'Not supported in this browser'
  return 'No motor reported'
}

export function ControllerDetails({ pad, pollingHz }: { pad: PadSnapshot; pollingHz: number }) {
  const usb = extractVendorProductId(pad.id)
  const note = aside(pad)
  const facts: [string, string][] = [
    ['Maker', pad.manufacturer],
    ['Layout', pad.mapping === 'standard' ? 'Standard' : pad.mapping || 'Not reported'],
    ['Buttons', String(pad.buttons.length)],
    ['Axes', String(pad.axes.length)],
    ['Rumble', pad.rumble ? 'Actuator available' : rumbleFact()],
    ['Polls', pollingHz > 0 ? `${pollingHz} Hz` : 'Waiting'],
  ]
  if (usb) facts.splice(1, 0, ['USB id', usb])

  return (
    <div className="split details">
      <section className="panel" aria-labelledby="about-heading">
        <div className="panel-head">
          <h2 id="about-heading">About</h2>
        </div>
        <p className="about-copy">{pad.description}</p>
        {pad.features.length > 0 && (
          <ul className="chips">
            {pad.features.map(feature => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        )}
        {note && <p className="about-note">{note}</p>}
      </section>
      <section className="panel" aria-labelledby="connection-heading">
        <div className="panel-head">
          <h2 id="connection-heading">This connection</h2>
        </div>
        <dl className="facts">
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <p className="device-id wrap" title={pad.id}>{pad.id}</p>
      </section>
    </div>
  )
}
