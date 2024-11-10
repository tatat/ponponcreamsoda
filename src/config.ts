const ensureDefined = <T>(value: T | null | undefined): T => {
  if (value == null) {
    throw new Error('The value is null or undefined')
  }

  return value
}

export const siteOrigin = ensureDefined(process.env.NEXT_PUBLIC_SITE_ORIGIN)

export const inactivateAnalytics = process.env.NEXT_PUBLIC_FIREBASE_INACTIVATE_ANALYTICS === 'true'

export const firebaseConfig = {
  apiKey: ensureDefined(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  authDomain: ensureDefined(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  projectId: ensureDefined(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  storageBucket: ensureDefined(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: ensureDefined(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDERID),
  appId: ensureDefined(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
  measurementId: ensureDefined(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID),
}

export const galleryDriveFolderId = ensureDefined(process.env.NEXT_PUBLIC_GALLERY_DRIVE_FILDER_ID)
