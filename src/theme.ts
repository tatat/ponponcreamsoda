import { css } from '@emotion/react'

const breakpoints = {
  landscape: '(orientation: landscape)',
  portrait: '(orientation: portrait)',
  compact: '(max-width: 1399px)',
}

const styles = {
  text: css`
    letter-spacing: 0.05em;
    font-family: 'Kaisei Decol', serif;
    line-height: 1.3;
  `,
  textMenu: css`
    letter-spacing: 0.05em;
    font-family: futura-pt, sans-serif;
    line-height: 1.3;
  `,
}

export const theme = {
  breakpoints,
  styles,
}

export type Theme = typeof theme
