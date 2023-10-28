import Link from 'next/link'

import { GlobalContextProvider } from 'src/contexts/Global'
import LanguageSwitcher from 'src/components/LanguageSwitcher'

export const metadata = {
  title: 'CFCBerkeley Library',
  description: 'CFCBerkeley Library',
  viewport: 'initial-scale=1, width=device-width',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <GlobalContextProvider>
          <div style={{ zIndex: 2000, padding: '1px', margin: '1px' }}><h3><Link href="/">CFCBerkeley Library</Link></h3></div>
          <div><LanguageSwitcher /></div>
          <div style={{ zIndex: 1000 }}>
            {children}
          </div>
        </GlobalContextProvider>
      </body>
    </html>
  )
}
