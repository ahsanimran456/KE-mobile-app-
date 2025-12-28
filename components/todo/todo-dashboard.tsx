"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  LogOut, 
  Calendar, 
  Clock, 
  Search,
  ListTodo,
  CheckCircle2,
  Circle,
  Sparkles,
  AlertCircle,
  Menu
} from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

export default function TodoDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [newTask, setNewTask] = useState({ title: "", description: "" })
  const [editTask, setEditTask] = useState({ title: "", description: "" })
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")
  const [errors, setErrors] = useState<{ title?: string }>({})

  // Load tasks from localStorage
  useEffect(() => {
    if (user) {
      const storedTasks = localStorage.getItem(`tasks_${user.id}`)
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks))
      }
    }
  }, [user])

  // Save tasks to localStorage
  const saveTasks = (updatedTasks: Task[]) => {
    if (user) {
      localStorage.setItem(`tasks_${user.id}`, JSON.stringify(updatedTasks))
      setTasks(updatedTasks)
    }
  }

  // Create task
  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      setErrors({ title: "Task title is required" })
      return
    }

    const task: Task = {
      id: crypto.randomUUID(),
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    saveTasks([task, ...tasks])
    setNewTask({ title: "", description: "" })
    setIsAddingTask(false)
    setErrors({})
  }

  // Update task
  const handleUpdateTask = (taskId: string) => {
    if (!editTask.title.trim()) {
      setErrors({ title: "Task title is required" })
      return
    }

    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? { 
            ...task, 
            title: editTask.title.trim(), 
            description: editTask.description.trim(),
            updatedAt: new Date().toISOString()
          }
        : task
    )

    saveTasks(updatedTasks)
    setEditingTaskId(null)
    setEditTask({ title: "", description: "" })
    setErrors({})
  }

  // Delete task
  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId)
    saveTasks(updatedTasks)
  }

  // Toggle completion
  const handleToggleComplete = (taskId: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
        : task
    )
    saveTasks(updatedTasks)
  }

  // Start editing
  const startEditing = (task: Task) => {
    setEditingTaskId(task.id)
    setEditTask({ title: task.title, description: task.description })
    setErrors({})
  }

  // Cancel editing
  const cancelEditing = () => {
    setEditingTaskId(null)
    setEditTask({ title: "", description: "" })
    setErrors({})
  }

  // Handle logout
  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  // Filter and search tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = 
      filter === "all" ||
      (filter === "active" && !task.completed) ||
      (filter === "completed" && task.completed)

    return matchesSearch && matchesFilter
  })

  const completedCount = tasks.filter((t) => t.completed).length
  const activeCount = tasks.length - completedCount

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric",
      year: "numeric"
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", { 
      hour: "2-digit", 
      minute: "2-digit"
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 safe-area-inset-top safe-area-inset-bottom">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-orange-400 rounded-full opacity-5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-amber-400 rounded-full opacity-5 blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-4 sm:py-8 pb-24 sm:pb-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-200">
              <ListTodo className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Tasks</h1>
              <p className="text-gray-500 text-xs sm:text-sm">Welcome back, {user?.username}!</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 hover:text-gray-900 transition-all duration-200 shadow-sm text-sm sm:text-base touch-manipulation"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-3 sm:p-4 text-center shadow-sm">
            <p className="text-xl sm:text-3xl font-bold text-gray-900">{tasks.length}</p>
            <p className="text-gray-500 text-xs sm:text-sm">Total</p>
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-3 sm:p-4 text-center shadow-sm">
            <p className="text-xl sm:text-3xl font-bold text-orange-500">{activeCount}</p>
            <p className="text-gray-500 text-xs sm:text-sm">Active</p>
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-3 sm:p-4 text-center shadow-sm">
            <p className="text-xl sm:text-3xl font-bold text-green-500">{completedCount}</p>
            <p className="text-gray-500 text-xs sm:text-sm">Done</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-5 sm:mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-all duration-200 text-base shadow-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {(["all", "active", "completed"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-200 capitalize text-sm whitespace-nowrap flex-shrink-0 touch-manipulation ${
                  filter === f
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-200"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Add Task Button / Form */}
        {!isAddingTask ? (
          <button
            onClick={() => {
              setIsAddingTask(true)
              setErrors({})
            }}
            className="w-full mb-5 sm:mb-6 py-3.5 sm:py-4 flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-white border-2 border-dashed border-orange-300 text-orange-500 hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 font-medium touch-manipulation"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Task</span>
          </button>
        ) : (
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-4 sm:p-6 mb-5 sm:mb-6 shadow-lg shadow-orange-100/50 animate-in slide-in-from-top-4 duration-300">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              New Task
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => {
                    setNewTask({ ...newTask, title: e.target.value })
                    if (errors.title) setErrors({})
                  }}
                  placeholder="Task title"
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all duration-200 text-base ${
                    errors.title
                      ? "border-red-300 focus:ring-red-100"
                      : "border-gray-200 focus:ring-orange-100 focus:border-orange-400"
                  }`}
                  autoFocus
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.title}
                  </p>
                )}
              </div>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Description (optional)"
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 focus:bg-white transition-all duration-200 resize-none text-base"
              />
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={handleAddTask}
                  className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl shadow-md shadow-orange-200 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base touch-manipulation"
                >
                  <Check className="w-5 h-5" />
                  Add Task
                </button>
                <button
                  onClick={() => {
                    setIsAddingTask(false)
                    setNewTask({ title: "", description: "" })
                    setErrors({})
                  }}
                  className="px-4 sm:px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-all duration-200 touch-manipulation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Task List */}
        <div className="space-y-3 sm:space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-8 sm:p-12 text-center shadow-sm">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-4">
                <ListTodo className="w-7 h-7 sm:w-8 sm:h-8 text-orange-300" />
              </div>
              <p className="text-gray-500 text-base sm:text-lg">
                {searchQuery || filter !== "all" 
                  ? "No tasks found" 
                  : "No tasks yet. Add your first task!"}
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white rounded-xl sm:rounded-2xl border p-4 sm:p-5 transition-all duration-300 shadow-sm ${
                  task.completed
                    ? "border-gray-100 opacity-75"
                    : "border-gray-100 shadow-md"
                }`}
              >
                {editingTaskId === task.id ? (
                  /* Edit Mode */
                  <div className="space-y-3 sm:space-y-4">
                    <input
                      type="text"
                      value={editTask.title}
                      onChange={(e) => {
                        setEditTask({ ...editTask, title: e.target.value })
                        if (errors.title) setErrors({})
                      }}
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all duration-200 text-base ${
                        errors.title
                          ? "border-red-300 focus:ring-red-100"
                          : "border-gray-200 focus:ring-orange-100 focus:border-orange-400"
                      }`}
                      autoFocus
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.title}
                      </p>
                    )}
                    <textarea
                      value={editTask.description}
                      onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 focus:bg-white transition-all duration-200 resize-none text-base"
                    />
                    <div className="flex gap-2 sm:gap-3">
                      <button
                        onClick={() => handleUpdateTask(task.id)}
                        className="flex-1 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium rounded-xl shadow-md shadow-orange-200 transition-all duration-200 flex items-center justify-center gap-2 text-sm touch-manipulation"
                      >
                        <Check className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="px-4 sm:px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-all duration-200 text-sm touch-manipulation"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <div className="flex gap-3 sm:gap-4">
                    {/* Completion toggle */}
                    <button
                      onClick={() => handleToggleComplete(task.id)}
                      className="flex-shrink-0 mt-0.5 touch-manipulation"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500 transition-all duration-200" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-300 hover:text-orange-400 transition-all duration-200" />
                      )}
                    </button>

                    {/* Task content */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-base sm:text-lg font-medium transition-all duration-200 ${
                          task.completed ? "text-gray-400 line-through" : "text-gray-900"
                        }`}
                      >
                        {task.title}
                      </h3>
                      {task.description && (
                        <p
                          className={`mt-1 text-sm transition-all duration-200 ${
                            task.completed ? "text-gray-300" : "text-gray-500"
                          }`}
                        >
                          {task.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 sm:mt-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(task.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatTime(task.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-start gap-1 sm:gap-2">
                      <button
                        onClick={() => startEditing(task)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all duration-200 touch-manipulation"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all duration-200 touch-manipulation"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Mobile FAB for adding task */}
      <button
        onClick={() => {
          setIsAddingTask(true)
          setErrors({})
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        className="fixed bottom-6 right-6 sm:hidden w-14 h-14 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full shadow-lg shadow-orange-300 flex items-center justify-center text-white z-50 active:scale-95 transition-transform touch-manipulation safe-area-inset-bottom"
        style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  )
}
