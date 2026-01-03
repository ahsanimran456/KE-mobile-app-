"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
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
import Loading from "@/components/loading"

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
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-[#0a0f14] pb-16 pt-2">
      {/* Header */}
      <div className="px-3 py-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white">Tasks</h1>
            <p className="text-gray-500 text-[10px] flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </p>
          </div>
          <Link href="/generate-plan">
            <Button
              size="sm"
              className="h-8 px-3 bg-gradient-to-r from-teal-500 to-teal-400 text-gray-900 rounded-lg text-[10px] font-semibold"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Generate
            </Button>
          </Link>
        </div>
      </div>

      {/* Progress */}
      <div className="px-3 py-1.5">
        <div className="p-2.5 rounded-xl bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-medium text-sm">Progress</span>
            </div>
            <span className="text-teal-400 font-bold">
              {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
            </span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full"
              style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-3 py-1 flex gap-1.5">
        {(["all", "pending", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold capitalize ${
              filter === f
                ? "bg-teal-500 text-gray-900"
                : "bg-gray-800/60 text-gray-400 border border-gray-700/50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Tasks */}
      <div className="px-3 py-1.5">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length > 0 ? (
            <div className="space-y-1.5">
              {filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => task.hasLecture && task.id && router.push(`/tasks/${task.id}`)}
                  className={`p-2.5 rounded-lg border ${
                    task.completed 
                      ? "bg-gray-800/30 border-gray-700/30" 
                      : "bg-gray-800/60 border-gray-700/40"
                  } ${task.hasLecture ? "cursor-pointer" : ""}`}
                >
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={(e) => handleToggleTask(task, e)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        task.completed 
                          ? "bg-teal-500 border-teal-500" 
                          : "border-gray-500"
                      }`}
                    >
                      {task.completed && <Check className="w-3 h-3 text-white" />}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className={`font-medium text-xs truncate ${task.completed ? "text-gray-500 line-through" : "text-white"}`}>
                          {task.title}
                        </h3>
                        {task.hasLecture && (
                          <BookOpen className={`w-3 h-3 flex-shrink-0 ${task.lectureRead ? "text-green-400" : "text-teal-400"}`} />
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-gray-500 text-[10px] flex items-center gap-0.5">
                          <Book className="w-2.5 h-2.5" />{task.subject}
                        </span>
                        <span className="text-gray-600 text-[10px]">•</span>
                        <span className="text-gray-500 text-[10px] flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" />{task.duration}min
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-500 text-[10px]">{task.time}</span>
                      {task.hasLecture ? (
                        <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                      ) : (
                        <button
                          onClick={(e) => task.id && handleDeleteTask(task.id, e)}
                          className="w-6 h-6 rounded flex items-center justify-center text-gray-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-xl bg-gray-800/60 border border-gray-700/40 flex items-center justify-center mx-auto mb-2">
                <ListTodo className="w-6 h-6 text-gray-600" />
              </div>
              <p className="text-gray-400 text-sm mb-1">No tasks yet</p>
              <p className="text-gray-600 text-xs mb-3">Generate an AI study plan</p>
              <Link href="/generate-plan">
                <Button size="sm" className="bg-teal-500 text-gray-900 rounded-lg text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Generate
                </Button>
              </Link>
            </div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  )
}
