"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Bell, Zap, Target, Clock, Book, 
  Sparkles, Play, Brain, FileText, PenTool, ChevronRight,
  Flame, Star, GraduationCap, BookOpen, Lightbulb
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { getTasks, getDailyProgress, getTodayStudyTime, updateStreak } from "@/lib/firestore"
import BottomNav from "@/components/bottom-nav"
import { Task } from "@/lib/firestore"

const quickTools = [
  { icon: Brain, label: "Summary", desc: "Summarize topics", gradient: "from-violet-500 to-purple-600" },
  { icon: FileText, label: "Essay", desc: "Write essays", gradient: "from-cyan-500 to-blue-600" },
  { icon: Lightbulb, label: "Explain", desc: "Get answers", gradient: "from-amber-500 to-orange-600" },
]

export default function HomePage() {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [dailyProgress, setDailyProgress] = useState({ completed: 0, total: 0, percentage: 0 })
  const [studiedMinutes, setStudiedMinutes] = useState(0)
  const [loading, setLoading] = useState(true)

  const today = new Date().toISOString().split("T")[0]

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
      const [todayTasks, progress, minutes] = await Promise.all([
        getTasks(user.uid, today),
        getDailyProgress(user.uid, today),
        getTodayStudyTime(user.uid),
      ])
      setTasks(todayTasks)
      setDailyProgress(progress)
      setStudiedMinutes(minutes)
      await updateStreak(user.uid)
    } catch (error) {
      console.error("Error loading data:", error)
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

  const displayName = profile?.name || user?.displayName || "Student"
  const firstName = displayName.split(" ")[0]
  const studyGoal = profile?.studyHoursPerDay || 3
  const studyGoalMinutes = studyGoal * 60
  const energyPercent = Math.min(100, Math.round((studiedMinutes / studyGoalMinutes) * 100))

  return (
    <div className="min-h-screen bg-[#0a0f14] pb-20">
      {/* Header */}
      <div className="px-4 pt-3 pb-2 safe-top flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-xs">Welcome Back 👋</p>
          <h1 className="text-lg font-bold text-white">{firstName}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => router.push("/settings/notifications")}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 flex items-center justify-center text-gray-400 relative shadow-lg"
          >
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_6px_rgba(0,217,255,0.8)]" />
          </button>
          <button 
            onClick={() => router.push("/profile")}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-cyan-500/30"
          >
            {firstName.charAt(0)}
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="px-4 py-2">
        <div className="flex gap-3">
          {/* Progress Card */}
          <div className="flex-1 p-3.5 rounded-2xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/40 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14">
                <svg className="w-14 h-14 -rotate-90">
                  <circle cx="28" cy="28" r="24" fill="none" stroke="#1f2937" strokeWidth="5" />
                  <circle cx="28" cy="28" r="24" fill="none" stroke="url(#cyanGradient)" strokeWidth="5" strokeLinecap="round"
                    strokeDasharray={`${dailyProgress.percentage * 1.51} 151`}
                    className="drop-shadow-[0_0_6px_rgba(0,217,255,0.6)]" />
                </svg>
                <svg width="0" height="0"><defs><linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#00D9FF"/><stop offset="100%" stopColor="#00A8CC"/></linearGradient></defs></svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Target className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <p className="text-white font-bold text-xl">{dailyProgress.percentage}%</p>
                <p className="text-gray-500 text-xs">{dailyProgress.completed}/{dailyProgress.total} Tasks</p>
              </div>
            </div>
          </div>

          {/* Study Time Card */}
          <div className="flex-1 p-3.5 rounded-2xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/40 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14">
                <svg className="w-14 h-14 -rotate-90">
                  <circle cx="28" cy="28" r="24" fill="none" stroke="#1f2937" strokeWidth="5" />
                  <circle cx="28" cy="28" r="24" fill="none" stroke="url(#greenGradient)" strokeWidth="5" strokeLinecap="round"
                    strokeDasharray={`${energyPercent * 1.51} 151`}
                    className="drop-shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
                </svg>
                <svg width="0" height="0"><defs><linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#22c55e"/><stop offset="100%" stopColor="#16a34a"/></linearGradient></defs></svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-green-400" />
                </div>
              </div>
              <div>
                <p className="text-white font-bold text-xl">{Math.round(studiedMinutes / 60 * 10) / 10}h</p>
                <p className="text-gray-500 text-xs">of {studyGoal}h goal</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Streak & Level */}
      <div className="px-4 py-2">
        <div className="flex gap-2">
          <div className="flex-1 p-3 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">{profile?.streak || 0} Days</p>
              <p className="text-gray-500 text-[10px]">Streak</p>
            </div>
          </div>
          <div className="flex-1 p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-500/20 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Star className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Lvl {profile?.level || 1}</p>
              <p className="text-gray-500 text-[10px]">{profile?.xp || 0} XP</p>
            </div>
          </div>
          <div className="flex-1 p-3 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">{profile?.subjects?.length || 0}</p>
              <p className="text-gray-500 text-[10px]">Subjects</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action */}
      <div className="px-4 py-2">
        <button 
          onClick={() => router.push("/assistant")}
          className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500/15 to-purple-500/15 border border-cyan-500/30 flex items-center gap-3 shadow-lg"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/40">
            <Play className="w-5 h-5 text-white ml-0.5" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-white font-semibold">Start Learning</p>
            <p className="text-gray-400 text-xs">Chat with AI Assistant</p>
          </div>
          <ChevronRight className="w-5 h-5 text-cyan-400" />
        </button>
      </div>

      {/* AI Tools */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-semibold">AI Tools</h2>
          <button onClick={() => router.push("/assistant")} className="text-cyan-400 text-xs font-medium">See all</button>
        </div>
        <div className="flex gap-2.5">
          {quickTools.map((tool, i) => (
            <button key={i} onClick={() => router.push("/assistant")}
              className="flex-1 p-3 rounded-xl bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/40 flex flex-col items-center gap-2 shadow-lg hover:border-gray-600/60 transition-all">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center shadow-lg`}>
                <tool.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-center">
                <p className="text-white text-xs font-medium">{tool.label}</p>
                <p className="text-gray-500 text-[10px]">{tool.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Today's Tasks */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-semibold">Today&apos;s Tasks</h2>
          <button onClick={() => router.push("/tasks")} className="text-cyan-400 text-xs font-medium">View all</button>
        </div>
        
        {tasks.length > 0 ? (
          <div className="space-y-2">
            {tasks.slice(0, 3).map((task) => (
              <div key={task.id} onClick={() => task.hasLecture && task.id && router.push(`/tasks/${task.id}`)}
                className={`p-3 rounded-xl border flex items-center gap-3 shadow-lg ${
                  task.completed ? "bg-gray-800/30 border-gray-700/30" : "bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700/40"
                } ${task.hasLecture ? "cursor-pointer active:scale-[0.98] transition-transform" : ""}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
                  task.completed 
                    ? "bg-gradient-to-br from-green-500 to-emerald-600" 
                    : "bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border border-cyan-500/30"
                }`}>
                  {task.completed ? (
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm truncate ${task.completed ? "text-gray-500 line-through" : "text-white"}`}>
                    {task.title}
                  </p>
                  <p className="text-gray-500 text-xs">{task.subject} • {task.duration}min</p>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <p className="text-gray-500 text-xs">{task.time}</p>
                  {task.hasLecture && !task.completed && (
                    <div className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-[10px] font-medium">📖 Lecture</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <button onClick={() => router.push("/generate-plan")}
            className="w-full p-5 rounded-xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-dashed border-gray-700 text-center hover:border-cyan-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-2">
              <Sparkles className="w-6 h-6 text-cyan-400" />
            </div>
            <p className="text-gray-400 text-sm font-medium">Generate AI Study Plan</p>
            <p className="text-gray-600 text-xs mt-0.5">Tap to create personalized tasks</p>
          </button>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
