import type { Metadata } from 'next'
import { Lato } from 'next/font/google'
import './globals.css'

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
})

export const metadata: Metadata = {
  title: 'Urantia Auth Example',
  description: 'Example app demonstrating @urantia/auth OAuth integration',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${lato.className} min-h-screen bg-gray-950 text-white antialiased`}>
        <div className="flex min-h-screen items-center justify-center px-4">
          {children}
        </div>
      </body>
    </html>
  )
}
