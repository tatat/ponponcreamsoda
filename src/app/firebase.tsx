'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { FirebaseApp, FirebaseOptions, initializeApp } from 'firebase/app'
import { Analytics, getAnalytics, logEvent } from 'firebase/analytics'
import { usePathname, useSearchParams } from 'next/navigation'

export type FirebaseContextType = {
  initialized: boolean;
  app: FirebaseApp;
  analytics: Analytics;
}

const defaultContext = {
  initialized: false,
  get app (): FirebaseApp {
    throw new Error('FirebaseContext is not initialized')
  },
  get analytics(): Analytics {
    throw new Error('FirebaseContext is not initialized')
  },
}

const FirebaseContext = createContext<FirebaseContextType>(defaultContext)

export const useFirebase = () => useContext(FirebaseContext)

const init = (config: FirebaseOptions): FirebaseContextType => {
  const app = initializeApp(config)
  const analytics = getAnalytics(app)

  return {
    initialized: true,
    app,
    analytics,
  }
}

export type FirebaseProviderProps = {
  children: React.ReactNode;
  config: FirebaseOptions;
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ config, children }) => {
  const [contextValue, setContextValue] = useState<FirebaseContextType | null>(null)

  useEffect(() => {
    setContextValue(init(config))
  }, [config])

  return (
    <FirebaseContext.Provider value={contextValue ?? defaultContext}>
      {children}
    </FirebaseContext.Provider>
  )
}

export type FirebaseTrackingProps = {
  children: React.ReactNode;
}

export const FirebaseTracking: React.FC<FirebaseTrackingProps> = ({ children }) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const firebase = useFirebase()

  useEffect(() => {
    if (!firebase.initialized) {
      return
    }

    logEvent(firebase.analytics, 'page_view')
  }, [
    pathname,
    searchParams,
    firebase,
  ])

  return <>{children}</>
}
