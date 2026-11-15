import { useState } from 'react'
import { controllerById } from '../gamepad/identify'
import { buttonLabels, familyFromType } from '../gamepad/labels'
import type { ButtonReading, ControllerFamily, PadSnapshot } from '../gamepad/types'
import { useGamepad } from '../gamepad/useGamepad'
import { ButtonHistory } from './ButtonHistory'
import { ButtonList } from './ButtonList'
import { ControllerDetails } from './ControllerDetails'
import { ControllerPicker } from './ControllerPicker'
import { ControllerSchematic } from './ControllerSchematic'
import { RawAxes } from './RawAxes'
import { RumblePanel } from './RumblePanel'
import { StickBench } from './StickBench'

const CHOICE_KEY = 'ct-controller-choice'

function readChoices(): Record<string, string> {
  try {
    const raw = sessionStorage.getItem(CHOICE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return {}
    return Object.fromEntries(
      Object.entries(parsed).filter((entry): entry is [string, string] => {
        return typeof entry[0] === 'string' && typeof entry[1] === 'string' && controllerById(entry[1]) !== null
      })
    )
  } catch {
    return {}
  }
}

function writeChoices(choices: Record<string, string>) {
  sessionStorage.setItem(CHOICE_KEY, JSON.stringify(choices))
}

function withChoice(pad: PadSnapshot, modelId: string | undefined): PadSnapshot {
  const model = modelId ? controllerById(modelId) : null
  if (!model) return pad
  return {
    ...pad,
    name: model.name,
    manufacturer: model.manufacturer,
    description: model.description,
    features: model.features,
    modelId: model.id,
    family: familyFromType(model.type, model.id, model.name),
  }
}

const RESTING_BUTTONS: ButtonReading[] = Array.from({ length: 17 }, () => ({
  pressed: false,
  touched: false,
  value: 0,
}))

function PageIntro() {
  return (
    <header className="page-intro">
      <h1>Controller Test</h1>
      <p className="lede">
        Test Xbox, PlayStation, and Nintendo controllers in your browser. Check buttons, sticks, triggers, stick drift, circularity, and rumble.
      </p>
    </header>
  )
}

export function Tester() {
  const { supported, pads, activeIndex, setActiveIndex, active, pollingHz, drift, pulse } = useGamepad()
  const [choices, setChoices] = useState<Record<string, string>>(readChoices)
  const [pickerOpen, setPickerOpen] = useState(false)

  if (!supported) {
    return (
      <div className="bench">
        <PageIntro />
        <section className="callout standalone">
          <h2>This browser has no Gamepad API</h2>
          <p>Chrome, Edge, and Firefox can test a controller. Safari support is limited.</p>
        </section>
      </div>
    )
  }

  const live = active !== null
  const shown = active ? withChoice(active, choices[active.id]) : null
  const manual = active !== null && shown !== null && shown.modelId !== active.modelId
  const buttons = shown?.buttons ?? RESTING_BUTTONS
  const axes = shown?.axes ?? [0, 0, 0, 0]
  const family: ControllerFamily = shown?.family ?? 'generic'
  const mapping = shown?.mapping ?? 'standard'
  const labels = buttonLabels(family, mapping, buttons.length, shown?.name ?? '')
  const rate = live && pollingHz > 0 ? `${pollingHz} Hz` : 'Waiting for polls'

  const saveChoice = (modelId: string) => {
    if (!active) return
    const next = { ...choices, [active.id]: modelId }
    setChoices(next)
    writeChoices(next)
    setPickerOpen(false)
  }

  const clearChoice = () => {
    if (!active) return
    const next = { ...choices }
    delete next[active.id]
    setChoices(next)
    writeChoices(next)
  }

  return (
    <div className="bench">
      <PageIntro />
      {shown && (
      <div className="status-row">
        <div className="status-copy" role="status">
          <div>
            <h2>{shown.name}</h2>
            <p>
              {shown.manufacturer} · {mapping === 'standard' ? 'Standard mapping' : 'Nonstandard mapping'} · {rate}
            </p>
            <div className="choice-row">
              <button type="button" className="text-btn" onClick={() => setPickerOpen(true)}>
                Change controller
              </button>
              {manual && (
                <button type="button" className="text-btn" onClick={clearChoice}>
                  Use detected
                </button>
              )}
            </div>
            {manual && active && <p className="choice-note">Detected as {active.name}</p>}
          </div>
        </div>
        {pads.length > 1 && (
          <label className="pad-switch">
            <span>Controller</span>
            <select
              value={activeIndex ?? ''}
              onChange={event => setActiveIndex(Number(event.target.value))}
            >
              {pads.map(pad => (
                <option key={pad.index} value={pad.index}>
                  {pad.index + 1}. {controllerById(choices[pad.id] ?? '')?.name ?? pad.name}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      )}

      <div className="layout">
        <section className="stage">
          {shown ? (
            <ControllerSchematic
              buttons={buttons}
              axes={axes}
              family={family}
              modelId={shown.modelId}
              name={shown.name}
            />
          ) : (
            <div className="waiting">
              <div>
                <h2>Press any button</h2>
                <p>Plug in a controller, then press a face button, bumper, or stick. Browsers hide the controller until it sends an input.</p>
              </div>
            </div>
          )}
        </section>

        <div className={live ? 'readouts' : 'readouts idle'}>
          <StickBench
            live={live}
            leftX={axes[0] ?? 0}
            leftY={axes[1] ?? 0}
            rightX={axes[2] ?? 0}
            rightY={axes[3] ?? 0}
            leftDrifting={live && drift.left}
            rightDrifting={live && drift.right}
          />
          <ButtonHistory buttons={buttons} labels={labels} />
          <ButtonList buttons={buttons} labels={labels} />
          <div className="split">
            <RawAxes axes={live ? active.axes : [0, 0, 0, 0]} />
            <RumblePanel
              connected={live}
              enabled={active !== null && active.rumble}
              onPulse={(strong, weak, duration) => pulse(active?.index ?? 0, strong, weak, duration)}
            />
          </div>
          {shown && <ControllerDetails pad={shown} pollingHz={pollingHz} />}
        </div>
      </div>
      {shown && (
        <ControllerPicker
          open={pickerOpen}
          currentId={shown.modelId}
          onClose={() => setPickerOpen(false)}
          onSelect={saveChoice}
        />
      )}
    </div>
  )
}
