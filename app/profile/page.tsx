"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  LogOut, ChevronRight, Bell, 
  Star, Book, Clock, Flame, Award,
  Pencil, GraduationCap, Calendar
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import BottomNav from "@/components/bottom-nav"
import Loading from "@/components/loading"

export default function ProfilePage() {
  const router = useRouter()
  const { user, profile, logout, loading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, authLoading, router])

  const handleLogout = async () => {
    try {
      await logout()
      toast.success("Signed out")
      router.push("/welcome")
    } catch (error) {
      toast.error("Failed")
    }
  }

  if (authLoading) {
    return <Loading />
  }

  const displayName = profile?.name || user?.displayName || "Student"
  const email = profile?.email || user?.email || ""

  const menuItems = [
    { icon: Pencil, label: "Edit Profile", href: "/profile/edit", gradient: "from-blue-500 to-cyan-500" },
    { icon: GraduationCap, label: "My Subjects", href: "/profile/subjects", badge: profile?.subjects?.length, gradient: "from-violet-500 to-purple-500" },
    { icon: Calendar, label: "Study Goals", href: "/profile/goals", badge: profile?.goals?.length, gradient: "from-amber-500 to-orange-500" },
    { icon: Clock, label: "Schedule", href: "/profile/schedule", gradient: "from-emerald-500 to-green-500" },
    { icon: Bell, label: "Notifications", href: "/settings/notifications", gradient: "from-pink-500 to-rose-500" },
  ]

  const stats = [
    { icon: Book, value: profile?.subjects?.length || 0, label: "Subjects", gradient: "from-teal-500 to-cyan-500" },
    { icon: Clock, value: `${profile?.studyHoursPerDay || 0}h`, label: "Daily", gradient: "from-green-500 to-emerald-500" },
    { icon: Flame, value: profile?.streak || 0, label: "Streak", gradient: "from-orange-500 to-red-500" },
    { icon: Award, value: profile?.tasksCompleted || 0, label: "Done", gradient: "from-purple-500 to-violet-500" },
  ]

  return (
    <div className="min-h-screen bg-[#0a0f14] pb-16 pt-2">
      {/* Header */}
      <div className="px-3 py-1">
        <h1 className="text-lg font-bold text-white">Profile</h1>
      </div>

      {/* Profile Card */}
      <div className="px-3 py-1.5">
        <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border border-teal-500/20">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-teal-500/30">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-white truncate">{displayName}</h2>
              <p className="text-gray-400 text-xs truncate">{email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 text-[10px] font-medium">
                  <Star className="w-2.5 h-2.5 fill-current" />
                  Lvl {profile?.level || 1}
                </span>
                <span className="text-teal-400 text-[10px] font-bold">{profile?.xp || 0} XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-3 py-1">
        <div className="grid grid-cols-4 gap-1.5">
          {stats.map((stat, i) => (
            <div key={i} className="p-2 rounded-lg bg-gray-800/60 border border-gray-700/40 text-center">
              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center mx-auto mb-1`}>
                <stat.icon className="w-3.5 h-3.5 text-white" />
              </div>
              <p className="text-white font-bold text-xs">{stat.value}</p>
              <p className="text-gray-500 text-[8px]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* XP Progress */}
      <div className="px-3 py-1">
        <div className="p-2.5 rounded-lg bg-gray-800/60 border border-gray-700/40">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-gray-400 text-[10px]">To Level {(profile?.level || 1) + 1}</span>
            <span className="text-teal-400 text-[10px] font-bold">{(profile?.xp || 0) % 100}/100 XP</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full"
              style={{ width: `${((profile?.xp || 0) % 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-3 py-1">
        <div className="rounded-xl bg-gray-800/50 border border-gray-700/40 overflow-hidden">
          {menuItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <motion.div
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2.5 p-2.5 border-b border-gray-700/30 last:border-0"
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                  <item.icon className="w-4 h-4 text-white" />
                </div>
                <span className="flex-1 text-white text-xs font-medium">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-400 text-[10px] font-bold">
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="px-3 py-1">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
            <LogOut className="w-4 h-4 text-white" />
          </div>
          <span className="text-red-400 text-xs font-semibold">Sign Out</span>
        </motion.button>
      </div>

      <BottomNav />
    </div>
  )
}
