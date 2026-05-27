import type { Metadata } from 'next'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="admin-bg min-h-screen">
        {children}
      </body>
    </html>
  )
}
