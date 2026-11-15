export type ControllerFamily = 'xbox' | 'playstation' | 'nintendo' | 'generic'

export interface ButtonReading {
  pressed: boolean
  touched: boolean
  value: number
}

export interface PadSnapshot {
  index: number
  id: string
  mapping: string
  name: string
  manufacturer: string
  description: string
  features: string[]
  modelId: string
  family: ControllerFamily
  buttons: ButtonReading[]
  axes: number[]
  rumble: boolean
}

export interface PadChoice {
  index: number
  id: string
  name: string
}
