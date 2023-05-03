import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { isDescendantOrSelfOf } from '@/helpers'

export const useMenu = <E extends Element = Element>(): {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
  containerRef: React.MutableRefObject<E | null>;
} => {
  const [opened, setOpened] = useState(false)
  const containerRef = useRef<E | null>(null)

  useEffect(() => {
    const containerEl = containerRef.current

    if (!containerEl) {
      return
    }

    if (!opened) {
      return
    }

    const handleDocClick = (e: MouseEvent): void => {
      if (isDescendantOrSelfOf(containerEl, e.target)) {
        return
      }

      setOpened(false)
    }

    document.addEventListener('click', handleDocClick)

    return () => {
      document.removeEventListener('click', handleDocClick)
    }
  }, [opened])

  return useMemo(() => ({
    opened,
    setOpened,
    containerRef,
  }), [opened, setOpened])
}
