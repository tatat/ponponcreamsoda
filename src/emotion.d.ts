import '@emotion/react'
import type { Theme as _Theme } from './theme'

declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface Theme extends _Theme {}
}
