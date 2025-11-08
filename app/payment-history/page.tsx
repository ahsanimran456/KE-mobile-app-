"use client"

import { ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BottomNav } from "@/components/bottom-nav"

export default function PaymentHistoryPage() {
  const router = useRouter()

  const payments = [
    { id: 1, date: "15 Feb 2025", amount: "PKR 4,100", status: "paid", method: "Credit Card" },
    { id: 2, date: "15 Jan 2025", amount: "PKR 3,950", status: "paid", method: "Bank Transfer" },
    { id: 3, date: "15 Dec 2024", amount: "PKR 4,300", status: "paid", method: "Credit Card" },
    { id: 4, date: "15 Nov 2024", amount: "PKR 4,200", status: "paid", method: "Debit Card" },
    { id: 5, date: "15 Oct 2024", amount: "PKR 3,850", status: "failed", method: "Credit Card" },
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
        <h1 className="text-lg font-bold tracking-wide">Payment History</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 space-y-4 p-4 pb-24">
        <div className="space-y-3">
          {payments.map((payment) => (
            <Card key={payment.id} className="border-none shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full ${
                        payment.status === "paid" ? "bg-green-50" : "bg-red-50"
                      }`}
                    >
                      {payment.status === "paid" ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{payment.amount}</p>
                      <p className="text-sm text-muted-foreground">{payment.date}</p>
                      <p className="text-xs text-muted-foreground">{payment.method}</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      payment.status === "paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {payment.status.toUpperCase()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <BottomNav active="home" />
    </div>
  )
}
