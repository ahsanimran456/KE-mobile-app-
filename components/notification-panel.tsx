"use client"

import { X, DollarSign, AlertCircle, CheckCircle, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect } from "react"

interface NotificationPanelProps {
  open: boolean
  onClose: () => void
}

const notifications = [
  {
    id: 1,
    type: "payment",
    title: "Payment Due Soon",
    message: "Your bill of PKR 4,250 is due on 15th March",
    time: "2 hours ago",
    icon: DollarSign,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    id: 2,
    type: "success",
    title: "Payment Successful",
    message: "Your January bill payment was successful",
    time: "2 days ago",
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    id: 3,
    type: "offer",
    title: "Special Offer",
    message: "Pay early and get 2% discount on your bill",
    time: "3 days ago",
    icon: Gift,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    id: 4,
    type: "alert",
    title: "High Usage Alert",
    message: "Your consumption is 15% higher this month",
    time: "5 days ago",
    icon: AlertCircle,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
]

export function NotificationPanel({ open, onClose }: NotificationPanelProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [open])

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      <div className="fixed right-0 top-0 bottom-0 z-[70] w-96 bg-card shadow-2xl animate-in slide-in-from-right">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="text-lg font-bold">Notifications</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {notifications.map((notification) => (
                <Card key={notification.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${notification.bg}`}
                      >
                        <notification.icon className={`h-5 w-5 ${notification.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{notification.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="border-t border-border p-4">
            <Button variant="outline" className="w-full bg-transparent" onClick={onClose}>
              Mark All as Read
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
