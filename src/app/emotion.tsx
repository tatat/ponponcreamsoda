'use client'

import { CacheProvider, ThemeProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import { useServerInsertedHTML } from 'next/navigation'
import { useState } from 'react'
import { theme } from '@/theme'

type RootStyleRegistryProps = {
  children: React.ReactNode;
}

export default function RootStyleRegistry({ children }: RootStyleRegistryProps): React.ReactElement {
  const [cache] = useState(() => {
    const cache = createCache({ key: 'css' })

    cache.compat = true

    return cache
  })

  useServerInsertedHTML(() => {
    return (
      <style
        data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: Object.values(cache.inserted).join(' '),
        }}
      />
    )
  })

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </CacheProvider>
  )
}
