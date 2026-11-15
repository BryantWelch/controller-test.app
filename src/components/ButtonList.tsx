import type { ButtonReading } from '../gamepad/types'

interface ButtonListProps {
  buttons: ButtonReading[]
  labels: string[]
}

export function ButtonList({ buttons, labels }: ButtonListProps) {
  return (
    <section className="panel">
      <header className="panel-head">
        <h2>Buttons</h2>
      </header>
      {buttons.length === 0 ? (
        <p className="muted">No buttons reported.</p>
      ) : (
        <ul className="button-list">
          {buttons.map((button, index) => (
            <li key={index} className={button.pressed ? 'hot' : button.touched ? 'touched' : undefined}>
              <span className="b-name">{labels[index] ?? `Button ${index}`}</span>
              <span className="meter" aria-hidden="true">
                <span style={{ width: `${Math.min(100, Math.max(0, button.value * 100))}%` }} />
              </span>
              <span className="num">{button.value.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
