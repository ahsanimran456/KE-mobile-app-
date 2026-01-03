"use client"

import { usePathname, useRouter } from "next/navigation"
import { Home, CalendarCheck, MessageCircle, BarChart3, User } from "lucide-react"

const navItems = [
  { icon: Home, label: "Home", href: "/home" },
  { icon: CalendarCheck, label: "Tasks", href: "/tasks" },
  { icon: MessageCircle, label: "AI", href: "/assistant" },
  { icon: BarChart3, label: "Stats", href: "/progress" },
  { icon: User, label: "Profile", href: "/profile" },
]

export default function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-gradient-to-t from-[#0a0f14] via-[#0d1218] to-[#0d1218]/95 backdrop-blur-xl border-t border-gray-800/50 safe-bottom">
        <div className="flex items-center justify-around py-2 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all active:scale-95 ${
                  isActive ? "text-cyan-400" : "text-gray-500"
                }`}
              >
                <div className="relative">
                  {isActive && (
                    <div className="absolute -inset-2 bg-cyan-500/20 rounded-xl blur-md" />
                  )}
                  <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    isActive 
                      ? "bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg shadow-cyan-500/40" 
                      : "bg-gray-800/50"
                  }`}>
                    <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500"}`} />
                  </div>
                </div>
                <span className={`text-[10px] font-medium ${isActive ? "text-cyan-400" : "text-gray-500"}`}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
