import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/nav.css'

const AFFILIATE_TAG = 'bryantwelch-20'

function amazonProduct(asin: string) {
  return `https://www.amazon.com/dp/${asin}?tag=${AFFILIATE_TAG}`
}

function amazonSearch(query: string) {
  return `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${AFFILIATE_TAG}`
}

type NavItem = {
  name: string
  href: string
}

type NavMenu = {
  id: string
  label: string
  alignEnd?: boolean
  items: NavItem[]
}

const menus: NavMenu[] = [
  {
    id: 'xbox',
    label: 'Xbox',
    items: [
      { name: 'Xbox Wireless Controller (Series)', href: amazonProduct('B088GJR4B9') },
      { name: 'Xbox Elite Wireless Controller Series 2', href: amazonProduct('B07SFKTLZM') },
      { name: 'Xbox One Wireless Controller', href: amazonProduct('B017O3H5PI') },
      { name: 'Xbox 360 Wireless Controller', href: amazonSearch('Xbox 360 Wireless Controller') },
      { name: 'Xbox Adaptive Controller', href: amazonSearch('Xbox Adaptive Controller') },
    ],
  },
  {
    id: 'nintendo',
    label: 'Nintendo',
    items: [
      { name: 'Nintendo Switch Pro Controller', href: amazonProduct('B01NAWKYZ0') },
      { name: 'Joy-Con pair', href: amazonSearch('Nintendo Switch Joy-Con pair') },
      { name: 'GameCube Controller', href: amazonProduct('B07DQXQQG3') },
      { name: 'Wii U Pro Controller', href: amazonProduct('B00MUY0OFU') },
    ],
  },
  {
    id: 'playstation',
    label: 'PlayStation',
    items: [
      { name: 'DualSense', href: amazonSearch('DualSense Wireless Controller') },
      { name: 'DualSense Edge', href: amazonProduct('B0BSYFB99D') },
      { name: 'DualShock 4', href: amazonProduct('B00KVP76G0') },
    ],
  },
  {
    id: 'other-controllers',
    label: 'Other Controllers',
    alignEnd: true,
    items: [
      { name: '8BitDo Pro 2', href: amazonProduct('B09MFJHR7Q') },
      { name: 'Logitech F310', href: amazonProduct('B003VAHYQY') },
      { name: 'Razer Wolverine V2', href: amazonProduct('B09KHV33VJ') },
      { name: 'PowerA Enhanced', href: amazonProduct('B08DRRYJV8') },
      { name: 'HORI Fighting Commander OCTA', href: amazonProduct('B09RQTTWPQ') },
      { name: 'SCUF Instinct Pro', href: amazonProduct('B0FQC36Y7Q') },
    ],
  },
  {
    id: 'other-tools',
    label: 'Other Tools',
    alignEnd: true,
    items: [
      { name: 'Display Test', href: 'https://display-test.app' },
      { name: 'Keyboard Test', href: 'https://keyboard-test.app' },
    ],
  },
]

type OpenMenu = {
  id: string
  pinned: boolean
}

function GitHubMark() {
  return (
    <svg className="nav-github-mark" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
      />
    </svg>
  )
}

function Chevron() {
  return (
    <svg className="nav-chevron" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
    </svg>
  )
}

function ExternalIcon() {
  return (
    <svg className="nav-external" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3zM5 5h6v2H7v10h10v-4h2v6H5V5z"
      />
    </svg>
  )
}

function moveLinkFocus(current: HTMLElement, key: string) {
  if (key !== 'ArrowDown' && key !== 'ArrowUp') return
  const links = Array.from(current.querySelectorAll<HTMLAnchorElement>('a'))
  const index = links.indexOf(document.activeElement as HTMLAnchorElement)
  if (index < 0) return
  const next = key === 'ArrowDown' ? index + 1 : index - 1
  links[(next + links.length) % links.length]?.focus()
}

export function SiteNav() {
  const [open, setOpen] = useState<OpenMenu | null>(null)
  const navRef = useRef<HTMLElement>(null)
  const openRef = useRef(open)
  const closeTimer = useRef<number | undefined>(undefined)
  const buttonRefs = useRef(new Map<string, HTMLButtonElement>())

  openRef.current = open

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape' || !openRef.current) return
      event.preventDefault()
      const id = openRef.current.id
      setOpen(null)
      buttonRefs.current.get(id)?.focus()
    }

    function onPointerDown(event: PointerEvent) {
      if (!openRef.current) return
      const target = event.target
      if (target instanceof Node && navRef.current?.contains(target)) return
      setOpen(null)
    }

    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointerDown)
      window.clearTimeout(closeTimer.current)
    }
  }, [])

  function hoverOpen(id: string) {
    window.clearTimeout(closeTimer.current)
    setOpen((current) => {
      if (current?.pinned) return current
      return { id, pinned: false }
    })
  }

  function hoverLeave(id: string) {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => {
      setOpen((current) => {
        if (!current || current.pinned || current.id !== id) return current
        return null
      })
    }, 140)
  }

  function toggle(id: string) {
    window.clearTimeout(closeTimer.current)
    setOpen((current) => {
      if (current?.id === id && current.pinned) return null
      return { id, pinned: true }
    })
  }

  function focusFirstLink(id: string) {
    window.setTimeout(() => {
      document.getElementById(`nav-panel-${id}`)?.querySelector('a')?.focus()
    }, 0)
  }

  return (
    <header className="topbar site-nav">
      <Link to="/" className="brand site-brand">
        Controller Test
      </Link>
      <nav className="site-nav-menus" aria-label="Controllers and tools" ref={navRef}>
        {menus.map((menu) => {
          const expanded = open?.id === menu.id
          return (
            <div
              key={menu.id}
              className={menu.alignEnd ? 'nav-menu nav-menu-end' : 'nav-menu'}
              onMouseEnter={() => hoverOpen(menu.id)}
              onMouseLeave={() => hoverLeave(menu.id)}
              onBlur={(event) => {
                const menuEl = event.currentTarget
                const id = menu.id
                window.setTimeout(() => {
                  if (menuEl.contains(document.activeElement)) return
                  setOpen((current) => (current?.id === id ? null : current))
                }, 0)
              }}
            >
              <button
                type="button"
                className="nav-menu-btn"
                aria-expanded={expanded}
                aria-haspopup="true"
                aria-controls={`nav-panel-${menu.id}`}
                ref={(node) => {
                  if (node) buttonRefs.current.set(menu.id, node)
                  else buttonRefs.current.delete(menu.id)
                }}
                onClick={() => toggle(menu.id)}
                onKeyDown={(event) => {
                  if (event.key !== 'ArrowDown') return
                  event.preventDefault()
                  window.clearTimeout(closeTimer.current)
                  setOpen({ id: menu.id, pinned: true })
                  focusFirstLink(menu.id)
                }}
              >
                {menu.label}
                <Chevron />
              </button>
              {expanded ? (
                <div
                  className="nav-panel"
                  id={`nav-panel-${menu.id}`}
                  onKeyDown={(event) => {
                    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
                    event.preventDefault()
                    moveLinkFocus(event.currentTarget, event.key)
                  }}
                >
                  <ul className="nav-list">
                    {menu.items.map((item) => (
                      <li key={item.href}>
                        <a
                          className="nav-link"
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="nav-link-name">{item.name}</span>
                          <ExternalIcon />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          )
        })}
      </nav>
      <a
        className="nav-github"
        href="https://github.com/BryantWelch/controller-test.app"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub repository"
      >
        <GitHubMark />
      </a>
    </header>
  )
}
