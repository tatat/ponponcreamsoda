import 'normalize.css'
import './global.scss'
import RootStyleRegistry from './emotion'
import { FirebaseProvider } from './firebase'
import { firebaseConfig, inactivateAnalytics } from '@/config'

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
    <html lang="ja">
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
