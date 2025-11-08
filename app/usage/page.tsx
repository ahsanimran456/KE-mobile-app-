"use client"

import { ArrowLeft, TrendingUp, TrendingDown, Activity } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BottomNav } from "@/components/bottom-nav"

export default function UsagePage() {
  const router = useRouter()

  const monthlyUsage = [
    { month: "March 2025", usage: 425, cost: 4250, trend: "up" },
    { month: "February 2025", usage: 410, cost: 4100, trend: "down" },
    { month: "January 2025", usage: 395, cost: 3950, trend: "up" },
    { month: "December 2024", usage: 430, cost: 4300, trend: "up" },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center gap-4 bg-primary px-4 py-3 text-primary-foreground shadow-md">
        <Button
          variant="ghost"
          size="icon"
          className="text-primary-foreground hover:bg-primary-foreground/10"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-lg font-bold tracking-wide">Usage Statistics</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 space-y-4 p-4 pb-24">
        {/* Current Month Summary */}
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-primary text-primary-foreground">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Current Month Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 p-4">
            <div>
              <p className="text-sm text-muted-foreground">Units Consumed</p>
              <p className="text-2xl font-bold text-primary">425 kWh</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Cost</p>
              <p className="text-2xl font-bold text-primary">PKR 4,250</p>
            </div>
          </CardContent>
        </Card>

        {/* Monthly History */}
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Usage History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {monthlyUsage.map((item, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-semibold">{item.month}</p>
                  <p className="text-sm text-muted-foreground">{item.usage} kWh</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">PKR {item.cost}</span>
                  {item.trend === "up" ? (
                    <TrendingUp className="h-5 w-5 text-red-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-green-500" />
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="border-l-4 border-l-primary border-none bg-blue-50 shadow-md">
          <CardContent className="p-4">
            <h4 className="font-semibold text-blue-900">Energy Saving Tip</h4>
            <p className="mt-1 text-sm text-blue-700">
              Switch to LED bulbs and unplug devices when not in use to reduce consumption by up to 20%
            </p>
          </CardContent>
        </Card>
      </main>

      <BottomNav active="home" />
    </div>
  )
}
