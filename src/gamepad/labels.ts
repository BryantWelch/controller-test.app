import type { ControllerFamily } from './types'

export function familyFromType(type: string, id: string, name: string): ControllerFamily {
  const blob = `${type} ${id} ${name}`.toLowerCase()
  if (blob.includes('xbox') || blob.includes('xinput')) return 'xbox'
  if (
    blob.includes('playstation') ||
    blob.includes('dualshock') ||
    blob.includes('dualsense') ||
    blob.includes('sixaxis')
  ) {
    return 'playstation'
  }
  if (
    blob.includes('nintendo') ||
    blob.includes('switch') ||
    blob.includes('joy-con') ||
    blob.includes('joycon') ||
    blob.includes('gamecube') ||
    blob.includes('wavebird') ||
    blob.includes('wii')
  ) {
    return 'nintendo'
  }
  return 'generic'
}

export type ControllerShell =
  | 'xbox'
  | 'xbox-one'
  | 'xbox-og'
  | 'xbox360'
  | 'duke'
  | 'xbox-s'
  | 'dualsense'
  | 'dualshock'
  | 'dualshock3'
  | 'ps1'
  | 'ps2'
  | 'switch'
  | 'joycon'
  | 'joycon-left'
  | 'joycon-right'
  | 'gamecube'
  | 'wii'
  | 'wii-classic'
  | 'wii-u-pro'
  | 'nes'
  | 'snes'
  | 'n64'
  | 'stadia'
  | 'steam'
  | 'steam2'
  | 'steamdeck'
  | 'arcade'
  | 'generic'

const SHELL_BY_ID: Record<string, ControllerShell> = {
  'xbox-series': 'xbox',
  'xbox-wireless': 'xbox',
  'xbox-wireless-adapter': 'xbox',
  'xbox-one': 'xbox-og',
  'xbox-one-s': 'xbox-one',
  'xbox-elite-1': 'xbox',
  'xbox-elite-2': 'xbox',
  'xbox-360': 'xbox360',
  'xbox-duke': 'duke',
  'xbox-controller-s': 'xbox-s',
  'xbox-adaptive': 'generic',
  'ps5-dualsense': 'dualsense',
  'ps5-dualsense-edge': 'dualsense',
  'ps4-dualshock4': 'dualshock',
  'ps4-dualshock4-v2': 'dualshock',
  'wireless-controller': 'dualshock',
  'ps3-dualshock3': 'dualshock3',
  'switch-pro': 'switch',
  'wii-u-pro': 'wii-u-pro',
  'switch-joycon': 'joycon',
  'switch-joycon-left': 'joycon-left',
  'switch-joycon-right': 'joycon-right',
  gamecube: 'gamecube',
  wiimote: 'wii',
  steam: 'steam',
  'steam-2026': 'steam2',
  'steam-deck': 'steamdeck',
  'hori-fighting-stick': 'arcade',
  qanba: 'arcade',
  stadia: 'stadia',
  '8bitdo': 'generic',
  '8bitdo-pro2': 'generic',
  '8bitdo-sn30': 'snes',
  '8bitdo-sf30': 'snes',
  '8bitdo-nes30': 'nes',
  'astro-c40': 'dualshock',
  'razer-wolverine': 'xbox-one',
  'logitech-f310': 'xbox360',
  'logitech-f710': 'xbox360',
}

function has(compact: string, ...needles: string[]): boolean {
  return needles.some(needle => compact.includes(needle))
}

export function shellFor(modelId: string, name: string, family: ControllerFamily): ControllerShell {
  const known = SHELL_BY_ID[modelId]
  if (known) return known

  const compact = `${modelId} ${name}`.toLowerCase().replace(/[^a-z0-9]+/g, '')

  if (has(compact, 'steamdeck')) return 'steamdeck'
  if (has(compact, 'steam2026', 'steamcontroller2', 'triton')) return 'steam2'
  if (has(compact, 'joyconleft', 'leftjoycon') || (has(compact, 'joycon') && has(compact, 'joyconl') && !has(compact, 'joyconr'))) {
    return 'joycon-left'
  }
  if (has(compact, 'joyconright', 'rightjoycon') || (has(compact, 'joycon') && has(compact, 'joyconr'))) return 'joycon-right'
  if (has(compact, 'joycon')) return 'joycon'
  if (has(compact, 'qanba', 'fightstick', 'fightingstick', 'arcadestick', 'realarcade', 'atrox', 'panthera', 'obsidian')) {
    return 'arcade'
  }
  if (has(compact, 'n64')) return 'n64'
  if (has(compact, 'dualsense', 'playstation5', 'ps5')) return 'dualsense'
  if (has(compact, 'dualshock3', 'sixaxis', 'playstation3', 'ps3')) return 'dualshock3'
  if (has(compact, 'dualshock2', 'playstation2', 'ps2controller')) return 'ps2'
  if (has(compact, 'dualshock1', 'playstation1', 'ps1controller')) return 'ps1'
  if (has(compact, 'dualshock', 'playstation4', 'ps4', 'raiju', 'astroc40')) return 'dualshock'
  if (has(compact, 'elite')) return 'xbox'
  if (has(compact, 'xboxone', 'wolverine', 'wildcat')) return 'xbox-one'
  if (has(compact, 'xbox360', '360controller', 'onza', 'f310', 'f710')) return 'xbox360'
  if (has(compact, 'gamecube', 'wavebird')) return 'gamecube'
  if (has(compact, 'wiimote', 'wiiremote')) return 'wii'
  if (has(compact, 'wiiclassic', 'classiccontroller')) return 'wii-classic'
  if (has(compact, 'wiiupro')) return 'wii-u-pro'
  if (has(compact, 'stadia')) return 'stadia'
  if (has(compact, 'xboxduke', 'originalxbox')) return 'duke'
  if (has(compact, 'xboxcontrollers', 'controllers')) return 'xbox-s'
  if (has(compact, 'nes30', 'nescontroller')) return 'nes'
  if (has(compact, 'sn30', 'sf30', 'sfc30', 'snescontroller')) return 'snes'
  if (has(compact, 'switchpro', 'procontroller') || family === 'nintendo' || has(compact, 'switch')) return 'switch'
  if (has(compact, 'steam')) return 'steam'
  if (family === 'playstation') return 'dualsense'
  if (family === 'xbox' || has(compact, 'xbox', 'xinput')) return 'xbox'
  if (has(compact, '8bitdosn', '8bitdosf', '8bitdon30', '8bitdof30', '8bitdones', '8bitdosfc', 'sfc30')) return 'generic'
  return 'generic'
}

export function buttonLabels(
  family: ControllerFamily,
  mapping: string,
  count: number,
  deviceName: string
): string[] {
  const labels = Array.from({ length: count }, (_, index) => `Button ${index}`)
  if (mapping !== 'standard') return labels

  const shareName =
    deviceName.toLowerCase().includes('dualshock') || deviceName.toLowerCase().includes('ps4')
      ? 'Share'
      : 'Create'

  const named: Record<ControllerFamily, string[]> = {
    xbox: ['A', 'B', 'X', 'Y', 'LB', 'RB', 'LT', 'RT', 'View', 'Menu', 'LS', 'RS', 'Up', 'Down', 'Left', 'Right', 'Guide', 'Share'],
    playstation: ['Cross', 'Circle', 'Square', 'Triangle', 'L1', 'R1', 'L2', 'R2', shareName, 'Options', 'L3', 'R3', 'Up', 'Down', 'Left', 'Right', 'PS'],
    nintendo: ['B', 'A', 'Y', 'X', 'L', 'R', 'ZL', 'ZR', '−', '+', 'LS', 'RS', 'Up', 'Down', 'Left', 'Right', 'Home'],
    generic: ['A', 'B', 'X', 'Y', 'LB', 'RB', 'LT', 'RT', 'Back', 'Start', 'L3', 'R3', 'Up', 'Down', 'Left', 'Right', 'Guide'],
  }

  const table = named[family]
  for (let index = 0; index < count; index += 1) {
    labels[index] = table[index] ?? `Button ${index}`
  }
  return labels
}

export function formatSigned(value: number, digits = 3): string {
  if (!Number.isFinite(value)) return `+${(0).toFixed(digits)}`
  const tiny = 5 * 10 ** -(digits + 1)
  const rounded = Math.abs(value) < tiny ? 0 : value
  return `${rounded >= 0 ? '+' : ''}${rounded.toFixed(digits)}`
}
