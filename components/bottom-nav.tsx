"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, CalendarCheck, MessageCircle, BarChart3, User } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect, useCallback } from "react"

const navItems = [
  { icon: Home, label: "Home", href: "/home" },
  { icon: CalendarCheck, label: "Tasks", href: "/tasks" },
  { icon: MessageCircle, label: "AI", href: "/assistant" },
  { icon: BarChart3, label: "Stats", href: "/progress" },
  { icon: User, label: "Profile", href: "/profile" },
]

function BottomNav() {
  const pathname = usePathname()
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const minSwipeDistance = 80

  const getCurrentIndex = useCallback(() => {
    const base = "/" + pathname.split("/")[1]
    return navItems.findIndex(item => item.href === base)
  }, [pathname])

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      setTouchEnd(null)
      setTouchStart(e.targetTouches[0].clientX)
    }

    const onTouchMove = (e: TouchEvent) => {
      setTouchEnd(e.targetTouches[0].clientX)
    }

    const onTouchEnd = () => {
      if (!touchStart || !touchEnd) return
      
      const distance = touchStart - touchEnd
      const isLeftSwipe = distance > minSwipeDistance
      const isRightSwipe = distance < -minSwipeDistance
      
      const currentIndex = getCurrentIndex()
      
      if (isLeftSwipe && currentIndex < navItems.length - 1) {
        window.location.href = navItems[currentIndex + 1].href
      }
      
      if (isRightSwipe && currentIndex > 0) {
        window.location.href = navItems[currentIndex - 1].href
      }

      setTouchStart(null)
      setTouchEnd(null)
    }

    const element = document.body
    element.addEventListener('touchstart', onTouchStart, { passive: true })
    element.addEventListener('touchmove', onTouchMove, { passive: true })
    element.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      element.removeEventListener('touchstart', onTouchStart)
      element.removeEventListener('touchmove', onTouchMove)
      element.removeEventListener('touchend', onTouchEnd)
    }
  }, [touchStart, touchEnd, getCurrentIndex])

  const activeIndex = getCurrentIndex()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="bg-[#0d1117] border-t border-gray-800/80">
        <div className="flex items-center justify-around py-2 px-2">
          {navItems.map((item, index) => {
            const isActive = activeIndex === index
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 py-1.5 px-4"
              >
                <motion.div 
                  whileTap={{ scale: 0.9 }}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    isActive 
                      ? "bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg shadow-teal-500/30" 
                      : "bg-gray-800/60"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500"}`} />
                </motion.div>
                <span className={`text-[10px] font-medium ${isActive ? "text-teal-400" : "text-gray-500"}`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export { BottomNav }
export default BottomNav
