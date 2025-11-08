"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, Wallet, Building2, Smartphone, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sidebar } from "@/components/sidebar"
import { NotificationPanel } from "@/components/notification-panel"

export default function PaymentPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<string>("")
  const router = useRouter()

  const paymentMethods = [
    { id: "card", label: "Credit/Debit Card", icon: CreditCard, color: "text-blue-600", bg: "bg-blue-50" },
    { id: "wallet", label: "Digital Wallet", icon: Wallet, color: "text-green-600", bg: "bg-green-50" },
    { id: "bank", label: "Bank Transfer", icon: Building2, color: "text-purple-600", bg: "bg-purple-50" },
    { id: "mobile", label: "Mobile Banking", icon: Smartphone, color: "text-orange-600", bg: "bg-orange-50" },
  ]

  return (
    <>
      <div className="flex min-h-screen flex-col bg-gray-50">
        <header className="sticky top-0 z-50 flex items-center gap-3 bg-primary px-4 py-3 text-primary-foreground shadow-md">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-bold tracking-wide">PAYMENT</h1>
        </header>

        <main className="flex-1 p-4 space-y-6">
          <Card className="border-none shadow-lg bg-gradient-to-br from-primary to-orange-400">
            <CardContent className="p-6 text-primary-foreground text-center">
              <p className="text-sm text-primary-foreground/80">Amount to Pay</p>
              <p className="text-4xl font-bold my-2">PKR 4,250</p>
              <p className="text-sm text-primary-foreground/80">Due Date: 15 March 2025</p>
            </CardContent>
          </Card>

          <section>
            <h2 className="mb-3 text-lg font-bold">Select Payment Method</h2>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <Card
                  key={method.id}
                  className={`border-2 cursor-pointer transition-all ${
                    selectedMethod === method.id
                      ? "border-primary shadow-md"
                      : "border-transparent shadow-sm hover:shadow-md"
                  }`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${method.bg}`}>
                      <method.icon className={`h-6 w-6 ${method.color}`} />
                    </div>
                    <span className="font-medium">{method.label}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {selectedMethod === "card" && (
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-base">Card Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Card Number</Label>
                  <Input placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Expiry Date</Label>
                    <Input placeholder="MM/YY" />
                  </div>
                  <div>
                    <Label>CVV</Label>
                    <Input placeholder="123" type="password" maxLength={3} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
            Pay PKR 4,250
          </Button>
        </main>
      </div>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <NotificationPanel open={notificationOpen} onClose={() => setNotificationOpen(false)} />
    </>
  )
}
