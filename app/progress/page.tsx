"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Clock, Target, Book, Flame, Award, TrendingUp, Trophy, Medal } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { getWeeklyProgress, getSubjectStats, getUserAchievements, checkAndUnlockAchievements } from "@/lib/firestore"
import { toast } from "sonner"
import BottomNav from "@/components/bottom-nav"
import Loading from "@/components/loading"

interface SubjectStat {
  subject: string
  hours: number
  minutes: number
}

const allAchievements = [
  { id: "first_task", title: "First", icon: Target, gradient: "from-teal-500 to-cyan-500" },
  { id: "streak_7", title: "Fire!", icon: Flame, gradient: "from-orange-500 to-red-500" },
  { id: "hours_10", title: "Book", icon: Book, gradient: "from-violet-500 to-purple-500" },
  { id: "tasks_10", title: "Start", icon: Medal, gradient: "from-emerald-500 to-green-500" },
  { id: "tasks_50", title: "Pro", icon: Trophy, gradient: "from-amber-500 to-yellow-500" },
  { id: "tasks_100", title: "Legend", icon: Award, gradient: "from-pink-500 to-rose-500" },
]

export default function ProgressPage() {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [weeklyProgress, setWeeklyProgress] = useState<number[]>([0, 0, 0, 0, 0, 0, 0])
  const [subjectStats, setSubjectStats] = useState<SubjectStat[]>([])
  const [userAchievements, setUserAchievements] = useState<string[]>([])

  const weekDays = ["M", "T", "W", "T", "F", "S", "S"]

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
      return
    }
    if (user) loadData()
  }, [user, authLoading, router])

  const loadData = async () => {
    if (!user) return
    setLoading(true)
    try {
      const [progress, stats, newAchievements, achievements] = await Promise.all([
        getWeeklyProgress(user.uid),
        getSubjectStats(user.uid),
        checkAndUnlockAchievements(user.uid),
        getUserAchievements(user.uid),
      ])
      setWeeklyProgress(progress)
      setSubjectStats(stats)
      setUserAchievements(achievements)
      
      if (newAchievements.length > 0) {
        newAchievements.forEach(a => toast.success(`🎉 ${a.title}`))
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return <Loading />
  }

  const stats = [
    { icon: Clock, value: `${Math.round((profile?.totalStudyHours || 0) * 10) / 10}h`, label: "Total", gradient: "from-teal-500 to-cyan-600" },
    { icon: Target, value: profile?.tasksCompleted || 0, label: "Tasks", gradient: "from-green-500 to-emerald-600" },
    { icon: Flame, value: profile?.streak || 0, label: "Streak", gradient: "from-orange-500 to-red-600" },
    { icon: Award, value: userAchievements.length, label: "Badges", gradient: "from-purple-500 to-violet-600" },
  ]

  return (
    <div className="min-h-screen bg-[#0a0f14] pb-16 pt-2">
      {/* Header */}
      <div className="px-3 py-1">
        <h1 className="text-lg font-bold text-white">Progress</h1>
        <p className="text-gray-500 text-[10px]">Track your journey</p>
      </div>

      {/* Stats Grid */}
      <div className="px-3 py-1.5">
        <div className="grid grid-cols-4 gap-1.5">
          {stats.map((stat, i) => (
            <div key={i} className="p-2 rounded-lg bg-gray-800/60 border border-gray-700/40 text-center">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center mx-auto mb-1`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
              <p className="text-white font-bold text-sm">{stat.value}</p>
              <p className="text-gray-500 text-[9px]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="px-3 py-1.5">
        <div className="p-2.5 rounded-xl bg-gray-800/60 border border-gray-700/40">
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingUp className="w-4 h-4 text-teal-400" />
            <span className="text-white font-medium text-sm">This Week</span>
          </div>
          <div className="flex items-end justify-between gap-1.5 h-16">
            {weeklyProgress.map((value, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-gray-800 rounded flex-1 flex flex-col-reverse overflow-hidden">
                  <div 
                    className="bg-gradient-to-t from-teal-500 to-teal-400 rounded"
                    style={{ height: `${Math.max(value, 8)}%` }}
                  />
                </div>
                <span className="text-gray-500 text-[9px]">{weekDays[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subjects */}
      <div className="px-3 py-1">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Book className="w-4 h-4 text-violet-400" />
          <h3 className="text-white font-medium text-sm">By Subject</h3>
        </div>
        {subjectStats.length > 0 ? (
          <div className="space-y-1.5">
            {subjectStats.slice(0, 3).map((item, i) => {
              const maxHours = Math.max(...subjectStats.map(s => s.hours), 10)
              const progress = Math.round((item.hours / maxHours) * 100)
              const colors = ["from-teal-500 to-teal-400", "from-purple-500 to-violet-400", "from-amber-500 to-orange-400"]
              return (
                <div key={i} className="p-2 rounded-lg bg-gray-800/60 border border-gray-700/40">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-xs font-medium">{item.subject}</span>
                    <span className="text-teal-400 text-[10px] font-bold">{item.hours}h</span>
                  </div>
                  <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${colors[i % colors.length]} rounded-full`} style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-gray-800/30 text-center">
            <p className="text-gray-500 text-xs">No data yet</p>
          </div>
        )}
      </div>

      {/* Achievements */}
      <div className="px-3 py-1">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Trophy className="w-4 h-4 text-amber-400" />
          <h3 className="text-white font-medium text-sm">Achievements</h3>
        </div>
        <div className="grid grid-cols-6 gap-1.5">
          {allAchievements.map((a) => {
            const unlocked = userAchievements.includes(a.id)
            return (
              <div
                key={a.id}
                className={`p-1.5 rounded-lg text-center ${
                  unlocked 
                    ? "bg-gray-800/60 border border-teal-500/30" 
                    : "bg-gray-800/20 border border-gray-700/20 opacity-40"
                }`}
              >
                <div className={`w-7 h-7 rounded-lg mx-auto mb-0.5 flex items-center justify-center ${
                  unlocked ? `bg-gradient-to-br ${a.gradient}` : "bg-gray-800"
                }`}>
                  <a.icon className={`w-3.5 h-3.5 ${unlocked ? "text-white" : "text-gray-600"}`} />
                </div>
                <p className={`text-[8px] font-medium ${unlocked ? "text-white" : "text-gray-600"}`}>{a.title}</p>
              </div>
            )
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
