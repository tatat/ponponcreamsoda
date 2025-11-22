import 'normalize.css'
import './global.scss'
import RootStyleRegistry from './emotion'
import { FirebaseProvider } from './firebase'
import { firebaseConfig, inactivateAnalytics } from '@/config'
import { Kaisei_Decol } from 'next/font/google'

const kaiseiDecol = Kaisei_Decol({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-kaisei-decol',
})

export const metadata = {
  title: 'Pon Pon Creamsoda',
  description: 'Pon Pon Creamsoda Website',
  icons: {
    icon: '/images/logo.svg',
  },
}

type RootLayoutProps = {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps): React.ReactElement {
  return (
    <html lang="ja" className={kaiseiDecol.variable}>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/ebk1gqb.css" />
      </head>
      <body>
        <RootStyleRegistry>
          <FirebaseProvider config={firebaseConfig} inactivateAnalytics={inactivateAnalytics}>
            {children}
          </FirebaseProvider>
        </RootStyleRegistry>
      </body>
    </html>
  )
}
