"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Check, Clock, Book, Calendar, 
  Sparkles, Trash2, BookOpen, ChevronRight, ListTodo, Target
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { 
  subscribeToTasks, 
  completeTask, 
  uncompleteTask, 
  deleteTask as deleteTaskFromDb,
  Task
} from "@/lib/firestore"
import { toast } from "sonner"
import BottomNav from "@/components/bottom-nav"

export default function TasksPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all")

  const today = new Date().toISOString().split("T")[0]

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
      return
    }
    if (user) {
      const unsubscribe = subscribeToTasks(user.uid, today, (updatedTasks) => {
        setTasks(updatedTasks)
        setLoading(false)
      })
      return () => unsubscribe()
    }
  }, [user, authLoading, router, today])

  const handleToggleTask = async (task: Task, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user || !task.id) return
    try {
      if (task.completed) {
        await uncompleteTask(task.id)
        toast.info("Task pending")
      } else {
        await completeTask(task.id, user.uid)
        toast.success("+10 XP 🎉")
      }
    } catch (error) {
      toast.error("Failed to update")
    }
  }

  const handleDeleteTask = async (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await deleteTaskFromDb(taskId)
      toast.success("Deleted")
    } catch (error) {
      toast.error("Failed")
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === "pending") return !task.completed
    if (filter === "completed") return task.completed
    return true
  })

  const completedCount = tasks.filter(t => t.completed).length
  const totalCount = tasks.length

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Tasks</h1>
            <p className="text-gray-500 text-xs flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </p>
          </div>
          <Button
            onClick={() => router.push("/generate-plan")}
            size="sm"
            className="h-10 px-4 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-gray-900 rounded-xl text-xs font-semibold shadow-lg shadow-cyan-500/30"
          >
            <Sparkles className="w-4 h-4 mr-1" />
            Generate
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 py-2">
        <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-cyan-500/20 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-semibold">Daily Progress</span>
            </div>
            <span className="text-cyan-400 font-bold text-lg">
              {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
            </span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all shadow-[0_0_10px_rgba(0,217,255,0.5)]"
              style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            />
          </div>
          <p className="text-gray-400 text-xs mt-2">{completedCount}/{totalCount} tasks completed</p>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 py-2 flex gap-2">
        {(["all", "pending", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all capitalize ${
              filter === f
                ? "bg-gradient-to-r from-cyan-500 to-cyan-400 text-gray-900 shadow-lg shadow-cyan-500/30"
                : "bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:border-gray-600"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Tasks */}
      <div className="px-4 py-2">
        {filteredTasks.length > 0 ? (
          <div className="space-y-2">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => task.hasLecture && task.id && router.push(`/tasks/${task.id}`)}
                className={`p-3.5 rounded-xl border transition-all shadow-lg ${
                  task.completed 
                    ? "bg-gray-800/30 border-gray-700/30" 
                    : "bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700/40"
                } ${task.hasLecture ? "cursor-pointer active:scale-[0.98]" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => handleToggleTask(task, e)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      task.completed 
                        ? "bg-gradient-to-br from-cyan-500 to-cyan-600 border-cyan-500 shadow-md shadow-cyan-500/30" 
                        : "border-gray-500 hover:border-cyan-400"
                    }`}
                  >
                    {task.completed && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-medium text-sm truncate ${task.completed ? "text-gray-500 line-through" : "text-white"}`}>
                        {task.title}
                      </h3>
                      {task.hasLecture && (
                        <div className={`w-5 h-5 rounded flex items-center justify-center ${
                          task.lectureRead 
                            ? "bg-green-500/20" 
                            : "bg-cyan-500/20"
                        }`}>
                          <BookOpen className={`w-3 h-3 ${task.lectureRead ? "text-green-400" : "text-cyan-400"}`} />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-gray-500 text-xs flex items-center gap-1">
                        <Book className="w-3 h-3" />
                        {task.subject}
                      </span>
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-500 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.duration}min
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs font-medium">{task.time}</span>
                    {task.hasLecture ? (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    ) : (
                      <button
                        onClick={(e) => task.id && handleDeleteTask(task.id, e)}
                        className="w-8 h-8 rounded-lg hover:bg-red-500/20 flex items-center justify-center text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/40 flex items-center justify-center mx-auto mb-3 shadow-xl">
              <ListTodo className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-400 font-medium mb-1">No tasks yet</p>
            <p className="text-gray-600 text-sm mb-4">Generate an AI study plan to get started</p>
            <Button
              onClick={() => router.push("/generate-plan")}
              className="bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-gray-900 rounded-xl font-semibold shadow-lg shadow-cyan-500/30"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Plan
            </Button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
