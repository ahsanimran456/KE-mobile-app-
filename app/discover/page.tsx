"use client"

import { useState } from "react"
import { Search, TrendingUp, Lightbulb, Gift, Megaphone, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BottomNav } from "@/components/bottom-nav"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { NotificationPanel } from "@/components/notification-panel"

export default function DiscoverPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)

  return (
    <>
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header
          title="DISCOVER"
          onMenuClick={() => setSidebarOpen(true)}
          onNotificationClick={() => setNotificationOpen(true)}
        />

        <main className="flex-1 p-4 pb-24 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search offers, tips, and more..." className="pl-10" />
          </div>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">Energy Saving Tips</h2>
            <div className="space-y-3">
              <Card className="border-none shadow-md">
                <CardContent className="flex items-start gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                    <Lightbulb className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Use LED Bulbs</h3>
                    <p className="text-sm text-muted-foreground">Save up to 75% on lighting costs</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardContent className="flex items-start gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Monitor Usage</h3>
                    <p className="text-sm text-muted-foreground">Track your consumption patterns</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">Special Offers</h2>
            <Card className="border-none bg-gradient-to-r from-primary to-orange-400 shadow-lg">
              <CardContent className="p-6 text-primary-foreground">
                <div className="flex items-start gap-4">
                  <Gift className="h-8 w-8" />
                  <div>
                    <h3 className="text-lg font-bold">Early Payment Discount</h3>
                    <p className="text-sm text-primary-foreground/90">Pay 5 days early and get 2% off</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">Updates & News</h2>
            <div className="space-y-3">
              <Card className="border-none shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Megaphone className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">New Mobile App Features</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Check out our latest update with improved payment options and bill tracking.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Security Update</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    We've enhanced our security measures to protect your account better.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>

        <BottomNav active="discover" />
      </div>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <NotificationPanel open={notificationOpen} onClose={() => setNotificationOpen(false)} />
    </>
  )
}
