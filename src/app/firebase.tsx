'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { FirebaseApp, FirebaseOptions, initializeApp } from 'firebase/app'
import { Analytics, getAnalytics, logEvent } from 'firebase/analytics'
import { usePathname, useSearchParams } from 'next/navigation'

export type FirebaseContextType = {
  initialized: boolean
  app: FirebaseApp
  analytics: Analytics | null
  withLogEvent: (callback: (_logEvent: typeof logEvent, analitics: Analytics) => void) => void
}

const defaultContext = {
  initialized: false,
  get app(): FirebaseApp {
    throw new Error('FirebaseContext is not initialized')
  },
  get analytics(): Analytics {
    throw new Error('FirebaseContext is not initialized')
  },
  withLogEvent: () => {
    throw new Error('FirebaseContext is not initialized')
  },
}

const FirebaseContext = createContext<FirebaseContextType>(defaultContext)

export const useFirebase = () => useContext(FirebaseContext)

const init = (config: FirebaseOptions, inactivateAnalytics: boolean): FirebaseContextType => {
  const app = initializeApp(config)
  const analytics = inactivateAnalytics ? null : getAnalytics(app)

  return {
    initialized: true,
    app,
    analytics,
    withLogEvent: analytics
      ? (callback) => {
          callback(logEvent, analytics)
        }
      : () => {},
  }
}

export type FirebaseProviderProps = {
  children: React.ReactNode
  config: FirebaseOptions
  inactivateAnalytics?: boolean
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  config,
  children,
  inactivateAnalytics = false,
}) => {
  const [contextValue, setContextValue] = useState<FirebaseContextType | null>(null)

  useEffect(() => {
    setContextValue(init(config, inactivateAnalytics))
  }, [config, inactivateAnalytics])

  return <FirebaseContext.Provider value={contextValue ?? defaultContext}>{children}</FirebaseContext.Provider>
}

export type FirebaseTrackingProps = {
  children: React.ReactNode
}

/**
 * NOTE:
 *   Since the page_view event is sent automatically, we don't need to send it manually.
 *   This code is just an example.
 */
export const FirebaseTracking: React.FC<FirebaseTrackingProps> = ({ children }) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const firebase = useFirebase()

  useEffect(() => {
    if (!firebase.initialized) {
      return
    }

    firebase.withLogEvent((log, a) => log(a, 'page_view'))
  }, [pathname, searchParams, firebase])

  return <>{children}</>
}
