"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Menu, Bell, Wallet, Clock, Receipt, CreditCard, TrendingUp, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { InstallPrompt } from "@/components/install-prompt"
import { BottomNav } from "@/components/bottom-nav"
import { Sidebar } from "@/components/sidebar"
import { NotificationPanel } from "@/components/notification-panel"

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const router = useRouter()

  return (
    <>
      <div className="flex min-h-screen flex-col bg-gray-50">
        {/* Header */}
        <header className="sticky top-0 z-50 flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground shadow-md">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-bold tracking-wide">HOME</h1>
          <Button
            variant="ghost"
            size="icon"
            className="relative text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => setNotificationOpen(true)}
          >
            <Bell className="h-6 w-6" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
        </header>

        {/* Profile Section */}
        <div className="bg-primary px-4 pb-6 pt-4 text-primary-foreground">
          <div className="flex items-center gap-3">
            <Avatar className="h-14 w-14 border-2 border-primary-foreground/20">
              <AvatarFallback className="bg-primary-foreground/10 text-lg font-semibold text-primary-foreground">
                MA
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">Muhammad Ahsan</h2>
              <p className="text-sm text-primary-foreground/80">CSC-23s-289</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 space-y-4 p-4 pb-24">
          {/* Amount Payable Card */}
          <Card className="overflow-hidden border-none shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Wallet className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Amount Payable</p>
                    <p className="text-2xl font-bold text-primary">PKR 4,250</p>
                  </div>
                </div>
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => router.push("/payment")}
                >
                  Pay Now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card
              className="cursor-pointer border-none shadow-md transition-shadow hover:shadow-lg"
              onClick={() => router.push("/payment-history")}
            >
              <CardContent className="flex flex-col items-center gap-2 p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
                  <Clock className="h-7 w-7 text-blue-500" />
                </div>
                <h3 className="text-center text-sm font-semibold text-foreground">Payment History</h3>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer border-none shadow-md transition-shadow hover:shadow-lg"
              onClick={() => router.push("/bill-details")}
            >
              <CardContent className="flex flex-col items-center gap-2 p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
                  <Receipt className="h-7 w-7 text-green-500" />
                </div>
                <h3 className="text-center text-sm font-semibold text-foreground">Bill Details</h3>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer border-none shadow-md transition-shadow hover:shadow-lg"
              onClick={() => router.push("/payment")}
            >
              <CardContent className="flex flex-col items-center gap-2 p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-50">
                  <CreditCard className="h-7 w-7 text-purple-500" />
                </div>
                <h3 className="text-center text-sm font-semibold text-foreground">Quick Pay</h3>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer border-none shadow-md transition-shadow hover:shadow-lg"
              onClick={() => router.push("/usage")}
            >
              <CardContent className="flex flex-col items-center gap-2 p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-50">
                  <TrendingUp className="h-7 w-7 text-orange-500" />
                </div>
                <h3 className="text-center text-sm font-semibold text-foreground">Usage Stats</h3>
              </CardContent>
            </Card>
          </div>

          {/* Info Card */}
          <Card className="border-l-4 border-l-primary border-none bg-blue-50 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">Next Bill Due</h4>
                  <p className="text-sm text-blue-700">15th March 2025</p>
                  <p className="mt-1 text-xs text-blue-600">Set up auto-pay to never miss a payment</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>

        <BottomNav active="home" />
      </div>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <NotificationPanel open={notificationOpen} onClose={() => setNotificationOpen(false)} />
      {/* <InstallPrompt /> */}
    </>
  )
}
