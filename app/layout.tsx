import type React from "react"
import type { Metadata, Viewport } from "next"
import { AuthProvider } from "@/contexts/auth-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "TaskMaster - Todo App",
  description: "Organize your tasks with ease. A beautiful and intuitive task management app.",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["todo", "tasks", "productivity", "pwa", "task manager"],
  authors: [{ name: "TaskMaster" }],
  icons: {
    icon: [
      { url: "/icon-192x192.jpg", sizes: "192x192", type: "image/jpeg" },
      { url: "/icon-512x512.jpg", sizes: "512x512", type: "image/jpeg" },
    ],
    apple: [{ url: "/apple-icon-180x180.jpg", sizes: "180x180", type: "image/jpeg" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TaskMaster",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    title: "TaskMaster - Todo App",
    description: "Organize your tasks with ease",
    siteName: "TaskMaster",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#f97316",
  viewportFit: "cover",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="font-sans antialiased overscroll-none">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
