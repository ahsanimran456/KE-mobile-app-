"use client"

import { useState } from "react"
import { User, MapPin, Phone, Mail, Settings, Bell, Lock, CreditCard, LogOut } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BottomNav } from "@/components/bottom-nav"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { NotificationPanel } from "@/components/notification-panel"

export default function AccountPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)

  const menuItems = [
    { icon: User, label: "Edit Profile", color: "text-blue-600", bg: "bg-blue-50" },
    { icon: Bell, label: "Notifications", color: "text-purple-600", bg: "bg-purple-50" },
    { icon: Lock, label: "Privacy & Security", color: "text-green-600", bg: "bg-green-50" },
    { icon: CreditCard, label: "Payment Methods", color: "text-orange-600", bg: "bg-orange-50" },
    { icon: Settings, label: "Settings", color: "text-gray-600", bg: "bg-gray-50" },
  ]

  return (
    <>
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header
          title="ACCOUNT"
          onMenuClick={() => setSidebarOpen(true)}
          onNotificationClick={() => setNotificationOpen(true)}
        />

        <main className="flex-1 pb-24">
          <div className="bg-primary px-4 pb-8 pt-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 border-4 border-primary-foreground/20">
                <AvatarFallback className="bg-primary-foreground/10 text-3xl font-bold text-primary-foreground">
                  MA
                </AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-bold text-primary-foreground">Muhammad Ahsan</h2>
              <p className="text-sm text-primary-foreground/80">CSC-23s-289</p>
            </div>
          </div>

          <div className="p-4 space-y-6">
            <Card className="border-none shadow-md -mt-4">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium">+92 300 1234567</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium">m.ahsan@example.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Address</p>
                    <p className="font-medium">Karachi, Pakistan</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <section>
              <h2 className="mb-3 text-lg font-bold">Account Settings</h2>
              <div className="space-y-2">
                {menuItems.map((item, index) => (
                  <Card key={index} className="border-none shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${item.bg}`}>
                        <item.icon className={`h-5 w-5 ${item.color}`} />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <Card className="border-none shadow-md cursor-pointer bg-red-50 hover:shadow-lg transition-shadow">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <LogOut className="h-5 w-5 text-red-600" />
                </div>
                <span className="font-medium text-red-600">Log Out</span>
              </CardContent>
            </Card>
          </div>
        </main>

        <BottomNav active="account" />
      </div>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <NotificationPanel open={notificationOpen} onClose={() => setNotificationOpen(false)} />
    </>
  )
}
