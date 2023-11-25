'use client'

import { css, useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import React from 'react'

export const Container = styled.main`
  position: relative;
  min-height: 100vh;
  min-height: 100lvh;
`

export const Inner = styled.div`
  position: relative;
  min-height: 100vh;
  min-height: 100lvh;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1fr 2fr;

  @media ${({ theme }) => theme.breakpoints.portrait} {
    grid-template-columns: auto;
    display: flex;
    flex-direction: column;
  }
`

export const Inner1 = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  gap: 2px;
`

export const Inner2 = styled.div`
  box-sizing: border-box;
  position: relative;
  padding: 6%;
  overflow: hidden;
  min-height: 100vmin;
  min-height: 100dvmin;

  @media ${({ theme }) => theme.breakpoints.portrait} {
    flex: 1;
  }
`

export const Title = styled.div`
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  padding: 6%;
`

export type ContentTitleProps = React.ComponentProps<'div'> & {
  children: React.ReactNode;
}

export const ContentTitle = React.forwardRef<HTMLDivElement, ContentTitleProps>(function ContentTitle({ children, ...props }, ref) {
  const theme = useTheme()

  return (
    <div
      ref={ref}
      css={css`
        box-sizing: border-box;
        padding: 4%;
      `}
      {...props}
    >
      <h2
        css={css`
          ${theme.styles.text};
          margin: 0;
          font-size: 2rem;

          span {
            display: inline-block;
          }

          @media ${theme.breakpoints.portrait} {
            font-size: 1.4rem;
          }
        `}
      >
        {children}
      </h2>
    </div>
  )
})

export const Content = styled.div`
  box-sizing: border-box;
  flex: 1;
  padding: 4%;
`
