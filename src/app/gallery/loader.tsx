import { css } from '@emotion/react'

export const Loader = () => {
  return (
    <div
      css={css`
        &,
        &:before,
        &:after {
          border-radius: 50%;
          width: 10px;
          height: 10px;
          animation-fill-mode: both;
          animation: bblFadInOut 1.8s infinite ease-in-out;
        }

        & {
          color: #fff;
          font-size: 7px;
          position: relative;
          text-indent: -9999em;
          transform: translateZ(0);
          animation-delay: -0.16s;
        }

        &:before,
        &:after {
          content: '';
          position: absolute;
          top: 0;
        }

        &:before {
          left: -30px;
          animation-delay: -0.32s;
        }
        &:after {
          left: 30px;
        }

        @keyframes bblFadInOut {
          0%,
          80%,
          100% {
            box-shadow: 0 2.5em 0 -1.3em;
          }
          40% {
            box-shadow: 0 2.5em 0 0;
          }
        }
      `}
    />
  )
}
