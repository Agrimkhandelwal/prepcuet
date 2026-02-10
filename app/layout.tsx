import type { Metadata } from 'next'
import { Inter, Merriweather } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import AnnouncementBar from '@/components/AnnouncementBar'
import Footer from '@/components/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-merriweather',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://prepcuet.com'), // Replace with your actual domain
  title: {
    default: 'PrepCUET | Best CUET & Board Exam Preparation Platform',
    template: '%s | PrepCUET'
  },
  description: 'Ace your CUET & Board Exams with PrepCUET. Get free study materials, mock tests, daily quizzes, and expert guidance for university admissions. Join the best learning community today!',
  keywords: [
    'CUET', 'CUET 2026', 'CUET Preparation', 'College Entrance Exam',
    'University Admissions', 'Mock Tests', 'Study Material', 'Online Classes',
    'PrepCUET', 'NTA CUET', 'Central Universities Entrance Test',
    'Board Exams', 'Class 12 Preparation', 'CUET Syllabus', 'CUET Pattern'
  ],
  authors: [{ name: 'PrepCUET Team' }],
  creator: 'PrepCUET',
  publisher: 'PrepCUET',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://prepcuet.com',
    title: 'PrepCUET | Your Gateway to Top Universities',
    description: 'Comprehensive resource for CUET exam preparation. Study materials, mock tests, and expert guidance for university admissions.',
    siteName: 'PrepCUET',
    images: [
      {
        url: '/logo.png', // Ensure this image captures your brand well
        width: 1200,
        height: 630,
        alt: 'PrepCUET - CUET Preparation Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PrepCUET | Best CUET & Board Exam Preparation',
    description: 'Join thousands of students preparing for CUET with PrepCUET. Free resources, tests, and mentorship.',
    images: ['/logo.png'], // Using logo for now, consider a specific social card image
    creator: '@PrepCUET', // Replace with actual handle if available
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png', // Ensure you have this or remove
  },
  manifest: '/site.webmanifest', // Ensure you have this or remove
}

import { Providers } from './Providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${merriweather.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'PrepCUET',
              url: 'https://prepcuet.com',
              logo: 'https://prepcuet.com/logo.png',
              sameAs: [
                'https://facebook.com/prepcuet',
                'https://twitter.com/prepcuet',
                'https://instagram.com/prepcuet',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+91-1234567890',
                contactType: 'customer service',
              },
            }),
          }}
        />
        <Providers>
          <div className="min-h-screen flex flex-col">
            <AnnouncementBar />
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
