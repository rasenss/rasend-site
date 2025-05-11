import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Poppins } from 'next/font/google'
import ClientNavbarWrapper from '@/components/ClientNavbarWrapper'
import { ThemeProvider } from '@/components/ThemeProvider'
import Footer from '@/components/Footer'
import ContactNavFix from '@/components/ContactNavFix'


// Optimize font loading
const poppins = Poppins({ 
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap', // Improves perceived loading performance
  preload: true,
})

export const metadata: Metadata = {
  title: 'Rasendriya | Portfolio',
  description: 'Personal Portfolio Website',
  robots: {
    index: true,
    follow: true,
  },
  authors: [{ name: 'Rasendriya Khansa' }],
  metadataBase: new URL('https://your-domain.com'), // Replace with your actual domain
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: 'rgb(38,43,61)',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${poppins.variable} scroll-smooth dark`}>
      <body className="bg-gray-900 text-white">
        <ThemeProvider>
          <ClientNavbarWrapper />
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow pt-16 sm:pt-20 md:pt-24 px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8">
              {children}
            </main>
            <Footer />
          </div>
          {/* This component fixes contact navigation issues */}
          <ContactNavFix />
        </ThemeProvider>
      </body>
    </html>
  )
}
