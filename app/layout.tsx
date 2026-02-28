import type { Metadata } from 'next'
import { Inter, Merriweather } from 'next/font/google'
import './globals.css'
import { Providers } from './Providers'

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
    metadataBase: new URL('https://www.preepcuet.in'),
    title: {
        default: 'PrepCUET | Best CUET & Board Exam Preparation Platform',
        template: '%s | PrepCUET'
    },
    description: 'Ace your CUET & Board Exams with PrepCUET.',
    icons: {
        icon: '/favicon.ico',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${merriweather.variable}`}>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    )
}
