"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Bell, Zap, Target, 
  Sparkles, Play, Brain, FileText, ChevronRight,
  Flame, Star, GraduationCap, BookOpen, Lightbulb
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { getTasks, getDailyProgress, getTodayStudyTime, updateStreak } from "@/lib/firestore"
import BottomNav from "@/components/bottom-nav"
import Loading from "@/components/loading"
import { Task } from "@/lib/firestore"
import Link from "next/link"

const quickTools = [
  { icon: Brain, label: "Summary", gradient: "from-violet-500 to-purple-600" },
  { icon: FileText, label: "Essay", gradient: "from-teal-500 to-cyan-600" },
  { icon: Lightbulb, label: "Explain", gradient: "from-amber-500 to-orange-600" },
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
    return <Loading />
  }

  const displayName = profile?.name || user?.displayName || "Student"
  const firstName = displayName.split(" ")[0]
  const studyGoal = profile?.studyHoursPerDay || 3
  const studyGoalMinutes = studyGoal * 60
  const energyPercent = Math.min(100, Math.round((studiedMinutes / studyGoalMinutes) * 100))

  return (
    <div className="min-h-screen bg-[#0a0f14] pb-20 pt-2">
      {/* Header - Compact */}
      <div className="px-3 py-1 flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-[10px]">Welcome Back 👋</p>
          <h1 className="text-base font-bold text-white">{firstName}</h1>
        </div>
        <div className="flex items-center gap-1.5">
          <Link href="/settings/notifications">
            <motion.div 
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 rounded-lg bg-gray-800/80 border border-gray-700/50 flex items-center justify-center text-gray-400 relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-teal-400 rounded-full" />
            </motion.div>
          </Link>
          <Link href="/profile">
            <motion.div 
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-teal-500/30"
            >
              {firstName.charAt(0)}
            </motion.div>
          </Link>
        </div>
      </div>

      {/* Stats Row - Compact */}
      <div className="px-3 py-1.5">
        <div className="flex gap-2">
          {/* Progress Card */}
          <div className="flex-1 p-2.5 rounded-xl bg-gray-800/60 border border-gray-700/40">
            <div className="flex items-center gap-2">
              <div className="relative w-11 h-11">
                <svg className="w-11 h-11 -rotate-90">
                  <circle cx="22" cy="22" r="18" fill="none" stroke="#1f2937" strokeWidth="4" />
                  <circle 
                    cx="22" cy="22" r="18" fill="none" stroke="#14b8a6" strokeWidth="4" strokeLinecap="round"
                    strokeDasharray={`${dailyProgress.percentage * 1.13} 113`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Target className="w-4 h-4 text-teal-400" />
                </div>
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-none">{dailyProgress.percentage}%</p>
                <p className="text-gray-500 text-[10px]">{dailyProgress.completed}/{dailyProgress.total} Tasks</p>
              </div>
            </div>
          </div>

          {/* Study Time Card */}
          <div className="flex-1 p-2.5 rounded-xl bg-gray-800/60 border border-gray-700/40">
            <div className="flex items-center gap-2">
              <div className="relative w-11 h-11">
                <svg className="w-11 h-11 -rotate-90">
                  <circle cx="22" cy="22" r="18" fill="none" stroke="#1f2937" strokeWidth="4" />
                  <circle 
                    cx="22" cy="22" r="18" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round"
                    strokeDasharray={`${energyPercent * 1.13} 113`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-green-400" />
                </div>
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-none">{Math.round(studiedMinutes / 60 * 10) / 10}h</p>
                <p className="text-gray-500 text-[10px]">of {studyGoal}h goal</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Streak & Level - Compact Row */}
      <div className="px-3 py-1">
        <div className="flex gap-1.5">
          <div className="flex-1 py-2 px-2.5 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Flame className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-xs leading-none">{profile?.streak || 0} Days</p>
              <p className="text-gray-500 text-[9px]">Streak</p>
            </div>
          </div>
          <div className="flex-1 py-2 px-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
              <Star className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-xs leading-none">Lvl {profile?.level || 1}</p>
              <p className="text-gray-500 text-[9px]">{profile?.xp || 0} XP</p>
            </div>
          </div>
          <div className="flex-1 py-2 px-2.5 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-xs leading-none">{profile?.subjects?.length || 0}</p>
              <p className="text-gray-500 text-[9px]">Subjects</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action - Compact */}
      <div className="px-3 py-1.5">
        <Link href="/assistant">
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="p-2.5 rounded-xl bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/30 flex items-center gap-2.5"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-md shadow-teal-500/30">
              <Play className="w-4 h-4 text-white ml-0.5" />
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">Start Learning</p>
              <p className="text-gray-400 text-[10px]">Chat with AI Assistant</p>
            </div>
            <ChevronRight className="w-4 h-4 text-teal-400" />
          </motion.div>
        </Link>
      </div>

      {/* AI Tools - Compact */}
      <div className="px-3 py-1">
        <div className="flex items-center justify-between mb-1.5">
          <h2 className="text-white font-semibold text-sm">AI Tools</h2>
          <Link href="/assistant" className="text-teal-400 text-[10px] font-medium">See all</Link>
        </div>
        <div className="flex gap-2">
          {quickTools.map((tool, i) => (
            <Link key={i} href="/assistant" className="flex-1">
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-lg bg-gray-800/60 border border-gray-700/40 flex flex-col items-center gap-1.5"
              >
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${tool.gradient} flex items-center justify-center`}>
                  <tool.icon className="w-4 h-4 text-white" />
                </div>
                <p className="text-white text-[10px] font-medium">{tool.label}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* Today's Tasks - Compact */}
      <div className="px-3 py-1">
        <div className="flex items-center justify-between mb-1.5">
          <h2 className="text-white font-semibold text-sm">Today&apos;s Tasks</h2>
          <Link href="/tasks" className="text-teal-400 text-[10px] font-medium">View all</Link>
        </div>
        
        {tasks.length > 0 ? (
          <div className="space-y-1.5">
            {tasks.slice(0, 3).map((task) => (
              <motion.div 
                key={task.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => task.hasLecture && task.id && router.push(`/tasks/${task.id}`)}
                className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${
                  task.completed ? "bg-gray-800/30 border-gray-700/30" : "bg-gray-800/60 border-gray-700/40"
                } ${task.hasLecture ? "cursor-pointer" : ""}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  task.completed 
                    ? "bg-gradient-to-br from-green-500 to-emerald-600" 
                    : "bg-teal-500/20 border border-teal-500/30"
                }`}>
                  {task.completed ? (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-xs truncate ${task.completed ? "text-gray-500 line-through" : "text-white"}`}>
                    {task.title}
                  </p>
                  <p className="text-gray-500 text-[10px]">{task.subject} • {task.duration}min</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-[10px]">{task.time}</p>
                  {task.hasLecture && !task.completed && (
                    <span className="text-teal-400 text-[9px]">📖</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <Link href="/generate-plan">
            <motion.div
              whileTap={{ scale: 0.98 }}
              className="p-4 rounded-lg bg-gray-800/40 border border-dashed border-gray-700 text-center"
            >
              <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center mx-auto mb-1.5">
                <Sparkles className="w-5 h-5 text-teal-400" />
              </div>
              <p className="text-gray-400 text-xs font-medium">Generate AI Study Plan</p>
              <p className="text-gray-600 text-[10px]">Tap to create tasks</p>
            </motion.div>
          </Link>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
