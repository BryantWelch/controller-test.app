import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { controllerCatalog, type CatalogEntry } from '../gamepad/identify'

function groupsFor(models: CatalogEntry[]) {
  const groups: { manufacturer: string; models: CatalogEntry[] }[] = []
  for (const model of models) {
    const current = groups[groups.length - 1]
    if (current?.manufacturer === model.manufacturer) current.models.push(model)
    else groups.push({ manufacturer: model.manufacturer, models: [model] })
  }
  return groups
}

export function ControllerPicker({
  open,
  currentId,
  onClose,
  onSelect,
}: {
  open: boolean
  currentId: string
  onClose: () => void
  onSelect: (id: string) => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const titleId = useId()
  const [query, setQuery] = useState('')

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      setQuery('')
      dialog.showModal()
      searchRef.current?.focus()
    }
    if (!open && dialog.open) dialog.close()
  }, [open])

  const groups = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const models = controllerCatalog().filter(model => {
      if (!needle) return true
      return `${model.manufacturer} ${model.name}`.toLowerCase().includes(needle)
    })
    return groupsFor(models)
  }, [query])

  return (
    <dialog
      ref={dialogRef}
      className="picker"
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={event => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="picker-body">
        <div className="picker-head">
          <h2 id={titleId}>Which controller is this?</h2>
          <button type="button" className="text-btn" onClick={onClose}>Close</button>
        </div>
        <p className="picker-note">The picture and details change. Buttons, sticks, and rumble stay live.</p>
        <input
          ref={searchRef}
          className="picker-search"
          type="search"
          value={query}
          placeholder="Search controllers"
          onChange={event => setQuery(event.target.value)}
        />
        <div className="picker-scroll">
          {groups.length === 0 && <p className="picker-note">No controller matches that search.</p>}
          {groups.map(group => (
            <section key={group.manufacturer}>
              <h3>{group.manufacturer}</h3>
              <ul>
                {group.models.map(model => (
                  <li key={model.id}>
                    <button
                      type="button"
                      className={model.id === currentId ? 'current' : undefined}
                      onClick={() => onSelect(model.id)}
                    >
                      {model.name}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </dialog>
  )
}
