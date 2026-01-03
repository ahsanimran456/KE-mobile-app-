"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, Clock, Book, BookOpen, CheckCircle, 
  Loader2, Sparkles, Target, Calendar
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { getTask, markLectureRead, Task } from "@/lib/firestore"
import { toast } from "sonner"

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [marking, setMarking] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
      return
    }

    if (user && id) {
      loadTask()
    }
  }, [user, authLoading, id, router])

  const loadTask = async () => {
    try {
      const taskData = await getTask(id)
      if (taskData) {
        setTask(taskData)
      } else {
        toast.error("Task not found")
        router.push("/tasks")
      }
    } catch (error) {
      console.error("Error loading task:", error)
      toast.error("Failed to load task")
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async () => {
    if (!task?.id || !user) return
    
    setMarking(true)
    try {
      await markLectureRead(task.id, user.uid)
      setTask({ ...task, lectureRead: true, completed: true })
      toast.success("Lecture completed! +15 XP 🎉")
    } catch (error) {
      toast.error("Failed to mark as read")
    } finally {
      setMarking(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0f14] to-[#111820]">
        <div className="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!task) {
    return null
  }

  // Format lecture content with proper line breaks and styling
  const formatLectureContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      // Bold headers (lines starting with **)
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <h3 key={index} className="text-lg font-bold text-cyan-400 mt-6 mb-3">
            {line.replace(/\*\*/g, '')}
          </h3>
        )
      }
      // Numbered lists
      if (/^\d+\./.test(line)) {
        return (
          <p key={index} className="text-gray-300 ml-4 mb-2">
            {line}
          </p>
        )
      }
      // Bullet points
      if (line.startsWith('- ') || line.startsWith('• ') || line.startsWith('✓ ')) {
        return (
          <p key={index} className="text-gray-300 ml-4 mb-2 flex items-start gap-2">
            <span className="text-cyan-400">•</span>
            <span>{line.replace(/^[-•✓]\s*/, '')}</span>
          </p>
        )
      }
      // Regular paragraphs
      if (line.trim()) {
        return (
          <p key={index} className="text-gray-300 mb-3 leading-relaxed">
            {line}
          </p>
        )
      }
      // Empty lines
      return <div key={index} className="h-2" />
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f14] to-[#111820]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0a0f14]/95 backdrop-blur-xl border-b border-gray-800/50">
        <div className="p-4 safe-top">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push("/tasks")}
              className="w-10 h-10 rounded-xl bg-gray-800/50 flex items-center justify-center text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-white font-semibold line-clamp-1">{task.title}</h1>
              <p className="text-gray-400 text-sm">{task.subject}</p>
            </div>
            {task.lectureRead && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/20 text-green-400 text-xs">
                <CheckCircle className="w-3 h-3" />
                Read
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Info */}
      <div className="p-4">
        <div className="flex gap-3 mb-6">
          <div className="flex-1 p-3 rounded-xl bg-gray-800/30 border border-gray-700/50 flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="text-gray-300 text-sm">{task.duration} minutes</span>
          </div>
          <div className="flex-1 p-3 rounded-xl bg-gray-800/30 border border-gray-700/50 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span className="text-gray-300 text-sm">{task.time}</span>
          </div>
          <div className={`flex-1 p-3 rounded-xl border flex items-center gap-2 ${
            task.priority === "high" ? "bg-red-500/10 border-red-500/30" :
            task.priority === "medium" ? "bg-yellow-500/10 border-yellow-500/30" :
            "bg-green-500/10 border-green-500/30"
          }`}>
            <Target className={`w-4 h-4 ${
              task.priority === "high" ? "text-red-400" :
              task.priority === "medium" ? "text-yellow-400" :
              "text-green-400"
            }`} />
            <span className={`text-sm capitalize ${
              task.priority === "high" ? "text-red-400" :
              task.priority === "medium" ? "text-yellow-400" :
              "text-green-400"
            }`}>{task.priority}</span>
          </div>
        </div>

        {/* Lecture Content */}
        {task.hasLecture && task.lectureContent ? (
          <div className="mb-24">
            {/* Lecture Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border border-cyan-500/30">
                <BookOpen className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-400 text-sm font-medium">AI-Generated Lecture</span>
                </div>
                <h2 className="text-xl font-bold text-white">{task.lectureTitle}</h2>
              </div>
            </div>

            {/* Lecture Body */}
            <div className="p-5 rounded-2xl bg-gray-800/30 border border-gray-700/50">
              <div className="prose prose-invert max-w-none">
                {formatLectureContent(task.lectureContent)}
              </div>
            </div>

            {/* Reading Progress Indicator */}
            <div className="mt-6 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Book className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">
                    {task.lectureRead ? "You've completed this lecture!" : "Finish reading to mark as complete"}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {task.lectureRead ? "Great job! Keep up the learning." : "+15 XP when you complete"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Book className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">No lecture content available for this task.</p>
          </div>
        )}
      </div>

      {/* Bottom Action */}
      {task.hasLecture && !task.lectureRead && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0f14] via-[#0a0f14] to-transparent safe-bottom">
          <Button
            onClick={handleMarkAsRead}
            disabled={marking}
            className="w-full h-14 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-gray-900 font-semibold text-lg rounded-xl glow-cyan"
          >
            {marking ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Mark as Read
              </>
            )}
          </Button>
        </div>
      )}

      {task.lectureRead && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0f14] via-[#0a0f14] to-transparent safe-bottom">
          <Button
            onClick={() => router.push("/tasks")}
            className="w-full h-14 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 font-semibold text-lg rounded-xl"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Completed! Back to Tasks
          </Button>
        </div>
      )}
    </div>
  )
}

