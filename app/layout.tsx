import type React from "react"
import type { Metadata, Viewport } from "next"
import { Space_Grotesk, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/contexts/AuthContext"
import { Toaster } from "sonner"
import AppWrapper from "@/components/app-wrapper"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: "--font-sans",
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Study with AI",
  description: "Your AI-powered study assistant for smart learning",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["study", "AI", "learning", "planner", "education", "student"],
  authors: [{ name: "Study with AI" }],
  icons: {
    icon: [
      { url: "/icon-192x192.jpg", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.jpg", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon-180x180.jpg", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Study with AI",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0f14",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="apple-touch-icon" href="/apple-icon-180x180.jpg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <AuthProvider>
          <AppWrapper>
            {children}
          </AppWrapper>
          <Toaster 
            position="top-center" 
            theme="dark"
            toastOptions={{
              style: {
                background: '#1a2332',
                border: '1px solid rgba(0, 217, 255, 0.2)',
                color: '#fff',
              },
            }}
          />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
