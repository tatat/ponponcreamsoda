import { useEffect, useRef, useState } from 'react'
import { useTheme } from '@emotion/react'
import type { Theme } from '@/theme'

export type Breakpoint = keyof Theme['breakpoints']
export type UseBreakpointFactory<T> = (breakpoint: Breakpoint | null) => T

export const useBreakpoint = <T>(factory: UseBreakpointFactory<T>) => {
  const { breakpoints } = useTheme()
  const [data, setData] = useState<T>(factory(null))
  const factoryRef = useRef<UseBreakpointFactory<T>>()
  const prevMatchedRef = useRef<Breakpoint | null>(null)

  factoryRef.current = factory

  useEffect(() => {
    const run = () => {
      const matched = Object.entries(breakpoints).find(([, query]) => {
        return window.matchMedia(query).matches
      })

      const breakpoint = matched ? (matched[0] as Breakpoint) : null

      if (breakpoint === prevMatchedRef.current) {
        return
      }

      prevMatchedRef.current = breakpoint

      if (!factoryRef.current) {
        throw new Error('The factory was gone')
      }

      setData(factoryRef.current(breakpoint))
    }

    run()

    window.addEventListener('resize', run)

    return () => {
      window.removeEventListener('resize', run)
    }
  }, [breakpoints])

  return data
}
