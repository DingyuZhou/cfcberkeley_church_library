import { GlobalContextProvider } from 'src/contexts/Global'

import Header from './Header'
import LocalStorageLoader from './LocalStorageLoader'

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
          <LocalStorageLoader>
            <Header />
            {children}
          </LocalStorageLoader>
        </GlobalContextProvider>
      </body>
    </html>
  )
}
