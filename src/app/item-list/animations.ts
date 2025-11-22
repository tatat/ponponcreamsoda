import { keyframes } from '@emotion/react'

export const scanlineAnimation = keyframes`
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(4px);
  }
`

export const chromaticAberrationAnimation = keyframes`
  0% {
    filter: url(#chromatic-shift-1);
  }
  0.78125% {
    filter: url(#chromatic-shift-2);
  }
  1.5625% {
    filter: url(#lines-chromatic);
  }
  2.34375% {
    filter: url(#chromatic-shift-1);
  }
  3.125% {
    filter: url(#chromatic-normal);
  }
  50% {
    filter: url(#chromatic-shift-1);
  }
  50.78125% {
    filter: url(#chromatic-shift-2);
  }
  51.5625% {
    filter: url(#lines-chromatic);
  }
  52.34375% {
    filter: url(#chromatic-shift-1);
  }
  52.725% {
    filter: url(#chromatic-shift-1);
  }
  53.50625% {
    filter: url(#chromatic-shift-3);
  }
  54.2875% {
    filter: url(#lines-chromatic);
  }
  55.06875% {
    filter: url(#chromatic-shift-1);
  }
  56.25%,
  100% {
    filter: url(#chromatic-normal);
  }
`
