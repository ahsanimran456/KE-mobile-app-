"use client"

import { ArrowLeft, FileText, Calendar, Zap, DollarSign } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BottomNav } from "@/components/bottom-nav"

export default function BillDetailsPage() {
  const router = useRouter()

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
        <h1 className="text-lg font-bold tracking-wide">Bill Details</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 space-y-4 p-4 pb-24">
        {/* Current Bill Summary */}
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-primary text-primary-foreground">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Current Bill - March 2025
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Bill Amount</span>
              <span className="text-xl font-bold text-primary">PKR 4,250</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Due Date</span>
              <span className="font-semibold">15 March 2025</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Billing Period</span>
              <span className="font-semibold">15 Feb - 15 Mar</span>
            </div>
          </CardContent>
        </Card>

        {/* Usage Breakdown */}
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Usage Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <span>Electricity Units</span>
              </div>
              <span className="font-semibold">425 kWh</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                <span>Rate per Unit</span>
              </div>
              <span className="font-semibold">PKR 10.00</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <span>Service Charges</span>
              </div>
              <span className="font-semibold">PKR 250</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Button */}
        <Button
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          size="lg"
          onClick={() => router.push("/payment")}
        >
          Pay Now
        </Button>
      </main>

      <BottomNav active="home" />
    </div>
  )
}
