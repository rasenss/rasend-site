import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Poppins } from 'next/font/google'
import ClientNavbarWrapper from '@/components/ClientNavbarWrapper'
import { ThemeProvider } from '@/components/ThemeProvider'
import Footer from '@/components/Footer'
import ContactNavFix from '@/components/ContactNavFix'
import NavbarEnhancer from '@/components/NavbarEnhancer'
import AnimationOptimizer from '@/components/AnimationOptimizer'
import PerformanceOptimizer from '@/components/PerformanceOptimizer'
import MobileCompatFix from '@/components/MobileCompatFix'
import MobileNavFix from '@/components/MobileNavFix'
import Script from 'next/script'


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
}) {  return (
    <html lang="en" className={`${poppins.variable} scroll-smooth dark optimize-animations`}>
      <head>
        {/* Hydration error fix script - must run before React hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Ensure optimize-animations class is always present to prevent hydration mismatch
              if (!document.documentElement.classList.contains('optimize-animations')) {
                document.documentElement.classList.add('optimize-animations');
              }
              // Remove any dynamically-added classes that cause hydration mismatches
              if (document.documentElement.classList.contains('low-end-device')) {
                document.documentElement.classList.remove('low-end-device');
              }
            `
          }}
        />
      </head>
      <body className="bg-gray-900 text-white">
        {/* Early-loaded animation optimization script */}
        <Script
          id="animation-perf-early"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Reduced motion preference check only - class already added in JSX
              
              // Check for reduced motion preference
              if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                document.documentElement.classList.add('reduce-motion-preferred');
              }
                // Instead of adding the class directly, we'll set a data attribute
              // This avoids hydration mismatches since data attributes don't affect rendering directly
              if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                  (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
                  window.innerWidth < 768) {
                document.documentElement.dataset.lowEndDevice = 'true';
              }
            `
          }}
        />
        <NavbarEnhancer />
        <ThemeProvider>
          {/* Performance optimizers for better animation rendering */}          <AnimationOptimizer />
          <PerformanceOptimizer />
          <MobileCompatFix />
          <MobileNavFix />
          <Script src="/optimizeAnimations.js" strategy="afterInteractive" />
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
