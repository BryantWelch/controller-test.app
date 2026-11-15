import { useEffect } from 'react'

const ORIGIN = 'https://controller-test.app'

function setMeta(selector: string, value: string) {
  const element = document.querySelector(selector)
  if (!element) return null
  const previous = element.getAttribute('content')
  element.setAttribute('content', value)
  return previous
}

export function usePageMeta(title: string, description: string, path: string) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title
    const previousDescription = setMeta('meta[name="description"]', description)
    const previousOgTitle = setMeta('meta[property="og:title"]', title)
    const previousOgDescription = setMeta('meta[property="og:description"]', description)
    const previousOgUrl = setMeta('meta[property="og:url"]', `${ORIGIN}${path}`)
    const previousTwitterTitle = setMeta('meta[name="twitter:title"]', title)
    const previousTwitterDescription = setMeta('meta[name="twitter:description"]', description)

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    const createdCanonical = canonical === null
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    const previousCanonical = canonical.href
    canonical.href = `${ORIGIN}${path}`

    return () => {
      document.title = previousTitle
      if (previousDescription !== null) setMeta('meta[name="description"]', previousDescription)
      if (previousOgTitle !== null) setMeta('meta[property="og:title"]', previousOgTitle)
      if (previousOgDescription !== null) setMeta('meta[property="og:description"]', previousOgDescription)
      if (previousOgUrl !== null) setMeta('meta[property="og:url"]', previousOgUrl)
      if (previousTwitterTitle !== null) setMeta('meta[name="twitter:title"]', previousTwitterTitle)
      if (previousTwitterDescription !== null) setMeta('meta[name="twitter:description"]', previousTwitterDescription)
      if (createdCanonical) canonical?.remove()
      else canonical.href = previousCanonical
    }
  }, [title, description, path])
}
