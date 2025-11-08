"use client"

import { useRouter } from "next/navigation"
import { Home, Compass, Zap, FileText, User } from "lucide-react"

interface BottomNavProps {
  active: "home" | "discover" | "quick" | "billing" | "account"
}

export function BottomNav({ active }: BottomNavProps) {
  const router = useRouter()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card shadow-lg">
      <div className="flex items-end justify-around px-2 py-2">
        <button
          onClick={() => router.push("/home")}
          className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
            active === "home" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs font-medium">Home</span>
        </button>

        <button
          onClick={() => router.push("/discover")}
          className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
            active === "discover" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Compass className="h-6 w-6" />
          <span className="text-xs font-medium">Discover</span>
        </button>

        <button
          onClick={() => router.push("/payment")}
          className="relative -mt-8 rounded-full bg-primary p-4 text-primary-foreground shadow-xl transition-transform hover:scale-105"
        >
          <Zap className="h-7 w-7" />
        </button>

        <button
          onClick={() => router.push("/billing")}
          className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
            active === "billing" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <FileText className="h-6 w-6" />
          <span className="text-xs font-medium">Billing</span>
        </button>

        <button
          onClick={() => router.push("/account")}
          className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
            active === "account" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <User className="h-6 w-6" />
          <span className="text-xs font-medium">Account</span>
        </button>
      </div>
    </nav>
  )
}
