"use client"

import { useState } from "react"
import { Calendar, Download, TrendingDown, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BottomNav } from "@/components/bottom-nav"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { NotificationPanel } from "@/components/notification-panel"

const bills = [
  {
    month: "February 2025",
    amount: 4250,
    dueDate: "15 Mar 2025",
    status: "pending",
    units: 385,
  },
  {
    month: "January 2025",
    amount: 3890,
    dueDate: "15 Feb 2025",
    status: "paid",
    units: 362,
  },
  {
    month: "December 2024",
    amount: 4120,
    dueDate: "15 Jan 2025",
    status: "paid",
    units: 378,
  },
]

export default function BillingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)

  return (
    <>
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header
          title="MY BILLING"
          onMenuClick={() => setSidebarOpen(true)}
          onNotificationClick={() => setNotificationOpen(true)}
        />

        <main className="flex-1 p-4 pb-24 space-y-4">
          <Card className="border-none shadow-lg bg-gradient-to-br from-primary to-orange-400">
            <CardContent className="p-6 text-primary-foreground">
              <p className="text-sm text-primary-foreground/80">Current Bill</p>
              <p className="text-3xl font-bold">PKR 4,250</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Due: 15 Mar 2025</span>
                </div>
                <Button variant="secondary" size="sm">
                  Pay Now
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="border-none shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-green-600">
                  <TrendingDown className="h-5 w-5" />
                  <span className="text-sm font-medium">Avg. Bill</span>
                </div>
                <p className="mt-2 text-2xl font-bold">PKR 4,087</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-blue-600">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-sm font-medium">This Month</span>
                </div>
                <p className="mt-2 text-2xl font-bold">385 kWh</p>
              </CardContent>
            </Card>
          </div>

          <section>
            <h2 className="mb-3 text-lg font-bold">Billing History</h2>
            <div className="space-y-3">
              {bills.map((bill, index) => (
                <Card key={index} className="border-none shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{bill.month}</CardTitle>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          bill.status === "paid" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {bill.status.toUpperCase()}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-primary">PKR {bill.amount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{bill.units} kWh used</p>
                        <p className="text-xs text-muted-foreground mt-1">Due: {bill.dueDate}</p>
                      </div>
                      <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </main>

        <BottomNav active="billing" />
      </div>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <NotificationPanel open={notificationOpen} onClose={() => setNotificationOpen(false)} />
    </>
  )
}
