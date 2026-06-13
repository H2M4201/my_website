import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'A modern portfolio website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-p6O5X5GZ7B0Kt+TseinrD8qDq2Jnl3WRwLfQkN08aiiB0YVxxQ0CdP6W/DEU0A3GzShn8b9IZh3Pz8fYd2VB5w=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}