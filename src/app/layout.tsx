import 'normalize.css'
import './global.scss'
import RootStyleRegistry from './emotion'

export const metadata = {
  title: 'Pon Pon Creamsoda',
  description: 'Pon Pon Creamsoda',
  icons: {
    icon: '/images/logo.svg',
  },
}

type RootLayoutProps = {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): React.ReactElement {
  return (
    <html lang="ja">
      <body>
        <RootStyleRegistry>
          {children}
        </RootStyleRegistry>
      </body>
    </html>
  )
}
