import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "KE Live",
  description: "Manage your utility bills and payments",
  generator: "js engineerator",
  manifest: "/manifest.json",
  keywords: ["billing", "utility", "payments", "pwa"],
  authors: [{ name: "KE live" }],
  icons: {
    icon: [
      { url: "/icon-192x192.jpg", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.jpg", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon-180x180.jpg", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Billing App",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#F29200",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/apple-icon-180x180.jpg" />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
