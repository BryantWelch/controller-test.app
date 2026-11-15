import { useMemo } from 'react'
import arcadeRaw from '../../assets/controllers/arcade.svg?raw'
import dualsenseRaw from '../../assets/controllers/dualsense.svg?raw'
import dualshock3Raw from '../../assets/controllers/dualshock3.svg?raw'
import dualshockRaw from '../../assets/controllers/dualshock4.svg?raw'
import genericRaw from '../../assets/controllers/generic.svg?raw'
import dukeRaw from '../../assets/controllers/icon-duke.svg?raw'
import gamecubeRaw from '../../assets/controllers/icon-gamecube.svg?raw'
import n64Raw from '../../assets/controllers/icon-n64.svg?raw'
import nesRaw from '../../assets/controllers/icon-nes.svg?raw'
import ps1Raw from '../../assets/controllers/icon-ps1.svg?raw'
import ps2Raw from '../../assets/controllers/icon-ps2.svg?raw'
import snesRaw from '../../assets/controllers/icon-snes.svg?raw'
import stadiaRaw from '../../assets/controllers/icon-stadia.svg?raw'
import wiiClassicRaw from '../../assets/controllers/icon-wii-classic.svg?raw'
import wiiUProRaw from '../../assets/controllers/icon-wii-u-pro.svg?raw'
import wiiRaw from '../../assets/controllers/icon-wii.svg?raw'
import xboxSRaw from '../../assets/controllers/icon-xbox-s.svg?raw'
import joyconLeftRaw from '../../assets/controllers/joycon-left.svg?raw'
import joyconRaw from '../../assets/controllers/joycon.svg?raw'
import joyconRightRaw from '../../assets/controllers/joycon-right.svg?raw'
import steamDeckRaw from '../../assets/controllers/steam-deck.svg?raw'
import steam2026Raw from '../../assets/controllers/steam-2026.svg?raw'
import steamRaw from '../../assets/controllers/steam.svg?raw'
import switchRaw from '../../assets/controllers/switch-pro.svg?raw'
import xbox360Raw from '../../assets/controllers/xbox-360.svg?raw'
import xboxOneRaw from '../../assets/controllers/xbox-one.svg?raw'
import xboxRaw from '../../assets/controllers/xbox-series.svg?raw'
import type { ControllerShell } from '../../gamepad/labels'
import type { ButtonReading } from '../../gamepad/types'

type HighlightClip = 'bumper-left' | 'bumper-right' | 'pad-up' | 'pad-down' | 'pad-left' | 'pad-right'

interface ArtPart {
  label: string
  parent?: string
  button?: number
  buttons?: number[]
  stick?: 0 | 2
  trigger?: number
  /** Highlight only this slice of a shared shape. */
  clip?: HighlightClip
}

interface ShellArt {
  name: string
  svg: string
  /** Exact data-label values, or a prefix ending in a space, to hide. */
  hide: string[]
  /** Labels forced visible when the source file hides an alternate body. */
  show?: string[]
  travel: number
  parts: ArtPart[]
}

function prepare(raw: string): string {
  return raw
    .replace(/^\uFEFF/, '')
    .replace(/<\?xml[\s\S]*?\?>/, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/inkscape:label=/g, 'data-label=')
}

function icon(name: string, svg: string): ShellArt {
  return { name, svg: prepare(svg), hide: [], travel: 0, parts: [] }
}

const face = (a: string, b: string, x: string, y: string, parent?: string): ArtPart[] => [
  { label: a, parent, button: 0 },
  { label: b, parent, button: 1 },
  { label: x, parent, button: 2 },
  { label: y, parent, button: 3 },
]

const sticks = (left: string, right: string): ArtPart[] => [
  { label: left, stick: 0 },
  { label: right, stick: 2 },
]

const bumperHalves = (label: string, parent?: string): ArtPart[] => [
  { label, parent, button: 4, clip: 'bumper-left' },
  { label, parent, button: 5, clip: 'bumper-right' },
]

const dpadSlices = (label: string, parent?: string): ArtPart[] => [
  { label, parent, button: 12, clip: 'pad-up' },
  { label, parent, button: 13, clip: 'pad-down' },
  { label, parent, button: 14, clip: 'pad-left' },
  { label, parent, button: 15, clip: 'pad-right' },
]

const ART: Record<ControllerShell, ShellArt> = {
  xbox: {
    name: 'Xbox Wireless Controller',
    svg: prepare(xboxRaw),
    hide: [],
    travel: 0.045,
    parts: [
      ...face('A Button', 'B Button', 'X Button', 'Y Button'),
      ...bumperHalves('Bumpers'),
      { label: 'Left Trigger', trigger: 6 },
      { label: 'Right Trigger', trigger: 7 },
      { label: 'View Button', button: 8 },
      { label: 'Menu Button', button: 9 },
      ...sticks('Left Stick', 'Right Stick'),
      ...dpadSlices('Main D-PAD'),
      { label: 'Xbox Guide Button', button: 16 },
      { label: 'Share Button', button: 17 },
    ],
  },
  'xbox-one': {
    name: 'Xbox One Controller',
    svg: prepare(xboxOneRaw),
    hide: [],
    travel: 0.045,
    parts: [
      ...face('A Button', 'B Button', 'X Button', 'Y Button'),
      ...bumperHalves('Xbox One S Controller Outline'),
      ...bumperHalves('Xbox One Controller Outline'),
      { label: 'Left Trigger', trigger: 6 },
      { label: 'Right Triggers', trigger: 7 },
      { label: 'View Button', button: 8 },
      { label: 'Menu Button', button: 9 },
      ...sticks('Left Stick', 'Right Stick'),
      ...dpadSlices('D-PAD'),
      { label: 'Xbox Guide Button', button: 16 },
    ],
  },
  'xbox-og': {
    name: 'Xbox One Controller',
    svg: prepare(xboxOneRaw),
    hide: ['Xbox One S Layout', 'Xbox One S Controller Outline'],
    show: ['Xbox One OG Layout', 'Xbox One Controller Outline'],
    travel: 0.045,
    parts: [
      ...face('A Button', 'B Button', 'X Button', 'Y Button'),
      ...bumperHalves('Xbox One S Controller Outline'),
      ...bumperHalves('Xbox One Controller Outline'),
      { label: 'Left Trigger', trigger: 6 },
      { label: 'Right Triggers', trigger: 7 },
      { label: 'View Button', button: 8 },
      { label: 'Menu Button', button: 9 },
      ...sticks('Left Stick', 'Right Stick'),
      ...dpadSlices('D-PAD'),
      { label: 'Xbox Guide Button', button: 16 },
    ],
  },
  duke: icon('Xbox Controller (Duke)', dukeRaw),
  'xbox-s': icon('Xbox Controller S', xboxSRaw),
  xbox360: {
    name: 'Xbox 360 Controller',
    svg: prepare(xbox360Raw),
    hide: [],
    travel: 0.05,
    parts: [
      ...face('A Button', 'B Button', 'X Button', 'Y Button'),
      { label: 'Left Bumper', button: 4 },
      { label: 'Right Bumper', button: 5 },
      { label: 'Left Trigger', trigger: 6 },
      { label: 'Right Trigger', trigger: 7 },
      { label: 'Back Button', button: 8 },
      { label: 'Start Button', button: 9 },
      ...sticks('Left Stick', 'Right Stick'),
      ...dpadSlices('D-PAD Color', 'Regular D-PAD'),
      ...dpadSlices('Outline #1', 'Regular D-PAD'),
      ...dpadSlices('Outline #2', 'Regular D-PAD'),
      { label: 'Xbox Guide Button', button: 16 },
    ],
  },
  dualsense: {
    name: 'DualSense',
    svg: prepare(dualsenseRaw),
    hide: [],
    travel: 0.045,
    parts: [
      ...face('Crosss', 'Circle', 'Square', 'Triangle'),
      { label: 'L1', button: 4 },
      { label: 'R1', button: 5 },
      { label: 'L2 Triggers', trigger: 6 },
      { label: 'R2 Trigger', trigger: 7 },
      { label: 'Create Button', button: 8 },
      { label: 'Option Button', button: 9 },
      ...sticks('Left Stick', 'Right Stick'),
      { label: 'D-PAD Up', button: 12 },
      { label: 'D-PAD Down', button: 13 },
      { label: 'D-PAD Left', button: 14 },
      { label: 'D-PAD Right', button: 15 },
      { label: 'PS Button', button: 16 },
    ],
  },
  dualshock: {
    name: 'DualShock 4',
    svg: prepare(dualshockRaw),
    hide: [],
    travel: 0.04,
    parts: [
      ...face('Cross', 'Circle', 'Square', 'Triangle'),
      { label: 'L1', button: 4 },
      { label: 'R1', button: 5 },
      { label: 'Left Trigger', trigger: 6 },
      { label: 'Right Trigger', trigger: 7 },
      { label: 'Share Button', button: 8 },
      { label: 'Option Button', button: 9 },
      ...sticks('Left Stick', 'Right Stick'),
      { label: 'D-PAD Up', button: 12 },
      { label: 'D-PAD Down', button: 13 },
      { label: 'D-PAD Left', button: 14 },
      { label: 'D-PAD Right', button: 15 },
      { label: 'PS Button', button: 16 },
      { label: 'Touchpad', button: 17 },
    ],
  },
  ps1: icon('PlayStation Controller', ps1Raw),
  ps2: icon('DualShock 2', ps2Raw),
  dualshock3: {
    name: 'DualShock 3',
    svg: prepare(dualshock3Raw),
    hide: [],
    travel: 0.04,
    parts: [],
  },
  gamecube: icon('GameCube Controller', gamecubeRaw),
  wii: icon('Wii Remote', wiiRaw),
  'wii-classic': icon('Wii Classic Controller', wiiClassicRaw),
  'wii-u-pro': icon('Wii U Pro Controller', wiiUProRaw),
  nes: icon('NES Controller', nesRaw),
  snes: icon('SNES Controller', snesRaw),
  n64: icon('Nintendo 64 Controller', n64Raw),
  stadia: icon('Google Stadia Controller', stadiaRaw),
  switch: {
    name: 'Nintendo Switch Pro Controller',
    svg: prepare(switchRaw),
    hide: [],
    travel: 0.045,
    parts: [
      ...face('B Button', 'A Button', 'Y Button', 'X Button'),
      { label: 'L Bumper', button: 4 },
      { label: 'R Bumper', button: 5 },
      { label: 'ZL Trigger', trigger: 6 },
      { label: 'ZR Trigger', trigger: 7 },
      { label: 'Minus', button: 8 },
      { label: 'Plus', button: 9 },
      ...sticks('Left Joystick', 'Right Joystick'),
      ...dpadSlices('Color', 'D-PAD'),
      ...dpadSlices('Outline', 'D-PAD'),
      { label: 'Home', button: 16 },
      { label: 'Capture', button: 17 },
    ],
  },
  joycon: {
    name: 'Joy-Con',
    svg: prepare(joyconRaw),
    hide: [],
    travel: 0.04,
    parts: [
      ...face('B Button', 'A Button', 'Y Button', 'X Button'),
      { label: 'L Button', button: 4 },
      { label: 'R Button', button: 5 },
      { label: 'ZL Button', trigger: 6 },
      { label: 'ZR Button', trigger: 7 },
      { label: 'Minus Button', button: 8 },
      { label: 'Plus Button', button: 9 },
      ...sticks('Left Joystick', 'Right Joystick'),
      { label: 'D-PAD Up', button: 12 },
      { label: 'D-PAD Down', button: 13 },
      { label: 'D-PAD Left', button: 14 },
      { label: 'D-PAD Right', button: 15 },
      { label: 'Home Button', button: 16 },
      { label: 'Capture Button', button: 17 },
    ],
  },
  'joycon-left': {
    name: 'Joy-Con (L)',
    svg: prepare(joyconLeftRaw),
    hide: [],
    travel: 0.05,
    parts: [
      { label: 'L Button', button: 4 },
      { label: 'ZL Button', trigger: 6 },
      { label: 'Minus Button', button: 8 },
      { label: 'Left Joystick', stick: 0 },
      { label: 'D-PAD Up', button: 12 },
      { label: 'D-PAD Down', button: 13 },
      { label: 'D-PAD Left', button: 14 },
      { label: 'D-PAD Right', button: 15 },
      { label: 'Capture Button', button: 17 },
    ],
  },
  'joycon-right': {
    name: 'Joy-Con (R)',
    svg: prepare(joyconRightRaw),
    hide: [],
    travel: 0.05,
    parts: [
      ...face('B Button', 'A Button', 'Y Button', 'X Button'),
      { label: 'R Button', button: 5 },
      { label: 'ZR Button', trigger: 7 },
      { label: 'Plus Button', button: 9 },
      { label: 'Right Joystick', stick: 0 },
      { label: 'Home Button', button: 16 },
    ],
  },
  steam2: icon('Steam Controller (2026)', steam2026Raw),
  steam: {
    name: 'Steam Controller',
    svg: prepare(steamRaw),
    hide: [],
    travel: 0.05,
    parts: [
      ...face('A', 'B', 'X', 'Y', 'Face Buttons'),
      { label: 'Left Bumper', button: 4 },
      { label: 'Right Bumper', button: 5 },
      { label: 'Left Trigger', trigger: 6 },
      { label: 'Right Trigger', trigger: 7 },
      { label: 'Select Button', button: 8 },
      { label: 'Start Button', button: 9 },
      { label: 'Analog Stick', parent: 'Left Stick', stick: 0 },
      ...dpadSlices('Left Touchpad D-PAD Outline'),
      { label: 'Steam Guide Button', button: 16 },
    ],
  },
  steamdeck: {
    name: 'Steam Deck',
    svg: prepare(steamDeckRaw),
    hide: [],
    travel: 0.035,
    parts: [
      ...face('A Button', 'B Button', 'X Button', 'Y Button'),
      { label: 'L1 Button', button: 4 },
      { label: 'R1 Button', button: 5 },
      { label: 'L2 Trigger', trigger: 6 },
      { label: 'R2 Trigger', trigger: 7 },
      { label: 'View', button: 8 },
      { label: 'Menu', button: 9 },
      ...sticks('Left Joystick', 'Right Joystick'),
      ...dpadSlices('D-PAD'),
      { label: 'Guide Button', button: 16 },
    ],
  },
  arcade: {
    name: 'Arcade stick',
    svg: prepare(arcadeRaw),
    hide: ['Nintendo Symbols', 'PlayStation Symbols'],
    travel: 0.08,
    parts: [
      ...face('A', 'B', 'X', 'Y', 'Xbox Symbols'),
      { label: 'LB', parent: 'Xbox Symbols', button: 4 },
      { label: 'RB', parent: 'Xbox Symbols', button: 5 },
      { label: 'LT', parent: 'Xbox Symbols', trigger: 6 },
      { label: 'RT', parent: 'Xbox Symbols', trigger: 7 },
      { label: 'Joystick', stick: 0 },
      { label: 'D-PAD Up', button: 12 },
      { label: 'D-PAD Down', button: 13 },
      { label: 'D-PAD Left', button: 14 },
      { label: 'D-PAD Right', button: 15 },
    ],
  },
  generic: {
    name: 'Gamepad',
    svg: prepare(genericRaw),
    hide: [
      'Nintendo - ',
      'PlayStation - ',
      'Nintendo Switch - ',
      'Nintendo Switcch - ',
      'ZL',
      'ZR',
      'LT',
      'RT',
      'LB',
      'RB',
      'LS',
      'RS',
      'L',
      'R',
    ],
    travel: 0.06,
    parts: [
      { label: 'A Button', button: 0 },
      { label: 'R1', button: 5 },
      { label: 'R2', trigger: 7 },
      { label: 'Analog Joystick', parent: 'Left Joystick/Trackpad', stick: 0 },
      { label: 'Analog Joystick', parent: 'Right Joystick/Trackpad', stick: 2 },
      { label: 'D-PAD Up', button: 12 },
      { label: 'D-PAD Down', button: 13 },
      { label: 'D-PAD Left', button: 14 },
      { label: 'D-PAD Right', button: 15 },
    ],
  },
}

function labelOf(node: Element): string {
  return (node.getAttribute('data-label') ?? '').trim()
}

function hidden(label: string, rules: string[]): boolean {
  return rules.some(rule => (rule.endsWith(' ') ? label.startsWith(rule) : label === rule))
}

function underParent(node: Element, parent: string): boolean {
  let current = node.parentElement
  while (current) {
    if (labelOf(current) === parent) return true
    current = current.parentElement
  }
  return false
}

function isDown(buttons: ButtonReading[], index: number): boolean {
  const button = buttons[index]
  return Boolean(button && (button.pressed || button.value > 0.5))
}

/** The protruding arm of a shared plus, in object-bounding-box units. */
const PAD_BOX: Record<Exclude<HighlightClip, 'bumper-left' | 'bumper-right'>, [number, number, number, number]> = {
  'pad-right': [0.6, 0.28, 0.4, 0.44],
  'pad-left': [0, 0.28, 0.4, 0.44],
  'pad-up': [0.28, 0, 0.44, 0.4],
  'pad-down': [0.28, 0.6, 0.44, 0.4],
}

/**
 * Shoulder caps of the Series "Bumpers" group. That group is one compound
 * shape: raised caps at each end and a bar between them. These slices keep
 * the pressed cap and leave the bar dark.
 */
const BUMPER_BOX: Record<'bumper-left' | 'bumper-right', [number, number, number, number]> = {
  'bumper-left': [0, 0, 0.28, 1],
  'bumper-right': [0.7, 0, 0.3, 1],
}

let padClipSerial = 0

function attachClip(
  svg: SVGSVGElement,
  clone: SVGElement,
  box: [number, number, number, number],
  prefix: string,
) {
  const id = `${prefix}-${padClipSerial++}`
  let defs = svg.querySelector('defs')
  if (!defs) {
    defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
    svg.insertBefore(defs, svg.firstChild)
  }
  const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath')
  clipPath.setAttribute('id', id)
  clipPath.setAttribute('clipPathUnits', 'objectBoundingBox')
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  const [x, y, width, height] = box
  rect.setAttribute('x', String(x))
  rect.setAttribute('y', String(y))
  rect.setAttribute('width', String(width))
  rect.setAttribute('height', String(height))
  clipPath.appendChild(rect)
  defs.appendChild(clipPath)
  clone.setAttribute('clip-path', `url(#${id})`)
}

function clipPad(svg: SVGSVGElement, clone: SVGElement, clip: HighlightClip) {
  const box = PAD_BOX[clip as keyof typeof PAD_BOX]
  if (!box) return
  attachClip(svg, clone, box, 'dpad-slice')
}

function tintSlice(node: SVGElement) {
  const shapes = node.matches('path, ellipse, circle, rect, polygon, polyline')
    ? [node]
    : [...node.querySelectorAll('path, ellipse, circle, rect, polygon, polyline')]
  for (const shape of shapes) {
    const el = shape as SVGElement
    const fill = (el.style.fill || el.getAttribute('fill') || '').trim()
    if (fill && fill !== 'none') {
      el.style.fill = '#7dfcbd'
      el.style.fillOpacity = '0.82'
      el.style.stroke = 'none'
      continue
    }
    el.style.display = 'none'
  }
}

function lit(part: ArtPart, buttons: ButtonReading[]): boolean {
  if (part.button !== undefined) return isDown(buttons, part.button)
  if (part.buttons) return part.buttons.some(index => isDown(buttons, index))
  if (part.trigger !== undefined) return (buttons[part.trigger]?.value ?? 0) > 0.08
  if (part.stick !== undefined) return isDown(buttons, part.stick === 0 ? 10 : 11)
  return false
}

function ancestorScale(node: Element | null): number {
  let scale = 1
  let current = node
  while (current && current.tagName.toLowerCase() !== 'svg') {
    const transform = current.getAttribute('transform') ?? ''
    for (const match of transform.matchAll(/matrix\(\s*([-\d.eE]+)/g)) {
      const value = Math.abs(Number.parseFloat(match[1]))
      if (value > 0.01) scale *= value
    }
    for (const match of transform.matchAll(/scale\(\s*([-\d.eE]+)/g)) {
      const value = Math.abs(Number.parseFloat(match[1]))
      if (value > 0.01) scale *= value
    }
    current = current.parentElement
  }
  return scale
}

const templates = new Map<ControllerShell, SVGSVGElement>()

function templateFor(shell: ControllerShell): SVGSVGElement | null {
  const cached = templates.get(shell)
  if (cached) return cached
  const parsed = new DOMParser().parseFromString(ART[shell].svg, 'image/svg+xml')
  const svg = parsed.documentElement
  if (svg.nodeName !== 'svg') return null
  templates.set(shell, svg as unknown as SVGSVGElement)
  return svg as unknown as SVGSVGElement
}

function paint(shell: ControllerShell, buttons: ButtonReading[], axes: number[]): string {
  const art = ART[shell]
  const template = templateFor(shell)
  if (!template) return art.svg
  const svg = template.cloneNode(true) as SVGSVGElement
  svg.removeAttribute('width')
  svg.removeAttribute('height')
  svg.setAttribute('role', 'presentation')

  const width = svg.viewBox.baseVal.width || 1000
  const travel = width * art.travel
  const nodes = svg.querySelectorAll('[data-label]')

  nodes.forEach(node => {
    const label = labelOf(node)
    const element = node as SVGElement
    if (hidden(label, art.hide)) {
      element.style.display = 'none'
      return
    }
    if (art.show?.includes(label)) element.style.display = 'inline'
    const matches = art.parts.filter(candidate => candidate.label === label && (!candidate.parent || underParent(node, candidate.parent)))
    if (matches.length === 0) return
    for (const part of matches) {
      if (!lit(part, buttons)) continue
      if (!part.clip) {
        element.setAttribute('class', `${element.getAttribute('class') ?? ''} hot`.trim())
        continue
      }
      const clone = element.cloneNode(true) as SVGElement
      const bumperBox = part.clip === 'bumper-left' || part.clip === 'bumper-right' ? BUMPER_BOX[part.clip] : null
      if (part.clip.startsWith('pad-')) {
        clipPad(svg, clone, part.clip)
        tintSlice(clone)
        clone.setAttribute('class', 'pad-lit')
      } else if (bumperBox && element.localName === 'g') {
        attachClip(svg, clone, bumperBox, 'bumper-slice')
        tintSlice(clone)
        clone.setAttribute('class', 'pad-lit')
      } else {
        clone.setAttribute('class', `hot clip-${part.clip}`)
      }
      element.insertAdjacentElement('afterend', clone)
    }
    const axis = matches.find(part => part.stick !== undefined)?.stick
    if (axis === undefined) return
    const scale = ancestorScale(element.parentElement)
    const x = ((axes[axis] ?? 0) * travel) / scale
    const y = ((axes[axis + 1] ?? 0) * travel) / scale
    const base = element.getAttribute('transform') ?? ''
    element.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)}) ${base}`.trim())
  })

  return svg.outerHTML
}

interface ControllerArtProps {
  shell: ControllerShell
  buttons: ButtonReading[]
  axes: number[]
}

export function ControllerArt({ shell, buttons, axes }: ControllerArtProps) {
  const html = useMemo(() => paint(shell, buttons, axes), [shell, buttons, axes])
  return <div className="pad-art" role="img" aria-label={ART[shell].name} dangerouslySetInnerHTML={{ __html: html }} />
}
