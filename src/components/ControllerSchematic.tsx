import { shellFor } from '../gamepad/labels'
import type { ButtonReading, ControllerFamily } from '../gamepad/types'
import { ControllerArt } from './art/ControllerArt'

interface ControllerSchematicProps {
  buttons: ButtonReading[]
  axes: number[]
  family: ControllerFamily
  modelId: string
  name: string
}

export function ControllerSchematic({ buttons, axes, family, modelId, name }: ControllerSchematicProps) {
  return <ControllerArt shell={shellFor(modelId, name, family)} buttons={buttons} axes={axes} />
}
