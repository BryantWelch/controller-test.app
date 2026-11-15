interface LegacyActuator {
  playEffect?: (
    type: 'dual-rumble',
    params: {
      duration: number
      strongMagnitude: number
      weakMagnitude: number
      startDelay: number
    }
  ) => Promise<unknown>
}

interface LegacyGamepad extends Gamepad {
  hapticActuators?: LegacyActuator[]
}

function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0
  return Math.min(1, Math.max(0, value))
}

function isFirefoxFamily(): boolean {
  if (typeof document !== 'undefined' && 'MozAppearance' in document.documentElement.style) return true
  if (typeof navigator === 'undefined') return false
  if (/firefox\/|zen\/|librewolf|waterfox|floorp/i.test(navigator.userAgent)) return true
  const engine = navigator as Navigator & { buildID?: string; oscpu?: string }
  if (typeof engine.buildID === 'string' && engine.buildID.length > 0) return true
  return typeof engine.oscpu === 'string'
}

export function rumbleUnavailableReason(): 'firefox' | 'browser' | 'controller' {
  // Firefox puts hapticActuators on the prototype, but desktop builds cannot rumble.
  if (isFirefoxFamily()) return 'firefox'
  const supported =
    typeof Gamepad !== 'undefined' &&
    ('vibrationActuator' in Gamepad.prototype || 'hapticActuators' in Gamepad.prototype)
  if (supported) return 'controller'
  return 'browser'
}

export function padCanRumble(index: number): boolean {
  const gamepad = navigator.getGamepads()[index]
  if (!gamepad) return false
  if (typeof gamepad.vibrationActuator?.playEffect === 'function') return true
  return Boolean(
    (gamepad as LegacyGamepad).hapticActuators?.some(actuator => typeof actuator.playEffect === 'function')
  )
}

export async function pulseRumble(
  index: number,
  strong: number,
  weak: number,
  duration: number
): Promise<boolean> {
  const gamepad = navigator.getGamepads()[index]
  if (!gamepad) return false

  const params = {
    startDelay: 0,
    duration: Math.round(Math.min(2000, Math.max(40, duration))),
    strongMagnitude: clamp01(strong),
    weakMagnitude: clamp01(weak),
  }

  try {
    if (typeof gamepad.vibrationActuator?.playEffect === 'function') {
      await gamepad.vibrationActuator.playEffect('dual-rumble', params)
      return true
    }

    const legacy = (gamepad as LegacyGamepad).hapticActuators?.find(actuator => actuator.playEffect)
    if (legacy?.playEffect) {
      await legacy.playEffect('dual-rumble', params)
      return true
    }
  } catch {
    return false
  }

  return false
}
