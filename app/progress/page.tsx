"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Clock, Target, Book, Flame, Award, BarChart3, TrendingUp, Trophy, Medal, Zap } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { getWeeklyProgress, getSubjectStats, getUserAchievements, checkAndUnlockAchievements } from "@/lib/firestore"
import { toast } from "sonner"
import BottomNav from "@/components/bottom-nav"

interface SubjectStat {
  subject: string
  hours: number
  minutes: number
}

const allAchievements = [
  { id: "first_task", title: "First Task", icon: Target, gradient: "from-cyan-500 to-blue-500" },
  { id: "streak_7", title: "On Fire!", icon: Flame, gradient: "from-orange-500 to-red-500" },
  { id: "hours_10", title: "Bookworm", icon: Book, gradient: "from-violet-500 to-purple-500" },
  { id: "tasks_10", title: "Starter", icon: Medal, gradient: "from-emerald-500 to-green-500" },
  { id: "tasks_50", title: "Master", icon: Trophy, gradient: "from-amber-500 to-yellow-500" },
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f14]">
        <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0f14] pb-24">
      {/* Header */}
      <div className="px-4 pt-3 pb-2 safe-top">
        <h1 className="text-xl font-bold text-white">Progress</h1>
        <p className="text-gray-500 text-xs">Track your study journey</p>
      </div>

      {/* Stats Grid */}
      <div className="px-4 py-2">
        <div className="grid grid-cols-4 gap-2">
          <div className="p-3 rounded-xl bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-cyan-500/20 text-center shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-1.5 shadow-lg shadow-cyan-500/30">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <p className="text-white font-bold">{Math.round((profile?.totalStudyHours || 0) * 10) / 10}h</p>
            <p className="text-gray-500 text-[10px]">Total</p>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-green-500/20 text-center shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-1.5 shadow-lg shadow-green-500/30">
              <Target className="w-5 h-5 text-white" />
            </div>
            <p className="text-white font-bold">{profile?.tasksCompleted || 0}</p>
            <p className="text-gray-500 text-[10px]">Tasks</p>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-orange-500/20 text-center shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mx-auto mb-1.5 shadow-lg shadow-orange-500/30">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <p className="text-white font-bold">{profile?.streak || 0}</p>
            <p className="text-gray-500 text-[10px]">Streak</p>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-purple-500/20 text-center shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mx-auto mb-1.5 shadow-lg shadow-purple-500/30">
              <Award className="w-5 h-5 text-white" />
            </div>
            <p className="text-white font-bold">{userAchievements.length}</p>
            <p className="text-gray-500 text-[10px]">Badges</p>
          </div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="px-4 py-2">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/40 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="text-white font-semibold">This Week</span>
          </div>
          <div className="flex items-end justify-between gap-2 h-24">
            {weeklyProgress.map((value, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full bg-gray-800 rounded-lg flex-1 flex flex-col-reverse overflow-hidden">
                  <div 
                    className="bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-lg transition-all shadow-[0_0_10px_rgba(0,217,255,0.3)]"
                    style={{ height: `${Math.max(value, 8)}%` }}
                  />
                </div>
                <span className="text-gray-500 text-xs font-medium">{weekDays[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subjects */}
      <div className="px-4 py-2">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center">
            <Book className="w-4 h-4 text-violet-400" />
          </div>
          <h3 className="text-white font-semibold">By Subject</h3>
        </div>
        {subjectStats.length > 0 ? (
          <div className="space-y-2">
            {subjectStats.slice(0, 4).map((item, i) => {
              const maxHours = Math.max(...subjectStats.map(s => s.hours), 10)
              const progress = Math.round((item.hours / maxHours) * 100)
              const colors = [
                "from-cyan-500 to-cyan-400",
                "from-purple-500 to-violet-400",
                "from-amber-500 to-orange-400",
                "from-green-500 to-emerald-400",
              ]
              return (
                <div key={i} className="p-3.5 rounded-xl bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/40 shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colors[i % colors.length]} flex items-center justify-center shadow-md`}>
                        <Book className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-white font-medium">{item.subject}</span>
                    </div>
                    <span className="text-cyan-400 text-sm font-bold">{item.hours}h</span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${colors[i % colors.length]} rounded-full`} style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-6 rounded-xl bg-gray-800/30 border border-gray-700/40 text-center">
            <Book className="w-10 h-10 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No data yet</p>
          </div>
        )}
      </div>

      {/* Achievements */}
      <div className="px-4 py-2">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <h3 className="text-white font-semibold">Achievements</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {allAchievements.map((a) => {
            const unlocked = userAchievements.includes(a.id)
            return (
              <div key={a.id} className={`p-3 rounded-xl text-center transition-all ${
                unlocked 
                  ? "bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-cyan-500/30 shadow-lg" 
                  : "bg-gray-800/20 border border-gray-700/20 opacity-50"
              }`}>
                <div className={`w-10 h-10 rounded-xl mx-auto mb-1.5 flex items-center justify-center ${
                  unlocked 
                    ? `bg-gradient-to-br ${a.gradient} shadow-lg` 
                    : "bg-gray-800"
                }`}>
                  <a.icon className={`w-5 h-5 ${unlocked ? "text-white" : "text-gray-600"}`} />
                </div>
                <p className={`text-xs font-medium ${unlocked ? "text-white" : "text-gray-600"}`}>{a.title}</p>
              </div>
            )
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
