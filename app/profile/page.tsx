"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  User, LogOut, ChevronRight, Bell, 
  Star, Book, Clock, Target, Flame, Award,
  Settings, Pencil, GraduationCap, Calendar
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import BottomNav from "@/components/bottom-nav"

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
      toast.success("Signed out successfully")
      router.push("/welcome")
    } catch (error) {
      toast.error("Failed to sign out")
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f14]">
        <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const displayName = profile?.name || user?.displayName || "Student"
  const email = profile?.email || user?.email || ""

  const menuItems = [
    { icon: Pencil, label: "Edit Profile", href: "/profile/edit", gradient: "from-blue-500 to-cyan-500" },
    { icon: GraduationCap, label: "My Subjects", href: "/profile/subjects", badge: profile?.subjects?.length, gradient: "from-violet-500 to-purple-500" },
    { icon: Target, label: "Study Goals", href: "/profile/goals", badge: profile?.goals?.length, gradient: "from-amber-500 to-orange-500" },
    { icon: Calendar, label: "Study Schedule", href: "/profile/schedule", gradient: "from-emerald-500 to-green-500" },
    { icon: Bell, label: "Notifications", href: "/settings/notifications", gradient: "from-pink-500 to-rose-500" },
  ]

  return (
    <div className="min-h-screen bg-[#0a0f14] pb-20">
      {/* Header */}
      <div className="px-4 pt-3 pb-2 safe-top">
        <h1 className="text-xl font-bold text-white">Profile</h1>
      </div>

      {/* Profile Card */}
      <div className="px-4 py-2">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-cyan-500/20 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-2xl font-bold text-white shadow-xl shadow-cyan-500/30" style={{ width: 72, height: 72 }}>
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white truncate">{displayName}</h2>
              <p className="text-gray-400 text-sm truncate">{email}</p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-yellow-500/20 text-yellow-400 text-xs font-medium">
                  <Star className="w-3 h-3 fill-current" />
                  Level {profile?.level || 1}
                </span>
                <span className="text-cyan-400 text-xs font-bold">{profile?.xp || 0} XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 py-2">
        <div className="grid grid-cols-4 gap-2">
          <div className="p-3 rounded-xl bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/40 text-center shadow-lg">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mx-auto mb-1.5 shadow-md">
              <Book className="w-4 h-4 text-white" />
            </div>
            <p className="text-white font-bold">{profile?.subjects?.length || 0}</p>
            <p className="text-gray-500 text-[10px]">Subjects</p>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/40 text-center shadow-lg">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-1.5 shadow-md">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <p className="text-white font-bold">{profile?.studyHoursPerDay || 0}h</p>
            <p className="text-gray-500 text-[10px]">Daily</p>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/40 text-center shadow-lg">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mx-auto mb-1.5 shadow-md">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <p className="text-white font-bold">{profile?.streak || 0}</p>
            <p className="text-gray-500 text-[10px]">Streak</p>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/40 text-center shadow-lg">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center mx-auto mb-1.5 shadow-md">
              <Award className="w-4 h-4 text-white" />
            </div>
            <p className="text-white font-bold">{profile?.tasksCompleted || 0}</p>
            <p className="text-gray-500 text-[10px]">Done</p>
          </div>
        </div>
      </div>

      {/* XP Progress */}
      <div className="px-4 py-2">
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/40 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs font-medium">Progress to Level {(profile?.level || 1) + 1}</span>
            <span className="text-cyan-400 text-xs font-bold">{(profile?.xp || 0) % 100}/100 XP</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(0,217,255,0.5)]"
              style={{ width: `${((profile?.xp || 0) % 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 py-2">
        <div className="rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/40 overflow-hidden shadow-xl">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => router.push(item.href)}
              className="w-full flex items-center gap-3 p-3.5 hover:bg-gray-700/30 transition-all border-b border-gray-700/30 last:border-0 active:scale-[0.99]"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg`}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <span className="flex-1 text-white text-sm text-left font-medium">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400 text-xs font-bold">
                  {item.badge}
                </span>
              )}
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="px-4 py-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20 active:scale-[0.99] transition-transform shadow-lg"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/30">
            <LogOut className="w-5 h-5 text-white" />
          </div>
          <span className="text-red-400 text-sm font-semibold">Sign Out</span>
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
