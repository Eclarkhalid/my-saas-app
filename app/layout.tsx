import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'

import { ClerkProvider } from '@clerk/nextjs'
import { ModalProvider } from '@/components/modal-provider'


const inter = Roboto({ subsets: ['latin'], weight: '400' })

export const metadata: Metadata = {
  title: 'ArtiFusion',
  description: 'Generated by ArtiFusion',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ModalProvider />
          {children}</body>
      </html>
    </ClerkProvider>
  )
}
