import type { ReactNode } from 'react'
import { SiteFooter } from './SiteFooter'
import { SiteNav } from './SiteNav'

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="app">
      <SiteNav />
      <main>{children}</main>
      <SiteFooter />
    </div>
  )
}
