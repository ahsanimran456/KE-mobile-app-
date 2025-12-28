"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { ListTodo } from "lucide-react"

export default function RootPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      // Redirect based on auth state after a brief splash
      const timer = setTimeout(() => {
        if (user) {
          router.push("/todos")
        } else {
          router.push("/login")
        }
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [user, isLoading, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50 p-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 sm:w-80 sm:h-80 bg-orange-400 rounded-full opacity-10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 sm:w-80 sm:h-80 bg-amber-400 rounded-full opacity-10 blur-3xl" />
      </div>

      <div className="relative text-center space-y-6 animate-in fade-in zoom-in duration-700">
        {/* Logo */}
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl blur-xl opacity-30 animate-pulse" />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-2xl shadow-orange-300">
            <ListTodo className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            TaskMaster
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">Organize your life, one task at a time</p>
        </div>

        {/* Loading indicator */}
        <div className="pt-4">
          <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto" />
        </div>
      </div>
    </div>
  )
}
