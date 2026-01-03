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
    <div className="min-h-screen bg-[#0a0f14] pb-28 pt-4">
      {/* Header */}
      <div className="px-5 py-2 flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-xs">Welcome Back 👋</p>
          <h1 className="text-xl font-bold text-white">{firstName}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/settings/notifications">
            <motion.div 
              whileTap={{ scale: 0.9 }}
              className="w-11 h-11 rounded-xl bg-gray-800/80 border border-gray-700/50 flex items-center justify-center text-gray-400 relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-teal-400 rounded-full" />
            </motion.div>
          </Link>
          <Link href="/profile">
            <motion.div 
              whileTap={{ scale: 0.9 }}
              className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-teal-500/30"
            >
              {firstName.charAt(0)}
            </motion.div>
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="px-5 py-3">
        <div className="flex gap-3">
          {/* Progress Card */}
          <div className="flex-1 p-4 rounded-2xl bg-gray-800/60 border border-gray-700/40">
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14">
                <svg className="w-14 h-14 -rotate-90">
                  <circle cx="28" cy="28" r="22" fill="none" stroke="#1f2937" strokeWidth="5" />
                  <circle 
                    cx="28" cy="28" r="22" fill="none" stroke="#14b8a6" strokeWidth="5" strokeLinecap="round"
                    strokeDasharray={`${dailyProgress.percentage * 1.38} 138`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Target className="w-5 h-5 text-teal-400" />
                </div>
              </div>
              <div>
                <p className="text-white font-bold text-2xl leading-none">{dailyProgress.percentage}%</p>
                <p className="text-gray-500 text-xs mt-0.5">{dailyProgress.completed}/{dailyProgress.total} Tasks</p>
              </div>
            </div>
          </div>

          {/* Study Time Card */}
          <div className="flex-1 p-4 rounded-2xl bg-gray-800/60 border border-gray-700/40">
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14">
                <svg className="w-14 h-14 -rotate-90">
                  <circle cx="28" cy="28" r="22" fill="none" stroke="#1f2937" strokeWidth="5" />
                  <circle 
                    cx="28" cy="28" r="22" fill="none" stroke="#22c55e" strokeWidth="5" strokeLinecap="round"
                    strokeDasharray={`${energyPercent * 1.38} 138`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-green-400" />
                </div>
              </div>
              <div>
                <p className="text-white font-bold text-2xl leading-none">{Math.round(studiedMinutes / 60 * 10) / 10}h</p>
                <p className="text-gray-500 text-xs mt-0.5">of {studyGoal}h goal</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Streak & Level Row */}
      <div className="px-5 py-2">
        <div className="flex gap-2">
          <div className="flex-1 py-3 px-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">{profile?.streak || 0} Days</p>
              <p className="text-gray-500 text-[10px] mt-0.5">Streak</p>
            </div>
          </div>
          <div className="flex-1 py-3 px-4 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
              <Star className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">Lvl {profile?.level || 1}</p>
              <p className="text-gray-500 text-[10px] mt-0.5">{profile?.xp || 0} XP</p>
            </div>
          </div>
          <div className="flex-1 py-3 px-4 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">{profile?.subjects?.length || 0}</p>
              <p className="text-gray-500 text-[10px] mt-0.5">Subjects</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action */}
      <div className="px-5 py-3">
        <Link href="/assistant">
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="p-4 rounded-2xl bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/30 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/30">
              <Play className="w-5 h-5 text-white ml-0.5" />
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold">Start Learning</p>
              <p className="text-gray-400 text-xs">Chat with AI Assistant</p>
            </div>
            <ChevronRight className="w-5 h-5 text-teal-400" />
          </motion.div>
        </Link>
      </div>

      {/* AI Tools */}
      <div className="px-5 py-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-semibold">AI Tools</h2>
          <Link href="/assistant" className="text-teal-400 text-xs font-medium">See all</Link>
        </div>
        <div className="flex gap-3">
          {quickTools.map((tool, i) => (
            <Link key={i} href="/assistant" className="flex-1">
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="p-4 rounded-xl bg-gray-800/60 border border-gray-700/40 flex flex-col items-center gap-2"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center`}>
                  <tool.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-white text-xs font-medium">{tool.label}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* Today's Tasks */}
      <div className="px-5 py-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-semibold">Today&apos;s Tasks</h2>
          <Link href="/tasks" className="text-teal-400 text-xs font-medium">View all</Link>
        </div>
        
        {tasks.length > 0 ? (
          <div className="space-y-2">
            {tasks.slice(0, 3).map((task) => (
              <motion.div 
                key={task.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => task.hasLecture && task.id && router.push(`/tasks/${task.id}`)}
                className={`p-4 rounded-xl border flex items-center gap-3 ${
                  task.completed ? "bg-gray-800/30 border-gray-700/30" : "bg-gray-800/60 border-gray-700/40"
                } ${task.hasLecture ? "cursor-pointer" : ""}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  task.completed 
                    ? "bg-gradient-to-br from-green-500 to-emerald-600" 
                    : "bg-teal-500/20 border border-teal-500/30"
                }`}>
                  {task.completed ? (
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <BookOpen className="w-4 h-4 text-teal-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm truncate ${task.completed ? "text-gray-500 line-through" : "text-white"}`}>
                    {task.title}
                  </p>
                  <p className="text-gray-500 text-xs">{task.subject} • {task.duration}min</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-xs">{task.time}</p>
                  {task.hasLecture && !task.completed && (
                    <span className="text-teal-400 text-[10px]">📖</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <Link href="/generate-plan">
            <motion.div
              whileTap={{ scale: 0.98 }}
              className="p-6 rounded-xl bg-gray-800/40 border border-dashed border-gray-700 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-6 h-6 text-teal-400" />
              </div>
              <p className="text-gray-400 text-sm font-medium">Generate AI Study Plan</p>
              <p className="text-gray-600 text-xs">Tap to create tasks</p>
            </motion.div>
          </Link>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
