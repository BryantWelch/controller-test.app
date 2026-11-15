import { formatSigned } from '../gamepad/labels'

export function RawAxes({ axes }: { axes: number[] }) {
  return (
    <section className="panel">
      <header className="panel-head">
        <h2>Axes</h2>
      </header>
      {axes.length === 0 ? (
        <p className="muted">No axes reported.</p>
      ) : (
        <ul className="axis-list">
          {axes.map((value, index) => {
            const amount = Math.min(1, Math.abs(value))
            return (
              <li key={index}>
                <span className="b-name">Axis {index}</span>
                <span className="bipolar" aria-hidden="true">
                  <span
                    className="bipolar-fill"
                    style={
                      value >= 0
                        ? { left: '50%', width: `${amount * 50}%` }
                        : { left: `${(1 - amount) * 50}%`, width: `${amount * 50}%` }
                    }
                  />
                </span>
                <span className="num">{formatSigned(value)}</span>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
